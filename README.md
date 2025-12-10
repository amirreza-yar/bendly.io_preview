# Bendly Frontend

A modern, full-stack manufacturing platform for the construction industry, specializing in flashing design and fabrication. Bendly enables customers to design, order, and track custom flashing products through an intuitive web interface, while providing manufacturers with comprehensive order management and production tracking tools.

## Overview

Bendly is a web-based platform for flashing design and manufacturing in the construction industry.

## 🏗️ Architecture & Tech Stack

### Frontend Framework

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Beautiful icon set
- **Framer Motion** - Animation library

### State Management & Data

- **Zustand** - Lightweight state management
- **Apollo Client** - GraphQL client for API communication
- **URQL** - Alternative GraphQL client for specific operations
- **Dexie** - IndexedDB wrapper for offline storage
- **SWR** - React hooks for data fetching

### Canvas & Design

- **Fabric.js** - HTML5 canvas library for design interface
- **@dnd-kit** - Drag and drop functionality

### Forms & Validation

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Development Tools

- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Key Features

### Customer Features

- **Interactive Design Canvas**: Drag-and-drop interface for creating custom metal designs
- **Material Selection**: Choose from various metals, gauges, and finishes
- **Real-time Pricing**: Dynamic pricing based on design specifications
- **Order Tracking**: Complete order lifecycle visibility
- **Account Management**: Manage addresses, job references, and preferences
- **Order History**: View past orders and reorder functionality

### Admin Features

- **Order Management Dashboard**: Comprehensive order processing interface
- **Customer Management**: View and manage customer accounts
- **Production Tracking**: Monitor manufacturing progress
- **Material Inventory**: Track stock levels and manage materials
- **Analytics & Reporting**: Business intelligence and performance metrics
- **Factory Calendar**: Schedule and manage production capacity

### Technical Features

- **Offline Support**: IndexedDB for offline design capabilities
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Mode**: Theme switching capability
- **Real-time Updates**: Live order status and notifications
- **Secure Authentication**: JWT-based authentication with automatic token refresh
- **Role-based Access**: Different permission levels for customers and admins

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: ^18.20.2 || >=20.9.0
- **pnpm**: ^9 || ^10 (recommended package manager)
- **Backend**: Running Bendly backend API

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bendly/frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # Add other required environment variables
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start development server          |
| `pnpm devsafe`   | Start dev server with clean build |
| `pnpm build`     | Build for production              |
| `pnpm start`     | Start production server           |
| `pnpm lint`      | Run ESLint                        |
| `pnpm lint:fix`  | Fix ESLint issues                 |
| `pnpm test`      | Run all tests                     |
| `pnpm test:int`  | Run integration tests             |
| `pnpm test:e2e`  | Run end-to-end tests              |
| `pnpm reinstall` | Clean install dependencies        |

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (frontend)/         # Main application routes
│   │   │   ├── (admin dashboard)/    # Admin interface
│   │   │   ├── (user dashboard)/     # Customer dashboard
│   │   │   └── (from canvas to payment)/ # Order flow
│   │   ├── api/                # API routes
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   │   ├── admin/              # Admin-specific components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── flashing/           # Canvas/design components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   └── utils/              # Utility components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core utilities and API clients
│   │   ├── api.ts              # REST API client
│   │   ├── graphql/            # GraphQL operations
│   │   ├── sync/               # Data synchronization
│   │   └── urqlClient.ts       # URQL GraphQL client
│   ├── providers/              # React context providers
│   ├── stores/                 # Zustand state stores
│   ├── types/                  # TypeScript type definitions
│   └── utilities/              # Helper functions
├── public/                     # Static assets
├── tests/                      # Test files
└── docs/                       # Documentation
```

## 🔐 Authentication

Bendly uses a comprehensive JWT-based authentication system with automatic token refresh. See [AUTHENTICATION.md](./src/docs/AUTHENTICATION.md) for detailed documentation.

### Key Authentication Features

- **Secure Cookies**: httpOnly cookies in production
- **Automatic Refresh**: Seamless token renewal
- **Role-based Access**: Customer and admin roles
- **Protected Routes**: Middleware-based route protection

## 🌐 API Integration

### Backend Communication

- **GraphQL**: Primary API protocol for complex queries and mutations
- **REST**: Supplementary REST endpoints for specific operations
- **Real-time**: WebSocket connections for live updates

### Data Flow

1. **GraphQL Client**: Apollo Client for main API communication
2. **URQL Client**: Specialized GraphQL client for auth operations
3. **State Management**: Zustand stores for local state
4. **Offline Storage**: Dexie for IndexedDB operations

### Key API Operations

- **Authentication**: Login, register, token refresh
- **Orders**: CRUD operations, status updates
- **Designs**: Canvas state management, templates
- **Materials**: Inventory, pricing, specifications
- **Users**: Profile management, addresses

## 🎨 Canvas Design System

The core of Bendly's value proposition is the interactive canvas for designing custom flashing products. Built with Fabric.js, it provides:

- **Drag & Drop**: Intuitive shape manipulation
- **Material Preview**: Real-time visual feedback
- **Template System**: Pre-built design templates
- **Offline Editing**: Design without internet connection
- **Export/Import**: Save and share designs

## 📱 Responsive Design

Bendly is built mobile-first with responsive design principles:

- **Mobile Optimized**: Touch-friendly interface for design work
- **Progressive Enhancement**: Enhanced features on larger screens
- **Cross-device Sync**: Seamless experience across devices

## 🧪 Testing Strategy

### Testing Framework

- **Vitest**: Fast unit testing with React Testing Library
- **Playwright**: End-to-end testing for critical user flows

### Test Coverage

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and state management
- **E2E Tests**: Complete user journey testing

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Environment Requirements

- **Node.js**: Production-ready Node.js environment
- **Backend**: Running Bendly backend API
- **Database**: Connected database instance
- **File Storage**: Configured file storage (local or cloud)

### Deployment Platforms

- **Vercel**: Recommended for frontend deployment
- **Docker**: Containerized deployment
- **Self-hosted**: VPS or dedicated hosting

## 🛠️ Development Guidelines

### Code Style

- **ESLint**: Automated code linting
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking (no `any` types)
- **Conventional Commits**: Structured commit messages

### Component Architecture

- **Atomic Design**: Organized component hierarchy
- **Composition**: Flexible component composition
- **Accessibility**: WCAG compliant components

### Performance

- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js automatic optimization
- **Caching**: Intelligent caching strategies
- **Bundle Analysis**: Regular bundle size monitoring

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Workflow

1. Pick an issue from the backlog
2. Create a feature branch
3. Implement changes with tests
4. Ensure all tests pass
5. Submit pull request with description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions
- **Documentation**: Check the docs folder for detailed guides

## 🔄 Recent Updates

- Migration from Payload CMS to custom backend
- Next.js 15 and React 19 upgrade
- Canvas redesign with Fabric.js
- Enhanced authentication system
- Mobile-responsive improvements
- Performance optimizations

---

**Bendly** - Empowering custom manufacturing through innovative web technology.
