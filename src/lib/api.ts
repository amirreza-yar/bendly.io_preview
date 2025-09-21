// Main API integration file - replaces all old API utilities
// This file provides a unified interface for all GraphQL operations

// Re-export all GraphQL operations
export * from './graphql/auth'
export * from './graphql/operations'
export * from './graphql/payments'

// Re-export sync service
export { syncService } from './sync/syncService'

// Re-export GraphQL client
export { urqlClient } from './urqlClient'

// Legacy API compatibility layer
// This ensures existing code continues to work while we migrate to GraphQL

import { graphqlOperations } from './graphql/operations'
import { paymentService } from './graphql/payments'
import { syncService } from './sync/syncService'

// Legacy API functions that map to GraphQL operations
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const { graphqlLogin } = await import('./graphql/auth')
      return graphqlLogin(email, password)
    },
    register: async (email: string, fullname: string, phone: string, password: string) => {
      const { graphqlRegister } = await import('./graphql/auth')
      return graphqlRegister(email, fullname, phone, password)
    },
    logout: async () => {
      const { graphqlLogout } = await import('./graphql/auth')
      return graphqlLogout()
    },
    getProfile: async () => {
      const { graphqlGetProfile } = await import('./graphql/auth')
      return graphqlGetProfile()
    },
    refreshToken: async () => {
      const { graphqlRefreshToken } = await import('./graphql/auth')
      return graphqlRefreshToken()
    }
  },

  // Flashings
  flashings: {
    getAll: () => graphqlOperations.getFlashings(),
    create: (input: any) => graphqlOperations.createFlashing(input),
    update: (id: string, input: any) => graphqlOperations.updateFlashing(id, input),
    delete: (id: string) => graphqlOperations.deleteFlashing(id)
  },

  // Orders
  orders: {
    getAll: () => graphqlOperations.getOrders(),
    create: (input: any) => graphqlOperations.createOrder(input),
    update: (id: string, input: any) => graphqlOperations.updateOrder(id, input)
  },

  // Templates
  templates: {
    getAll: () => graphqlOperations.getTemplates(),
    create: (input: any) => graphqlOperations.createTemplate(input),
    update: (id: string, input: any) => graphqlOperations.updateTemplate(id, input),
    delete: (id: string) => graphqlOperations.deleteTemplate(id)
  },

  // Job References
  jobReferences: {
    getAll: () => graphqlOperations.getJobReferences(),
    create: (input: any) => graphqlOperations.createJobReference(input),
    update: (id: string, input: any) => graphqlOperations.updateJobReference(id, input),
    delete: (id: string) => graphqlOperations.deleteJobReference(id)
  },

  // Users
  users: {
    getAll: () => graphqlOperations.getUsers(),
    getById: (id: string) => graphqlOperations.getUser(id),
    update: (id: string, input: any) => graphqlOperations.updateUser(id, input)
  },

  // Payments
  payments: {
    create: (orderId: string, amount: number, paymentMethod: string) => 
      paymentService.createPayment(orderId, amount, paymentMethod),
    updateStatus: (paymentId: string, status: string, transactionId?: string) => 
      paymentService.updatePaymentStatus(paymentId, status, transactionId),
    getById: (paymentId: string) => paymentService.getPayment(paymentId),
    getAll: () => paymentService.getPayments(),
    process: (orderId: string, payVia: string, amount: number) => 
      paymentService.processPayment(orderId, payVia, amount)
  },

  // Sync
  sync: {
    getStatus: () => syncService.getSyncStatus(),
    forceSync: () => syncService.forceSync(),
    isOnline: () => syncService.isOnlineStatus(),
    isSyncInProgress: () => syncService.isSyncInProgress(),
    getPendingCount: () => syncService.getPendingActionsCount()
  }
}

// Default export for easy importing
export default api

// Utility functions for common operations
export const utils = {
  // Get current user
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('accessToken')
  },

  // Get auth token
  getAuthToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  },

  // Clear auth data
  clearAuth: () => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  // Handle API errors
  handleError: (error: any) => {
    console.error('API Error:', error)
    
    // If it's an authentication error, clear auth data
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('401')) {
      utils.clearAuth()
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    }
  }
}