// src/lib/db.ts
import Dexie, { Table } from "dexie";
import type { StoredFlashing } from "@/types/flashingTypes";
import { StoredMaterialAndProps } from "@/types/material&PropsType";
import { Template } from "@/types/templateType";
import { StoredOrder } from "@/types/orderTypes";
import { StoredJobReference } from "@/types/jobReferenceTypes";

export interface UserProfile {
  id: string; // Primary key - user ID
  email: string;
  fullname: string;
  phone?: string;
  roleId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export class AppDB extends Dexie {
  userProfile!: Table<UserProfile, string>;
  flashings!: Table<StoredFlashing, string>;
  materialsAndProps!: Table<StoredMaterialAndProps, number>;
  templates!: Table<Template, string>;
  orders!: Table<StoredOrder, number>;
  jobReferences!: Table<StoredJobReference, string>;

  constructor() {
    super("AppDB");
    this.version(2).stores({
      // Existing tables
      flashings:
        "id, material, material_data, color, thickness, createdAt, updatedAt, crushFoldDir",
      materialsAndProps: "material",
      templates: "name, owner",
      orders: "id, status, progress, deliveryType",
      jobReferences: "id, code, projectName",
      // New user profile table for authenticated user data
      userProfile: "id, email, roleId, status",
    });
  }
}

export const db = new AppDB();

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
