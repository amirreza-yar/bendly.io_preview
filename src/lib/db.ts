import Dexie, { Table } from 'dexie'

export interface ContentSchema {
  collection: string
  schema: any
  updatedAt: number
}
export interface Template {
  id: string
  name: string
  data: any
  updatedAt: number
}
export interface Order {
  id: string
  status: string
  payload: any
  updatedAt: number
}
export interface CanvasState {
  id: string
  data: any
  updatedAt: number
}
export interface SyncAction {
  id?: number
  type: string
  payload: any
  createdAt: number
}

export class AppDB extends Dexie {
  contentSchemas!: Table<ContentSchema>
  templates!: Table<Template>
  orders!: Table<Order>
  canvasStates!: Table<CanvasState>
  syncQueue!: Table<SyncAction>

  constructor() {
    super('AppDB')
    this.version(1).stores({
      contentSchemas: 'collection, updatedAt',
      templates: 'id, updatedAt',
      orders: 'id, status, updatedAt',
      canvasStates: 'id, updatedAt',
      syncQueue: '++id, type, createdAt',
    })
  }
}

export const db = new AppDB()
