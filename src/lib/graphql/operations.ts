import { gql } from '@urql/core'
import { urqlClient } from '../urqlClient'
import { syncService } from '../sync/syncService'

// Flashings GraphQL Operations
export const GET_FLASHINGS_QUERY = gql`
  query GetFlashings($userId: String!) {
    flashings(userId: $userId) {
      _id
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const CREATE_FLASHING_MUTATION = gql`
  mutation CreateFlashing($input: CreateFlashingInput!) {
    createFlashing(input: $input) {
      _id
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_FLASHING_MUTATION = gql`
  mutation UpdateFlashing($id: String!, $input: UpdateFlashingInput!) {
    updateFlashing(id: $id, input: $input) {
      _id
      material
      color
      thickness
      dimensions
      createdAt
      updatedAt
    }
  }
`

export const DELETE_FLASHING_MUTATION = gql`
  mutation DeleteFlashing($id: String!) {
    deleteFlashing(id: $id)
  }
`

// Orders GraphQL Operations
export const GET_ORDERS_QUERY = gql`
  query GetOrders($userId: String!) {
    orders(userId: $userId) {
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

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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

export const UPDATE_ORDER_MUTATION = gql`
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
export const GET_TEMPLATES_QUERY = gql`
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

export const CREATE_TEMPLATE_MUTATION = gql`
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

export const UPDATE_TEMPLATE_MUTATION = gql`
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

export const DELETE_TEMPLATE_MUTATION = gql`
  mutation DeleteTemplate($id: String!) {
    deleteTemplate(id: $id)
  }
`

// Job References GraphQL Operations
export const GET_JOB_REFERENCES_QUERY = gql`
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

export const CREATE_JOB_REFERENCE_MUTATION = gql`
  mutation CreateJobReference($input: CreateJobReferenceInput!) {
    createJobReference(input: $input) {
      _id
      code
      projectName
      description
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_JOB_REFERENCE_MUTATION = gql`
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

export const DELETE_JOB_REFERENCE_MUTATION = gql`
  mutation DeleteJobReference($id: String!) {
    deleteJobReference(id: $id)
  }
`

// Users GraphQL Operations
export const GET_USERS_QUERY = gql`
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

export const GET_USER_QUERY = gql`
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

export const UPDATE_USER_MUTATION = gql`
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
      const result = await urqlClient.query(GET_FLASHINGS_QUERY, { userId }).toPromise()
      
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

  async createFlashing(input: any) {
    try {
      const result = await urqlClient.mutation(CREATE_FLASHING_MUTATION, { input }).toPromise()
      
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
          timestamp: new Date()
        })
      }

      return { success: true, data: flashing }
    } catch (error) {
      console.error('Create flashing error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateFlashing(id: string, input: any) {
    try {
      const result = await urqlClient.mutation(UPDATE_FLASHING_MUTATION, { id, input }).toPromise()
      
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
          timestamp: new Date()
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
      const result = await urqlClient.mutation(DELETE_FLASHING_MUTATION, { id }).toPromise()
      
      if (result.error) {
        console.error('Delete flashing error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'flashing',
        action: 'delete',
        data: { id },
        timestamp: new Date()
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
      const result = await urqlClient.query(GET_ORDERS_QUERY, { userId }).toPromise()
      
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

  async createOrder(input: any) {
    try {
      const result = await urqlClient.mutation(CREATE_ORDER_MUTATION, { input }).toPromise()
      
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
          timestamp: new Date()
        })
      }

      return { success: true, data: order }
    } catch (error) {
      console.error('Create order error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateOrder(id: string, input: any) {
    try {
      const result = await urqlClient.mutation(UPDATE_ORDER_MUTATION, { id, input }).toPromise()
      
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
          timestamp: new Date()
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
      const result = await urqlClient.query(GET_TEMPLATES_QUERY, { userId }).toPromise()
      
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

  async createTemplate(input: any) {
    try {
      const result = await urqlClient.mutation(CREATE_TEMPLATE_MUTATION, { input }).toPromise()
      
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
          timestamp: new Date()
        })
      }

      return { success: true, data: template }
    } catch (error) {
      console.error('Create template error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateTemplate(id: string, input: any) {
    try {
      const result = await urqlClient.mutation(UPDATE_TEMPLATE_MUTATION, { id, input }).toPromise()
      
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
          timestamp: new Date()
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
      const result = await urqlClient.mutation(DELETE_TEMPLATE_MUTATION, { id }).toPromise()
      
      if (result.error) {
        console.error('Delete template error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'template',
        action: 'delete',
        data: { id },
        timestamp: new Date()
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
      const result = await urqlClient.query(GET_JOB_REFERENCES_QUERY, { userId }).toPromise()
      
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

  async createJobReference(input: any) {
    try {
      const result = await urqlClient.mutation(CREATE_JOB_REFERENCE_MUTATION, { input }).toPromise()
      
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
          timestamp: new Date()
        })
      }

      return { success: true, data: jobRef }
    } catch (error) {
      console.error('Create job reference error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async updateJobReference(id: string, input: any) {
    try {
      const result = await urqlClient.mutation(UPDATE_JOB_REFERENCE_MUTATION, { id, input }).toPromise()
      
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
          timestamp: new Date()
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
      const result = await urqlClient.mutation(DELETE_JOB_REFERENCE_MUTATION, { id }).toPromise()
      
      if (result.error) {
        console.error('Delete job reference error:', result.error)
        return { success: false, error: result.error.message }
      }

      // Add to pending actions for offline sync
      syncService.addPendingAction({
        type: 'jobReference',
        action: 'delete',
        data: { id },
        timestamp: new Date()
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
      const result = await urqlClient.query(GET_USERS_QUERY).toPromise()
      
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
      const result = await urqlClient.query(GET_USER_QUERY, { id }).toPromise()
      
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

  async updateUser(id: string, input: any) {
    try {
      const result = await urqlClient.mutation(UPDATE_USER_MUTATION, { id, input }).toPromise()
      
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
          timestamp: new Date()
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
