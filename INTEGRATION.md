# Frontend-Backend Integration Guide

## 🎯 Overview

This document describes the complete frontend-backend integration for FlashingFactory. The integration implements an **offline-first architecture** with GraphQL as the primary communication protocol.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   GraphQL API   │  │  Sync Service   │  │ IndexedDB   │ │
│  │   (urqlClient)  │  │  (Offline-First)│  │  (Dexie)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND (NestJS)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   GraphQL API   │  │  Sync Service   │  │  MongoDB    │ │
│  │   (Port 4000)   │  │  (Conflict Res.)│  │  Database   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Key Components

### 1. GraphQL Client (`src/lib/urqlClient.ts`)
- **Purpose**: Main GraphQL client for backend communication
- **Configuration**: Points to `http://localhost:4000/graphql`
- **Authentication**: Automatic JWT token handling
- **Features**: Caching, error handling, offline support

### 2. Authentication System (`src/lib/graphql/auth.ts`)
- **Purpose**: GraphQL-based authentication
- **Operations**: Login, Register, Logout, Profile, Token Refresh
- **Storage**: JWT tokens in localStorage
- **Security**: Automatic token validation and refresh

### 3. Sync Service (`src/lib/sync/syncService.ts`)
- **Purpose**: Offline-first data synchronization
- **Features**: 
  - Automatic sync when online
  - Conflict resolution
  - Pending actions queue
  - Real-time sync status
- **Storage**: IndexedDB for offline data

### 4. GraphQL Operations (`src/lib/graphql/operations.ts`)
- **Purpose**: All CRUD operations for business entities
- **Entities**: Flashings, Orders, Templates, Job References, Users
- **Features**: Offline-first with automatic sync

### 5. Payment Integration (`src/lib/graphql/payments.ts`)
- **Purpose**: Payment processing via GraphQL
- **Features**: Payment creation, status updates, transaction tracking

## 🚀 Getting Started

### 1. Environment Setup
The environment is already configured with:
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`
- Backend GraphQL endpoint: `http://localhost:4000/graphql`

### 2. Start the Services
```bash
# Start backend (Port 4000)
cd backend && pnpm start:dev

# Start frontend (Port 3000)
cd frontend && pnpm dev
```

### 3. Test Integration
```typescript
import { quickTest } from '@/lib/integration-test'

// Run all integration tests
const results = await quickTest()
console.log(results)
```

## 📡 API Usage

### Authentication
```typescript
import { api } from '@/lib/api'

// Login
const result = await api.auth.login('user@example.com', 'password')
if (result.success) {
  console.log('User:', result.user)
  console.log('Token:', result.accessToken)
}

// Register
const registerResult = await api.auth.register(
  'user@example.com',
  'John Doe',
  '+1234567890',
  'password'
)

// Logout
await api.auth.logout()
```

### Business Operations
```typescript
// Flashings
const flashings = await api.flashings.getAll()
const newFlashing = await api.flashings.create({
  material: 'aluminum',
  color: 'white',
  thickness: 0.5
})

// Orders
const orders = await api.orders.getAll()
const newOrder = await api.orders.create({
  status: 'pending',
  totalAmount: 1000
})

// Templates
const templates = await api.templates.getAll()
const newTemplate = await api.templates.create({
  name: 'Standard Flashing',
  data: { /* template data */ }
})
```

### Sync Operations
```typescript
import { syncService } from '@/lib/sync/syncService'

// Check sync status
const status = await syncService.getSyncStatus()
console.log('Last sync:', status.lastSyncTime)
console.log('Pending changes:', status.pendingChanges)

// Force sync
const result = await syncService.forceSync()
if (result.success) {
  console.log('Sync completed')
}

// Check online status
const isOnline = syncService.isOnlineStatus()
console.log('Online:', isOnline)
```

## 🔄 Offline-First Workflow

### 1. Online Mode
- All operations go directly to backend via GraphQL
- Data is automatically synced to IndexedDB
- Real-time updates and notifications

### 2. Offline Mode
- Operations are queued in pending actions
- Data is stored locally in IndexedDB
- Sync status indicators show offline state

### 3. Coming Back Online
- Automatic sync of pending changes
- Conflict resolution for concurrent edits
- Status updates and notifications

## 🎨 UI Components

### Sync Status Component
```tsx
import { SyncStatus } from '@/components/SyncStatus'

function App() {
  return (
    <div>
      <SyncStatus />
      {/* Your app content */}
    </div>
  )
}
```

### Sync Status Hook
```tsx
import { useSyncStatus } from '@/components/SyncStatus'

function MyComponent() {
  const { isOnline, isSyncInProgress, pendingCount } = useSyncStatus()
  
  return (
    <div>
      {!isOnline && <div>Working offline</div>}
      {isSyncInProgress && <div>Syncing...</div>}
      {pendingCount > 0 && <div>{pendingCount} changes pending</div>}
    </div>
  )
}
```

## 🔒 Security Features

### 1. JWT Authentication
- Automatic token handling in GraphQL client
- Token refresh on expiration
- Secure token storage in localStorage

### 2. Middleware Protection
- Route-based authentication
- Role-based access control
- Automatic redirects for unauthorized access

### 3. CORS Configuration
- Proper CORS setup in backend
- Secure headers in middleware
- Content Security Policy

## 🧪 Testing

### Integration Tests
```typescript
import { integrationTest } from '@/lib/integration-test'

// Run all tests
const results = await integrationTest.runAllTests()

// Run specific tests
await integrationTest.testGraphQLOnly()
await integrationTest.testAuthOnly()
await integrationTest.testSyncOnly()
```

### Manual Testing
1. **Authentication**: Test login/logout flow
2. **CRUD Operations**: Test all entity operations
3. **Offline Mode**: Disconnect network and test functionality
4. **Sync**: Reconnect and verify data sync
5. **Conflict Resolution**: Test concurrent edits

## 🐛 Troubleshooting

### Common Issues

#### 1. GraphQL Connection Failed
```
Error: GraphQL connection failed: Network error
```
**Solution**: Ensure backend is running on port 4000

#### 2. Authentication Errors
```
Error: Unauthorized
```
**Solution**: Check JWT token validity and refresh

#### 3. Sync Conflicts
```
Error: Sync conflicts detected
```
**Solution**: Review conflict resolution strategy

#### 4. IndexedDB Errors
```
Error: IndexedDB not available
```
**Solution**: Check browser compatibility and permissions

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug', 'true')

// Check sync status
console.log(await syncService.getSyncStatus())

// Check pending actions
console.log(syncService.getPendingActionsCount())
```

## 📊 Monitoring

### Sync Status
- Last sync time
- Pending changes count
- Conflict count
- Online/offline status

### Performance Metrics
- GraphQL query performance
- Sync operation timing
- IndexedDB operation counts
- Network request success rates

## 🔮 Future Enhancements

### 1. Real-time Collaboration
- WebSocket integration
- Live cursor tracking
- Real-time conflict resolution

### 2. Advanced Sync
- Delta sync for large datasets
- Peer-to-peer sync
- Conflict-free replicated data types (CRDTs)

### 3. Performance Optimization
- Query optimization
- Caching strategies
- Bundle size optimization

## 📚 Additional Resources

- [GraphQL Documentation](https://graphql.org/)
- [Urql Documentation](https://formidable.com/open-source/urql/)
- [Dexie Documentation](https://dexie.org/)
- [NestJS Documentation](https://nestjs.com/)

---

**Status**: ✅ Integration Complete
**Last Updated**: January 2025
**Version**: 1.0.0
