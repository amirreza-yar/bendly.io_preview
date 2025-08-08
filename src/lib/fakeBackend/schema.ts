import { findOne, findAll, create, update, remove } from './fakeDB'
import { collectionMap } from './types'

export type Scalar = 'ID' | 'String' | 'Int' | 'Float' | 'Boolean'

export type Argument = {
  name: string
  type: Scalar | string
}

export type Field = {
  name: string
  type: string
  args: Argument[]
  resolve: (args: Record<string, any>, ctx: any) => any
}

export type Type = {
  name: string
  kind: 'OBJECT'
  fields: Field[]
}

export type Schema = {
  queryType: string
  mutationType: string
  types: Map<string, Type>
}

const schema: Schema = {
  queryType: 'Query',
  mutationType: 'Mutation',
  types: new Map(),
}

export function defineType(name: string): void {
  if (!schema.types.has(name)) {
    schema.types.set(name, { name, kind: 'OBJECT', fields: [] })
  }
}

export function addField(typeName: string, field: Field): void {
  const type = schema.types.get(typeName)
  if (!type) throw new Error(`Type '${typeName}' not found.`)
  type.fields.push(field)
}

export function getSchema(): Schema {
  return schema
}

function guessType(value: any): string {
  if (value === null || value === undefined) return 'String'
  if (Array.isArray(value) || typeof value === 'object') return 'JSON'
  if (typeof value === 'boolean') return 'Boolean'
  if (typeof value === 'number') return 'Float'
  return 'String'
}

// --- Infer fields dynamically from existing data ---
function inferFieldsForType(collection: string) {
  const data = (collectionMap as any)[collection] || []
  const keys = new Set<string>()
  data.forEach((item: any) => {
    Object.keys(item).forEach((key) => keys.add(key))
  })
  if (keys.size === 0) keys.add('id') // fallback

  return Array.from(keys).map((key) => ({
    name: key,
    type: guessType(data[0]?.[key]),
    args: [],
    resolve: (obj: any) => obj[key],
  }))
}

// --- Bootstrap schema ---
export function buildSchemaDefinitions() {
  schema.types.clear()
  defineType('Query')
  defineType('Mutation')
  ;(Object.keys(collectionMap) as (keyof typeof collectionMap)[]).forEach((key) => {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1)
    const pascalPlural = pascal.endsWith('s') ? pascal : pascal + 's'

    // Define type & fields
    defineType(pascal)
    const fields = inferFieldsForType(key as string)
    fields.forEach((f) => addField(pascal, f))

    // Queries
    addField('Query', {
      name: `get${pascal}`,
      type: pascal,
      args: [{ name: 'id', type: 'ID' }],
      resolve: (_: any, { id }) => {
        const obj = findOne(key, id)
        return obj ? { ...obj } : null
      },
    })

    addField('Query', {
      name: `list${pascalPlural}`,
      type: `[${pascal}]`,
      args: [],
      resolve: () => findAll(key).map((obj) => ({ ...obj })),
    })

    // Build dynamic args for each field (except id)
    const dynamicArgs = fields
      .filter((f) => f.name !== 'id')
      .map((f) => ({ name: f.name, type: f.type }))

    // Mutations
    addField('Mutation', {
      name: `create${pascal}`,
      type: pascal,
      args: dynamicArgs,
      resolve: (_: any, args) => create(key, args),
    })

    addField('Mutation', {
      name: `update${pascal}`,
      type: pascal,
      args: [{ name: 'id', type: 'ID' }, ...dynamicArgs],
      resolve: (_: any, { id, ...rest }) => update(key, id, rest),
    })

    addField('Mutation', {
      name: `delete${pascal}`,
      type: 'Boolean!',
      args: [{ name: 'id', type: 'ID' }],
      resolve: (_: any, { id }) => !!remove(key, id),
    })
  })
}
