# Authentication System Documentation

## Overview

The FlashingFactory frontend uses a comprehensive authentication system that combines GraphQL-based authentication with secure cookie management and automatic token refresh.

## Architecture

### Components

1. **GraphQL Authentication** (`/lib/graphql/auth.ts`)
   - Handles login, register, logout, and token refresh
   - Uses URQL client for GraphQL operations
   - Stores tokens in cookies (client-side) or httpOnly cookies (server-side)

2. **Cookie Management** (`/utilities/cookieUtils.ts`)
   - Client-side cookie utilities for token storage
   - Secure cookie utilities for server-side operations
   - Automatic token expiration handling

3. **Token Refresh** (`/utilities/tokenRefresh.ts`)
   - Automatic token refresh before expiration
   - Handles 401 responses with token refresh
   - Prevents multiple simultaneous refresh attempts

4. **Authentication Hook** (`/hooks/useAuth.ts`)
   - React hook for authentication state management
   - Provides login, logout, and user management functions
   - Handles authentication initialization

5. **Protected Routes** (`/components/auth/ProtectedRoute.tsx`)
   - Component for protecting routes based on authentication
   - Role-based access control
   - Automatic redirects for unauthorized access

6. **Middleware** (`/__middleware.ts`)
   - Next.js middleware for route protection
   - JWT token verification
   - Role-based access control

## Authentication Flow

### Login Process

1. User enters email and password
2. Frontend calls GraphQL login mutation
3. Backend validates credentials and returns JWT tokens
4. Frontend stores tokens in cookies
5. User is redirected to dashboard

### Token Management

- **Access Token**: Short-lived (24 hours), used for API requests
- **Refresh Token**: Long-lived (7 days), used to refresh access tokens
- **Storage**: Cookies with secure flags in production

### Automatic Token Refresh

- Tokens are automatically refreshed 5 minutes before expiration
- Failed API requests (401) trigger automatic token refresh
- Users are redirected to login if refresh fails

## Security Features

### Cookie Security

- **httpOnly**: Server-side cookies are httpOnly to prevent XSS
- **Secure**: Cookies are marked secure in production
- **SameSite**: Strict same-site policy to prevent CSRF
- **Path**: Restricted to application root path

### Route Protection

- Middleware verifies JWT tokens on protected routes
- Role-based access control for admin routes
- Automatic redirects for unauthorized access

### CSRF Protection

- CSRF token generation and verification utilities
- SameSite cookie policy
- Origin validation

## Usage Examples

### Using the Authentication Hook

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  return (
    <div>
      <h1>Welcome, {user.fullname}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protecting Routes

```tsx
import { ProtectedRoute, AdminRoute } from '@/components/auth/ProtectedRoute'

// Protect any authenticated route
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Protect admin-only routes
<AdminRoute>
  <AdminPanel />
</AdminRoute>

// Protect with custom role
<ProtectedRoute requiredRole="manager">
  <ManagerPanel />
</ProtectedRoute>
```

### Using Authentication Context

```tsx
import { useAuthContext } from '@/providers/AuthProvider'

function MyComponent() {
  const { user, isAuthenticated, hasRole } = useAuthContext()

  return (
    <div>
      {isAuthenticated && (
        <p>Logged in as: {user.email}</p>
      )}
      {hasRole('admin') && (
        <AdminButton />
      )}
    </div>
  )
}
```

## API Endpoints

### Client-Side Authentication

- `graphqlLogin(email, password)` - Login with email/password
- `graphqlRegister(userData)` - Register new user
- `graphqlLogout()` - Logout and clear tokens
- `graphqlRefreshToken()` - Refresh access token

### Server-Side Authentication

- `POST /api/auth/secure-login` - Secure login with httpOnly cookies
- `POST /api/auth/secure-logout` - Secure logout with httpOnly cookies

## Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

## Error Handling

### Common Error Scenarios

1. **Token Expired**: Automatic refresh attempt, redirect to login if failed
2. **Invalid Credentials**: Display error message to user
3. **Network Error**: Retry mechanism with exponential backoff
4. **Unauthorized Access**: Redirect to appropriate page

### Error Recovery

- Automatic token refresh on 401 responses
- Retry failed requests after token refresh
- Graceful degradation for network issues

## Best Practices

### Security

1. Always use HTTPS in production
2. Set secure cookie flags
3. Implement CSRF protection
4. Validate tokens on server-side
5. Use short-lived access tokens

### Performance

1. Cache user data appropriately
2. Minimize token refresh requests
3. Use efficient cookie storage
4. Implement request deduplication

### User Experience

1. Show loading states during authentication
2. Provide clear error messages
3. Implement automatic token refresh
4. Handle offline scenarios gracefully

## Troubleshooting

### Common Issues

1. **Tokens not persisting**: Check cookie settings and domain
2. **Automatic refresh not working**: Verify token expiration times
3. **Middleware redirects**: Check JWT secret and token format
4. **CORS issues**: Verify backend CORS configuration

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will log authentication events to the console.

## Migration Guide

### From localStorage to Cookies

1. Update authentication functions to use cookie utilities
2. Update URQL client to read from cookies
3. Update middleware to check cookies
4. Test token persistence across browser sessions

### From Basic Auth to JWT

1. Implement JWT token generation on backend
2. Update frontend to handle JWT tokens
3. Implement token refresh mechanism
4. Add middleware for route protection
