# IT Infrastructure Survey System

## Overview

This is a full-stack web application designed to collect and analyze IT infrastructure feedback from employees across VIA, VLI, and VIA NEXT companies. The system features a comprehensive survey form for employees to report IT issues and experiences, along with an analytics dashboard for administrators to visualize and understand the collected data.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Data Visualization**: Recharts for analytics charts and graphs

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Request Handling**: Express middleware for JSON parsing and logging
- **Development**: Vite for development server and hot module replacement

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Production Storage**: DatabaseStorage class for persistent data storage

## Key Components

### Survey Form (`/components/survey-form.tsx`)
- Multi-section survey capturing employee IT experiences
- Form validation using Zod schemas
- Support for multiple question types (radio, checkbox, text input)
- Real-time validation feedback
- Responsive design for mobile and desktop

### Analytics Dashboard (`/components/analytics-dashboard.tsx`)
- Interactive data visualizations using Recharts
- Multiple chart types: bar charts, pie charts, radar charts
- Real-time data fetching with loading states
- Export functionality for data analysis
- Responsive layout with grid system

### Database Schema (`/shared/schema.ts`)
- Survey responses table with comprehensive field coverage
- JSON storage for array-type fields (IT resources, problems, improvements)
- Timestamp tracking for response creation
- Proper TypeScript types with Drizzle ORM integration

## Data Flow

1. **Survey Submission**: 
   - User fills out survey form → Form validation → API call to `/api/survey`
   - Server validates data using Zod schema → Stores in database → Returns success response

2. **Analytics Display**:
   - Dashboard loads → Fetches data from `/api/survey/responses` and `/api/survey/analytics`
   - Data processed for visualization → Charts rendered with Recharts
   - Real-time updates through TanStack Query caching

3. **Error Handling**:
   - Client-side validation prevents invalid submissions
   - Server-side validation with detailed error messages
   - Toast notifications for user feedback
   - Graceful fallbacks for loading states

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **zod**: Runtime type validation and schema parsing

### UI and Styling
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **recharts**: Chart library for data visualization

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR
- **Database**: Neon serverless PostgreSQL
- **Storage Fallback**: In-memory storage for development/testing
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: esbuild bundles server code for Node.js deployment
- **Database Migrations**: Drizzle Kit handles schema changes
- **Asset Serving**: Express serves static files in production

### Build Commands
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build both frontend and backend for production
- `npm run start`: Start production server
- `npm run db:push`: Apply database schema changes

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.