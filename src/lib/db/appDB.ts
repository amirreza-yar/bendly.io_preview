// src/lib/db.ts
import Dexie, { Table } from 'dexie'
import type { StoredFlashing } from '@/types/flashingTypes'
import { StoredMaterialAndProps } from '@/types/material&PropsType'
import { Template } from '@/types/template/templateType'
import { StoredOrder } from '@/types/orderTypes'
import { StoredJobReference } from '@/types/jobReferenceTypes'

export interface User {
  id?: string
  name: string
}

export class AppDB extends Dexie {
  users!: Table<User, string | number>
  flashings!: Table<StoredFlashing, string>
  materialsAndProps!: Table<StoredMaterialAndProps, number>
  templates!: Table<Template, string>
  orders!: Table<StoredOrder, number>
  jobReferences!: Table<StoredJobReference, number>

  constructor() {
    super('AppDB')
    this.version(1).stores({
      // only index fields you actually query
      users: '++id, name',
      flashings: 'id, material, color, thickness, createdAt, updatedAt',
      materialsAndProps: 'material',
      templates: 'name, owner',
      orders: 'id, status, progress, deliveryType',
      jobReferences: 'code, projectName',
    })
  }
}

export const db = new AppDB()

/**
 * Lazy DB instance — don't create it on module load to avoid SSR errors.
 * Call initDB() on the client to initialize.
 */
// let dbInstance: AppDB | null = null

// export async function initDB(): Promise<AppDB> {
//   if (dbInstance) return dbInstance

//   if (typeof window === 'undefined' || !('indexedDB' in window)) {
//     throw new Error('IndexedDB not available in this environment (server or unsupported browser).')
//   }

//   dbInstance = new AppDB()
//   try {
//     // open() is optional; Dexie opens automatically on demand but calling open() gives earlier errors
//     await dbInstance.open()
//   } catch (err) {
//     // If DB open fails, reset instance so next call may retry
//     dbInstance = null
//     throw err
//   }
//   return dbInstance
// }

/**
 * Helper: get DB instance if initialized, otherwise throws.
 * Use this in client code when you are sure initDB() was called.
 */
// export function getDBOrThrow(): Promise<AppDB> {
//   if (!dbInstance) {
//     return initDB()
//   } else {
//     console.log('db instance: ', dbInstance)
//     return dbInstance
//   }
// }

// export function getDBOrThrow(): Promise<AppDB> {
//   return initDB()
// }
