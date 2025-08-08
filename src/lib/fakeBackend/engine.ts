import {
  graphql,
  Kind,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql'
import { getSchema, buildSchemaDefinitions } from './schema'
import { seedInit } from './seed'
import { collectionMap } from './types'

let builtSchema: GraphQLSchema | undefined

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary JSON object',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => (ast.kind === Kind.STRING ? JSON.parse(ast.value) : null),
})

function guessType(value: any): string {
  if (value === null || value === undefined) return 'String'
  if (Array.isArray(value) || typeof value === 'object') return 'JSON'
  if (typeof value === 'boolean') return 'Boolean'
  if (typeof value === 'number') return 'Float'
  return 'String'
}

// Map GraphQL scalars
function mapScalar(type: string) {
  const nonNull = type.endsWith('!')
  const base = nonNull ? type.slice(0, -1) : type
  let gqlType: any
  switch (base) {
    case 'ID':
    case 'String':
      gqlType = GraphQLString
      break
    case 'Boolean':
      gqlType = GraphQLBoolean
      break
    case 'Float':
      gqlType = GraphQLFloat
      break
    case 'JSON':
      gqlType = JSONScalar
      break
    default:
      gqlType = GraphQLString
  }
  return nonNull ? new GraphQLNonNull(gqlType) : gqlType
}

// Resolve GraphQL types (objects, lists, scalars)
function resolveGraphQLType(
  typeName: string,
  typeMap: Record<string, GraphQLObjectType>,
): GraphQLOutputType {
  const nonNull = typeName.endsWith('!')
  const clean = nonNull ? typeName.slice(0, -1) : typeName
  let gqlType: any

  if (clean.startsWith('[') && clean.endsWith(']')) {
    const inner = clean.slice(1, -1)
    const innerType = typeMap[inner] || mapScalar(inner)
    gqlType = new GraphQLList(innerType)
  } else {
    gqlType = typeMap[clean] || mapScalar(clean)
  }

  return nonNull ? new GraphQLNonNull(gqlType) : gqlType
}

// Build GraphQL Schema dynamically from our custom schema
export function buildExecutableSchema(): GraphQLSchema {
  buildSchemaDefinitions()
  const s = getSchema()
  const typeMap: Record<string, GraphQLObjectType> = {}

  // First pass: create shells for all types
  s.types.forEach((typeDef, typeName) => {
    typeMap[typeName] = new GraphQLObjectType({
      name: typeName,
      fields: () => {
        const fields: any = {}

        // If type has no explicit fields (like User, Session), infer them from the collection sample
        if (typeDef.fields.length === 0 && !['Query', 'Mutation'].includes(typeName)) {
          const collection = (collectionMap as any)[typeName.toLowerCase()]
          if (collection && collection.length > 0) {
            Object.keys(collection[0]).forEach((k) => {
              fields[k] = {
                type: mapScalar(guessType(collection[0][k])),
                resolve: (obj: any) => obj[k],
              }
            })
          }
        }

        // Add explicitly defined fields
        typeDef.fields.forEach((f) => {
          fields[f.name] = {
            type: resolveGraphQLType(f.type, typeMap),
            args: (f.args || []).reduce((acc, arg) => {
              acc[arg.name] = { type: mapScalar(arg.type) }
              return acc
            }, {} as any),
            resolve: f.resolve,
          }
        })
        return fields
      },
    })
  })

  return new GraphQLSchema({
    query: typeMap[s.queryType],
    mutation: typeMap[s.mutationType],
  })
}

// Lazy schema + seeding
function getBuiltSchema(): GraphQLSchema {
  if (!builtSchema) {
    seedInit() // Preload DB
    builtSchema = buildExecutableSchema()
  }
  return builtSchema
}

// Execute GraphQL query
export async function executeGraphQL(query: string, variables: Record<string, any> = {}) {
  return graphql({
    schema: getBuiltSchema(),
    source: query,
    variableValues: variables,
  })
}
