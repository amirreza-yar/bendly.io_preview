const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string
if (!API_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined')
}

async function callGraphQL<T = any>(query: string): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors.map((e: any) => e.message).join(', '))
  return json.data as T
}

export function listEntities(entity: string, fields: string[]) {
  const query = `{ list${capitalizePlural(entity)} { ${fields.join(' ')} } }`
  return callGraphQL(query)
}

export function getEntity(entity: string, id: string, fields: string[]) {
  const query = `{ get${capitalize(entity)}(id: "${id}") { ${fields.join(' ')} } }`
  return callGraphQL(query)
}

export function createEntity(entity: string, input: Record<string, any>, fields: string[]) {
  const args = Object.entries(input)
    .map(([k, v]) => `${k}: ${formatValue(v)}`)
    .join(', ')
  const query = `mutation { create${capitalize(entity)}(${args}) { ${fields.join(' ')} } }`
  return callGraphQL(query)
}

export function updateEntity(
  entity: string,
  id: string,
  input: Record<string, any>,
  fields: string[],
) {
  const args = Object.entries(input)
    .map(([k, v]) => `${k}: ${formatValue(v)}`)
    .join(', ')
  const query = `mutation { update${capitalize(entity)}(id: "${id}", ${args}) { ${fields.join(' ')} } }`
  return callGraphQL(query)
}

export function deleteEntity(entity: string, id: string) {
  const query = `mutation { delete${capitalize(entity)}(id: "${id}") }`
  return callGraphQL(query)
}

// Helpers
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function capitalizePlural(s: string) {
  const c = capitalize(s)
  return c.endsWith('s') ? c : c + 's'
}
function formatValue(val: any): string {
  if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`
  if (typeof val === 'boolean' || typeof val === 'number') return String(val)
  return JSON.stringify(val)
}
