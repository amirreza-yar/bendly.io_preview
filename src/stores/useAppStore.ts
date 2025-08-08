import { create } from 'zustand'
import { db, ContentSchema, Template, Order, CanvasState } from '../lib/db'

interface AppState {
  user: any | null
  contentSchemas: ContentSchema[]
  templates: Template[]
  orders: Order[]
  canvasState: CanvasState | null

  setUser: (user: any) => void
  loadContentSchemas: () => Promise<void>
  loadTemplates: () => Promise<void>
  loadOrders: () => Promise<void>
  saveCanvasState: (state: CanvasState) => Promise<void>
  queueAction: (type: string, payload: any) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  contentSchemas: [],
  templates: [],
  orders: [],
  canvasState: null,

  setUser: (user) => set({ user }),

  loadContentSchemas: async () => {
    const contentSchemas = await db.contentSchemas.toArray()
    set({ contentSchemas })
  },

  loadTemplates: async () => {
    const templates = await db.templates.toArray()
    set({ templates })
  },

  loadOrders: async () => {
    const orders = await db.orders.toArray()
    set({ orders })
  },

  saveCanvasState: async (state) => {
    await db.canvasStates.put(state)
    set({ canvasState: state })
  },

  queueAction: async (type, payload) => {
    await db.syncQueue.add({ type, payload, createdAt: Date.now() })
  },
}))
