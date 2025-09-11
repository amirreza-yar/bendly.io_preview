// Integration test to verify frontend-backend connection
// This file can be imported and run to test the integration

import { urqlClient } from './urqlClient'
import { api } from './api'
import { syncService } from './sync/syncService'

export class IntegrationTest {
  private results: Array<{ test: string; success: boolean; error?: string }> = []

  async runAllTests(): Promise<{ passed: number; failed: number; results: any[] }> {
    console.log('🚀 Starting FlashingFactory Integration Tests...')
    
    this.results = []

    // Test 1: GraphQL Client Connection
    await this.testGraphQLConnection()
    
    // Test 2: Authentication Flow
    await this.testAuthentication()
    
    // Test 3: Sync Service
    await this.testSyncService()
    
    // Test 4: API Operations
    await this.testAPIOperations()
    
    // Test 5: Offline-First Functionality
    await this.testOfflineFirst()

    const passed = this.results.filter(r => r.success).length
    const failed = this.results.filter(r => !r.success).length

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`)
    
    if (failed === 0) {
      console.log('✅ All integration tests passed! Frontend-backend integration is working correctly.')
    } else {
      console.log('❌ Some tests failed. Check the results below for details.')
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.test}: ${r.error}`)
      })
    }

    return { passed, failed, results: this.results }
  }

  private async testGraphQLConnection() {
    try {
      console.log('🔗 Testing GraphQL connection...')
      
      // Test basic GraphQL introspection
      const introspectionQuery = `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
          }
        }
      `
      
      const result = await urqlClient.query(introspectionQuery).toPromise()
      
      if (result.error) {
        throw new Error(`GraphQL connection failed: ${result.error.message}`)
      }

      this.addResult('GraphQL Connection', true)
      console.log('✅ GraphQL connection successful')
    } catch (error) {
      this.addResult('GraphQL Connection', false, error.message)
      console.log('❌ GraphQL connection failed:', error.message)
    }
  }

  private async testAuthentication() {
    try {
      console.log('🔐 Testing authentication flow...')
      
      // Test login with invalid credentials (should fail gracefully)
      const loginResult = await api.auth.login('test@example.com', 'wrongpassword')
      
      if (loginResult.success) {
        throw new Error('Login should have failed with invalid credentials')
      }

      // Test logout (should work even without being logged in)
      const logoutResult = await api.auth.logout()
      
      if (!logoutResult.success) {
        throw new Error('Logout should always succeed')
      }

      this.addResult('Authentication Flow', true)
      console.log('✅ Authentication flow working correctly')
    } catch (error) {
      this.addResult('Authentication Flow', false, error.message)
      console.log('❌ Authentication flow failed:', error.message)
    }
  }

  private async testSyncService() {
    try {
      console.log('🔄 Testing sync service...')
      
      // Test sync status
      const status = await syncService.getSyncStatus()
      
      if (typeof status.lastSyncTime !== 'object') {
        throw new Error('Sync status should return proper date object')
      }

      // Test online status
      const isOnline = syncService.isOnlineStatus()
      
      if (typeof isOnline !== 'boolean') {
        throw new Error('Online status should return boolean')
      }

      // Test pending actions count
      const pendingCount = syncService.getPendingActionsCount()
      
      if (typeof pendingCount !== 'number') {
        throw new Error('Pending count should return number')
      }

      this.addResult('Sync Service', true)
      console.log('✅ Sync service working correctly')
    } catch (error) {
      this.addResult('Sync Service', false, error.message)
      console.log('❌ Sync service failed:', error.message)
    }
  }

  private async testAPIOperations() {
    try {
      console.log('📡 Testing API operations...')
      
      // Test getting flashings (should work even if empty)
      const flashingsResult = await api.flashings.getAll()
      
      if (!flashingsResult.success && !flashingsResult.error?.includes('No user ID')) {
        throw new Error('Flashings API should work or return proper error')
      }

      // Test getting orders (should work even if empty)
      const ordersResult = await api.orders.getAll()
      
      if (!ordersResult.success && !ordersResult.error?.includes('No user ID')) {
        throw new Error('Orders API should work or return proper error')
      }

      // Test sync status API
      const syncStatusResult = await api.sync.getStatus()
      
      if (!syncStatusResult.success) {
        throw new Error('Sync status API should work')
      }

      this.addResult('API Operations', true)
      console.log('✅ API operations working correctly')
    } catch (error) {
      this.addResult('API Operations', false, error.message)
      console.log('❌ API operations failed:', error.message)
    }
  }

  private async testOfflineFirst() {
    try {
      console.log('📱 Testing offline-first functionality...')
      
      // Test IndexedDB availability
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        throw new Error('IndexedDB not available')
      }

      // Test localStorage availability
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('localStorage not available')
      }

      // Test sync service offline capabilities
      const isOnline = syncService.isOnlineStatus()
      const pendingCount = syncService.getPendingActionsCount()
      
      // These should work regardless of online status
      if (typeof isOnline !== 'boolean' || typeof pendingCount !== 'number') {
        throw new Error('Sync service should work offline')
      }

      this.addResult('Offline-First Functionality', true)
      console.log('✅ Offline-first functionality working correctly')
    } catch (error) {
      this.addResult('Offline-First Functionality', false, error.message)
      console.log('❌ Offline-first functionality failed:', error.message)
    }
  }

  private addResult(test: string, success: boolean, error?: string) {
    this.results.push({ test, success, error })
  }

  // Individual test methods for debugging
  async testGraphQLOnly() {
    return this.testGraphQLConnection()
  }

  async testAuthOnly() {
    return this.testAuthentication()
  }

  async testSyncOnly() {
    return this.testSyncService()
  }

  async testAPIOnly() {
    return this.testAPIOperations()
  }

  async testOfflineOnly() {
    return this.testOfflineFirst()
  }
}

// Export singleton instance
export const integrationTest = new IntegrationTest()

// Quick test function for console use
export async function quickTest() {
  const test = new IntegrationTest()
  return test.runAllTests()
}

// Test specific functionality
export async function testConnection() {
  const test = new IntegrationTest()
  await test.testGraphQLConnection()
  return test.results
}

export async function testAuth() {
  const test = new IntegrationTest()
  await test.testAuthentication()
  return test.results
}

export async function testSync() {
  const test = new IntegrationTest()
  await test.testSyncService()
  return test.results
}
