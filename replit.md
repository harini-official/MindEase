# MindEase - Student Wellness Platform

## Overview

MindEase is a student wellness platform designed to support mental health, motivation, and academic balance. The application offers features like daily motivation quotes, mindful blog posts, planner templates, relaxation exercises, and an audio library with meditation and focus resources.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

MindEase follows a modern web application architecture with clear separation of concerns:

1. **Frontend**: React-based SPA with Typescript
   - Built using Vite as the bundler
   - Uses React Query for data fetching
   - Components built with Radix UI and styled with Tailwind CSS
   - Responsive design for both mobile and desktop views

2. **Backend**: Express.js API server
   - RESTful API endpoints for various resources
   - Server-side rendering support in development
   - Logging middleware for API requests

3. **Database**: PostgreSQL with Drizzle ORM
   - Schema defined in shared directory
   - Zod for validation schemas
   - Migration support via drizzle-kit

4. **Authentication**: Not fully implemented in the current codebase, but schema includes user table

## Key Components

### Frontend Components

1. **UI Components**: Built using Radix UI primitives with Tailwind styling
   - Comprehensive set of UI components (buttons, cards, forms, etc.)
   - Accessible and responsive design patterns
   - Dark/light mode support

2. **Page Components**:
   - Home page with multiple sections
   - Each section corresponds to a feature (motivation, blog, planner, etc.)
   - 404 page for handling non-existent routes

3. **Layout Components**:
   - Header with navigation
   - Footer with links and information
   - Mobile menu for responsive navigation

### Backend Components

1. **API Routes**: RESTful endpoints for:
   - Motivation quotes
   - Blog posts
   - Planner templates
   - Audio resources
   - Testimonials
   - Contact messages

2. **Storage Layer**: Abstract interface for data storage with implementations:
   - Memory storage (likely for development)
   - Database storage (PostgreSQL)

3. **Schema Definitions**: Shared between frontend and backend:
   - Database schema using Drizzle ORM
   - Validation schemas using Zod

## Data Flow

1. **API Data Flow**:
   - Client requests data through React Query hooks
   - Express server handles API requests
   - Storage layer retrieves/persists data
   - Response is sent back to the client

2. **User Interaction Flow**:
   - User interacts with UI components
   - React components update state locally
   - Form submissions and data changes are sent to the API
   - Feedback is provided to the user via toast notifications

3. **Application State Management**:
   - React Query for server state
   - React hooks for local component state
   - Context API for theme and UI state

## External Dependencies

### Frontend Dependencies

1. **UI Framework**:
   - Radix UI primitives for accessible components
   - Tailwind CSS for styling
   - Lucide icons

2. **Data Management**:
   - TanStack React Query for data fetching and caching
   - React Hook Form for form state management
   - Zod for validation

3. **Routing and Navigation**:
   - Wouter for lightweight routing

### Backend Dependencies

1. **Server Framework**:
   - Express.js for API routes and middleware

2. **Database Access**:
   - Drizzle ORM for database queries
   - Neon PostgreSQL serverless driver

3. **Utilities**:
   - Vite for development server and bundling
   - TypeScript for type safety

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Vite builds the frontend assets
   - ESBuild bundles the server code
   - Assets are served from the server's public directory

2. **Runtime Configuration**:
   - Node.js 20 for server runtime
   - PostgreSQL 16 for database
   - Environment variables for configuration

3. **Scalability**:
   - Configured for auto-scaling deployment
   - Optimized for Replit's infrastructure

## Database Schema

The database schema includes the following key tables:

1. **Users**: For authentication and user management
   - Fields: id, username, password

2. **Motivation Quotes**: For the daily motivation feature
   - Fields: id, quote, author, imageUrl

3. **Blog Posts**: For the mindful blog
   - Fields: id, title, content, excerpt, imageUrl, publishDate, category

4. **Planner Templates**: For downloadable planning resources
   - Fields likely include: id, title, description, fileUrl, etc.

5. **Audio Resources**: For the meditation and focus library
   - Fields likely include: id, title, description, audioUrl, etc.

6. **Testimonials**: For user success stories
   - Fields likely include: id, content, studentName, studentTitle, rating

7. **Contact Messages**: For user support requests
   - Fields likely include: id, name, email, subject, message