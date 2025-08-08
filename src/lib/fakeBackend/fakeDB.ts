import { collectionMap } from './types'

type Collections = typeof collectionMap
type CollectionName = keyof Collections

const idCounters: Record<string, number> = {}

/**
 * Create a new record in a collection
 */
export function create<K extends CollectionName>(
  collection: K,
  data: Omit<Collections[K][number], 'id'>,
) {
  if (!idCounters[collection]) {
    const existing = collectionMap[collection]
    idCounters[collection] = existing.length
  }
  idCounters[collection] += 1
  const newItem = { id: idCounters[collection].toString(), ...data }
  collectionMap[collection].push(newItem as Collections[K][number])
  return newItem
}

/**
 * Get all records from a collection
 */
export function findAll<K extends CollectionName>(collection: K) {
  return collectionMap[collection]
}

/**
 * Get one record by ID
 */
export function findOne<K extends CollectionName>(collection: K, id: string) {
  return collectionMap[collection].find((item: any) => item.id === id) || null
}

/**
 * Update a record by ID
 */
export function update<K extends CollectionName>(
  collection: K,
  id: string,
  data: Partial<Omit<Collections[K][number], 'id'>>,
) {
  const idx = collectionMap[collection].findIndex((item: any) => item.id === id)
  if (idx === -1) return null
  collectionMap[collection][idx] = { ...collectionMap[collection][idx], ...data }
  return collectionMap[collection][idx]
}

/**
 * Remove a record by ID
 */
export function remove<K extends CollectionName>(collection: K, id: string) {
  const idx = collectionMap[collection].findIndex((item: any) => item.id === id)
  if (idx === -1) return false
  collectionMap[collection].splice(idx, 1)
  return true
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Before:', findAll('user'))
  const u = create('user', { email: 'john@example.com' } as any)
  console.log('Created:', u)
  console.log('After:', findAll('user'))
  update('user', u.id, { email: 'jane@example.com' })
  console.log('Updated:', findOne('user', u.id))
  remove('user', u.id)
  console.log('Removed:', findAll('user'))
}
