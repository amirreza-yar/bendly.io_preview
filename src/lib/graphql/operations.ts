import { gql } from '@urql/core'
import { urqlClient } from '../urqlClient'
import { syncService } from '../sync/syncService'
import {
  CreateFlashingInput,
  UpdateFlashingInput,
  CreateOrderInput,
  UpdateOrderInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateJobReferenceInput,
  UpdateJobReferenceInput,
  UpdateUserInput,
} from '@/types/queryTypes'

// Flashings GraphQL Operations
export const getFlashingsQuery = gql`
  query GetFlashings($userId: String!) {
    flashings(userId: $userId) {
      _id
      ownerId {
        _id
        email
        fullname
      }
      status
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const createFlashingMutation = gql`
  mutation CreateFlashing($input: CreateFlashingInput!) {
    createFlashing(input: $input) {
      _id
      ownerId {
        _id
        email
        fullname
      }
      status
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const updateFlashingMutation = gql`
  mutation UpdateFlashing($id: String!, $input: UpdateFlashingInput!) {
    updateFlashing(id: $id, input: $input) {
      _id
      ownerId {
        _id
        email
        fullname
      }
      status
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const deleteFlashingMutation = gql`
  mutation DeleteFlashing($id: String!) {
    deleteFlashing(id: $id)
  }
`

// Orders GraphQL Operations
export const getOrdersQuery = gql`
  query GetOrders($userId: String!) {
    orders(userId: $userId) {
      _id
      orderNumber
      clientId {
        _id
        email
        fullname
      }
      items {
        flashingId {
          _id
        }
        subItems {
          quantity
          length
          price
        }
      }
      status
      progress
      deliveryType
      totalAmount
      createdAt
      updatedAt
    }
  }
`

export const createOrderMutation = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      _id
      orderNumber
      clientId {
        _id
        email
        fullname
      }
      items {
        flashingId {
          _id
        }
        subItems {
          quantity
          length
          price
        }
      }
      status
      progress
      deliveryType
      totalAmount
      createdAt
      updatedAt
    }
  }
`

export const updateOrderMutation = gql`
  mutation UpdateOrder($id: String!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      _id
      status
      progress
      deliveryType
      totalAmount
      createdAt
      updatedAt
    }
  }
`

// Templates GraphQL Operations
export const getTemplatesQuery = gql`
  query GetTemplates($userId: String!) {
    templates(userId: $userId) {
      _id
      name
      description
      data
      owner
      createdAt
      updatedAt
    }
  }
`

export const createTemplateMutation = gql`
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      _id
      name
      description
      data
      owner
      createdAt
      updatedAt
    }
  }
`

export const updateTemplateMutation = gql`
  mutation UpdateTemplate($id: String!, $input: UpdateTemplateInput!) {
    updateTemplate(id: $id, input: $input) {
      _id
      name
      description
      data
      owner
      createdAt
      updatedAt
    }
  }
`

export const deleteTemplateMutation = gql`
  mutation DeleteTemplate($id: String!) {
    deleteTemplate(id: $id)
  }
`

// Job References GraphQL Operations
export const getJobReferencesQuery = gql`
  query GetJobReferences($userId: String!) {
    jobReferences(userId: $userId) {
      _id
      code
      projectName
      description
      createdAt
      updatedAt
    }
  }
`

export const createJobReferenceMutation = gql`
  mutation CreateJobReference($input: CreateJobReferenceInputGQL!) {
    createJobReference(input: $input) {
      _id
      code
      projectName
      createdAt
      updatedAt
    }
  }
`

export const updateJobReferenceMutation = gql`
  mutation UpdateJobReference($id: String!, $input: UpdateJobReferenceInput!) {
    updateJobReference(id: $id, input: $input) {
      _id
      code
      projectName
      description
      createdAt
      updatedAt
    }
  }
`

export const deleteJobReferenceMutation = gql`
  mutation DeleteJobReference($id: String!) {
    deleteJobReference(id: $id)
  }
`

// Users GraphQL Operations
export const getUsersQuery = gql`
  query GetUsers {
    users {
      _id
      email
      fullname
      phone
      roleId
      status
      createdAt
      updatedAt
    }
  }
`

export const getUserQuery = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      _id
      email
      fullname
      phone
      roleId
      status
      createdAt
      updatedAt
    }
  }
`

export const updateUserMutation = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      _id
      email
      fullname
      phone
      roleId
      status
      createdAt
      updatedAt
    }
  }
`

// API Functions with Offline-First Support
export class GraphQLOperations {
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

  // Flashings Operations
  async getFlashings() {
    const userId = this.getCurrentUserId()
    if (!userId) return { success: false, error: 'No user ID' }

    try {
      const result = await urqlClient.query(getFlashingsQuery, { userId }).toPromise()

      if (result.error) {
        console.error('Get flashings error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.flashings || [] }
    } catch (error) {
      console.error('Get flashings error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async createFlashing(input: CreateFlashingInput) {
    try {
      const result = await urqlClient.mutation(createFlashingMutation, { input }).toPromise()

      if (result.error) {
        console.error('Create flashing error:', result.error)
        return { success: false, error: result.error.message }
      }

      const flashing = result.data?.createFlashing
      if (flashing) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'flashing',
          action: 'create',
          data: flashing,
          timestamp: new Date(),
        })
      }

      return { success: true, data: flashing }
    } catch (error) {
      console.error('Create flashing error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateFlashing(id: string, input: UpdateFlashingInput) {
    try {
      const result = await urqlClient.mutation(updateFlashingMutation, { id, input }).toPromise()

      if (result.error) {
        console.error('Update flashing error:', result.error)
        return { success: false, error: result.error.message }
      }

      const flashing = result.data?.updateFlashing
      if (flashing) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'flashing',
          action: 'update',
          data: flashing,
          timestamp: new Date(),
        })
      }

      return { success: true, data: flashing }
    } catch (error) {
      console.error('Update flashing error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async deleteFlashing(id: string) {
    try {
      const result = await urqlClient.mutation(deleteFlashingMutation, { id }).toPromise()

      if (result.error) {
        console.error('Delete flashing error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'flashing',
        action: 'delete',
        data: { id },
        timestamp: new Date(),
      })

      return { success: true }
    } catch (error) {
      console.error('Delete flashing error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Orders Operations
  async getOrders() {
    const userId = this.getCurrentUserId()
    if (!userId) return { success: false, error: 'No user ID' }

    try {
      const result = await urqlClient.query(getOrdersQuery, { userId }).toPromise()

      if (result.error) {
        console.error('Get orders error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.orders || [] }
    } catch (error) {
      console.error('Get orders error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async createOrder(input: CreateOrderInput) {
    try {
      const result = await urqlClient.mutation(createOrderMutation, { input }).toPromise()

      if (result.error) {
        console.error('Create order error:', result.error)
        return { success: false, error: result.error.message }
      }

      const order = result.data?.createOrder
      if (order) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'order',
          action: 'create',
          data: order,
          timestamp: new Date(),
        })
      }

      return { success: true, data: order }
    } catch (error) {
      console.error('Create order error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateOrder(id: string, input: UpdateOrderInput) {
    try {
      const result = await urqlClient.mutation(updateOrderMutation, { id, input }).toPromise()

      if (result.error) {
        console.error('Update order error:', result.error)
        return { success: false, error: result.error.message }
      }

      const order = result.data?.updateOrder
      if (order) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'order',
          action: 'update',
          data: order,
          timestamp: new Date(),
        })
      }

      return { success: true, data: order }
    } catch (error) {
      console.error('Update order error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Templates Operations
  async getTemplates() {
    const userId = this.getCurrentUserId()
    if (!userId) return { success: false, error: 'No user ID' }

    try {
      const result = await urqlClient.query(getTemplatesQuery, { userId }).toPromise()

      if (result.error) {
        console.error('Get templates error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.templates || [] }
    } catch (error) {
      console.error('Get templates error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async createTemplate(input: CreateTemplateInput) {
    try {
      const result = await urqlClient.mutation(createTemplateMutation, { input }).toPromise()

      if (result.error) {
        console.error('Create template error:', result.error)
        return { success: false, error: result.error.message }
      }

      const template = result.data?.createTemplate
      if (template) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'template',
          action: 'create',
          data: template,
          timestamp: new Date(),
        })
      }

      return { success: true, data: template }
    } catch (error) {
      console.error('Create template error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateTemplate(id: string, input: UpdateTemplateInput) {
    try {
      const result = await urqlClient.mutation(updateTemplateMutation, { id, input }).toPromise()

      if (result.error) {
        console.error('Update template error:', result.error)
        return { success: false, error: result.error.message }
      }

      const template = result.data?.updateTemplate
      if (template) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'template',
          action: 'update',
          data: template,
          timestamp: new Date(),
        })
      }

      return { success: true, data: template }
    } catch (error) {
      console.error('Update template error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async deleteTemplate(id: string) {
    try {
      const result = await urqlClient.mutation(deleteTemplateMutation, { id }).toPromise()

      if (result.error) {
        console.error('Delete template error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'template',
        action: 'delete',
        data: { id },
        timestamp: new Date(),
      })

      return { success: true }
    } catch (error) {
      console.error('Delete template error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Job References Operations
  async getJobReferences() {
    const userId = this.getCurrentUserId()
    if (!userId) return { success: false, error: 'No user ID' }

    try {
      const result = await urqlClient.query(getJobReferencesQuery, { userId }).toPromise()

      if (result.error) {
        console.error('Get job references error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.jobReferences || [] }
    } catch (error) {
      console.error('Get job references error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async createJobReference(input: CreateJobReferenceInput) {
    try {
      const result = await urqlClient.mutation(createJobReferenceMutation, { input }).toPromise()

      if (result.error) {
        console.error('Create job reference error:', result.error)
        return { success: false, error: result.error.message }
      }

      const jobRef = result.data?.createJobReference
      if (jobRef) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'jobReference',
          action: 'create',
          data: jobRef,
          timestamp: new Date(),
        })
      }

      return { success: true, data: jobRef }
    } catch (error) {
      console.error('Create job reference error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateJobReference(id: string, input: UpdateJobReferenceInput) {
    try {
      const result = await urqlClient
        .mutation(updateJobReferenceMutation, { id, input })
        .toPromise()

      if (result.error) {
        console.error('Update job reference error:', result.error)
        return { success: false, error: result.error.message }
      }

      const jobRef = result.data?.updateJobReference
      if (jobRef) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'jobReference',
          action: 'update',
          data: jobRef,
          timestamp: new Date(),
        })
      }

      return { success: true, data: jobRef }
    } catch (error) {
      console.error('Update job reference error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async deleteJobReference(id: string) {
    try {
      const result = await urqlClient.mutation(deleteJobReferenceMutation, { id }).toPromise()

      if (result.error) {
        console.error('Delete job reference error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'jobReference',
        action: 'delete',
        data: { id },
        timestamp: new Date(),
      })

      return { success: true }
    } catch (error) {
      console.error('Delete job reference error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Users Operations
  async getUsers() {
    try {
      const result = await urqlClient.query(getUsersQuery, {}).toPromise()

      if (result.error) {
        console.error('Get users error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.users || [] }
    } catch (error) {
      console.error('Get users error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async getUser(id: string) {
    try {
      const result = await urqlClient.query(getUserQuery, { id }).toPromise()

      if (result.error) {
        console.error('Get user error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, data: result.data?.user }
    } catch (error) {
      console.error('Get user error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateUser(id: string, input: UpdateUserInput) {
    try {
      const result = await urqlClient.mutation(updateUserMutation, { id, input }).toPromise()

      if (result.error) {
        console.error('Update user error:', result.error)
        return { success: false, error: result.error.message }
      }

      const user = result.data?.updateUser
      if (user) {
        // Add to pending actions for offline sync
        syncService.addPendingAction({
          type: 'user',
          action: 'update',
          data: user,
          timestamp: new Date(),
        })
      }

      return { success: true, data: user }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: 'Network error' }
    }
  }
}

// Export singleton instance
export const graphqlOperations = new GraphQLOperations()
