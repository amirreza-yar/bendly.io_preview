export async function fetchPayloadSchema() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.PAYLOAD_API_KEY && {
        Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`,
      }),
    },
    body: JSON.stringify({
      query: `
        query IntrospectionQuery {
          __schema {
            queryType { fields { name type { name ofType { name } } } }
            types {
              name
              kind
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      `,
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch DB schema via GraphQL')
  const { data } = await res.json()

  const queryFields = data.__schema.queryType.fields.map((f: any) => f.name)

  const collections = data.__schema.types
    .filter(
      (t: any) => t.kind === 'OBJECT' && queryFields.includes(t.name), // keep only types matching top-level queries
    )
    .map((t: any) => ({
      slug: String(t.name),
      fields: t.fields.map((f: any) => ({
        name: String(f.name),
        type: String(f.type.name || f.type.ofType?.name || 'unknown'),
        kind: String(f.type.kind),
      })),
    }))

  return { collections }
}
