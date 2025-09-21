import { gql } from '@urql/core'
import { urqlClient } from '../urqlClient'
import { syncService } from '../sync/syncService'

// Payment GraphQL Operations
export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      _id
      orderId
      amount
      status
      paymentMethod
      transactionId
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePayment($id: String!, $input: UpdatePaymentInput!) {
    updatePayment(id: $id, input: $input) {
      _id
      orderId
      amount
      status
      paymentMethod
      transactionId
      createdAt
      updatedAt
    }
  }
`

export const GET_PAYMENT_QUERY = gql`
  query GetPayment($id: String!) {
    payment(id: $id) {
      _id
      orderId
      amount
      status
      paymentMethod
      transactionId
      createdAt
      updatedAt
    }
  }
`

export const GET_PAYMENTS_QUERY = gql`
  query GetPayments($userId: String!) {
    payments(userId: $userId) {
      _id
      orderId
      amount
      status
      paymentMethod
      transactionId
      createdAt
      updatedAt
    }
  }
`

// Payment API functions
export class PaymentService {
  private getCurrentUserId(): string {
    if (typeof window === 'undefined') return ''
    
    const userStr = localStorage.getItem('user')
    if (!userStr) return ''
    
    try {
      const user = JSON.parse(userStr)
      return user._id || ''
    } catch {
      return ''
    }
  }

  async createPayment(orderId: string, amount: number, paymentMethod: string) {
    try {
      const result = await urqlClient.mutation(CREATE_PAYMENT_MUTATION, {
        input: {
          orderId,
          amount,
          paymentMethod,
          status: 'pending'
        }
      }).toPromise()

      if (result.error) {
        console.error('Create payment error:', result.error)
        return { success: false, error: result.error.message }
      }

      const payment = result.data?.createPayment
      if (payment) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'order', // Payments are related to orders
          action: 'update',
          data: { ...payment, orderId },
          timestamp: new Date()
        })
      }

      return { success: true, data: payment }
    } catch (error) {
      console.error('Create payment error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updatePaymentStatus(paymentId: string, status: string, transactionId?: string) {
    try {
      const result = await urqlClient.mutation(UPDATE_PAYMENT_MUTATION, {
        id: paymentId,
        input: {
          status,
          transactionId
        }
      }).toPromise()

      if (result.error) {
        console.error('Update payment error:', result.error)
        return { success: false, error: result.error.message }
      }

      const payment = result.data?.updatePayment
      if (payment) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'order', // Payments are related to orders
          action: 'update',
          data: payment,
          timestamp: new Date()
        })
      }

      return { success: true, data: payment }
    } catch (error) {
      console.error('Update payment error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async getPayment(paymentId: string) {
    try {
      const result = await urqlClient.query(GET_PAYMENT_QUERY, { id: paymentId }).toPromise()
      
      if (result.error) {
        console.error('Get payment error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.payment }
    } catch (error) {
      console.error('Get payment error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async getPayments() {
    const userId = this.getCurrentUserId()
    if (!userId) return { success: false, error: 'No user ID' }

    try {
      const result = await urqlClient.query(GET_PAYMENTS_QUERY, { userId }).toPromise()
      
      if (result.error) {
        console.error('Get payments error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.payments || [] }
    } catch (error) {
      console.error('Get payments error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Process payment with external provider (Stripe, PayPal, etc.)
  async processPayment(orderId: string, payVia: string, amount: number) {
    try {
      // Create payment record
      const paymentResult = await this.createPayment(orderId, amount, payVia)
      if (!paymentResult.success) {
        return paymentResult
      }

      const payment = paymentResult.data

      // Simulate payment processing (in real implementation, this would call external API)
      const transactionId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Update payment status
      const updateResult = await this.updatePaymentStatus(
        payment._id, 
        'completed', 
        transactionId
      )

      if (!updateResult.success) {
        return updateResult
      }

      return {
        success: true,
        data: {
          transactionId,
          via: payVia,
          date: new Date().getTime(),
          id: payment._id,
          status: 'completed'
        }
      }
    } catch (error) {
      console.error('Process payment error:', error)
      return { success: false, error: 'Payment processing failed' }
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

// Legacy compatibility function
export async function apiProcessPayment(orderId: string, payVia: string) {
  // This is a simplified version - in real implementation you'd get the amount from the order
  const amount = 100 // This should come from the order data
  return paymentService.processPayment(orderId, payVia, amount)
}
