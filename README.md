# Store Admin
[![CI](https://github.com/KJSmaybe/store-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/KJSmaybe/store-admin/actions/workflows/ci.yml)

Admin dashboard for managing an e-commerce store built with Nuxt 3, Vue 3, TypeScript, PostgreSQL and Prisma.

The project demonstrates a full-stack administration system with authentication, role-based access, product management, order processing, inventory control and automated testing.

## Features

### Authentication

- Login with email and password
- JWT authentication
- HttpOnly authentication cookie
- Protected frontend routes
- Protected backend API endpoints
- User roles:
  - ADMIN
  - MANAGER

### Products

- Create products
- Edit products
- Delete products
- Inventory tracking
- Search by product name
- Filter by stock status
- Sort by:
  - name
  - price
  - stock
- Pagination
- Low-stock and out-of-stock detection

### Orders

- Create orders with multiple products
- Server-side total calculation
- Product stock validation
- Automatic stock reduction
- Database transactions
- Order status workflow

Supported order transitions:

```text
PENDING
├── PAID
└── CANCELLED

PAID
├── SHIPPED
└── CANCELLED

SHIPPED
└── COMPLETED
```

When an order is cancelled, product stock is automatically restored.

Orders support:

- Search by customer
- Status filtering
- Sorting
- Pagination

### Users

ADMIN users can:

- View users
- Create users
- Assign ADMIN or MANAGER roles
- Activate users
- Deactivate users

The system prevents accidental removal of the last active administrator.

### Dashboard

The dashboard displays:

- Product count
- Total inventory
- Orders
- Pending orders
- Revenue
- Out-of-stock products
- Recent orders
- Inventory alerts

## Tech Stack

### Frontend

- Nuxt 3
- Vue 3
- TypeScript
- Pinia

### Backend

- Nuxt Nitro
- REST API
- Prisma ORM
- PostgreSQL

### Authentication

- JWT
- jose
- bcryptjs
- HttpOnly cookies

### Testing

- Vitest
- vue-tsc

## Project Structure

```text
store-admin/
├── components/
│   ├── orders/
│   └── products/
│
├── layouts/
├── middleware/
├── pages/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── server/
│   ├── api/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   │
│   └── utils/
│
├── stores/
├── tests/
├── types/
├── utils/
│
├── app.vue
├── nuxt.config.ts
└── prisma7.config.ts
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd store-admin
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/store_admin?schema=public"
NUXT_AUTH_SECRET="replace-with-a-long-random-secret"
```

Do not commit the real `.env` file.

## Database Setup

Make sure PostgreSQL is running and the database exists.

Generate Prisma Client:

```bash
npm run db:generate
```

Apply existing migrations:

```bash
npm run db:setup
```

Or during development:

```bash
npm run db:migrate
```

Seed demo products:

```bash
npm run db:seed
```

The seed script does not add duplicate demo products if products already exist.

## Development

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Testing

Run all unit tests:

```bash
npm test
```

Current test suite covers:

- order status transitions
- product filtering
- product sorting
- product pagination
- order filtering
- order sorting
- order pagination

Run tests in watch mode:

```bash
npm run test:watch
```

## Type Checking

```bash
npm run typecheck
```

## Production Build

```bash
npm run build
```

## Full Project Check

Run tests, TypeScript checking and production build with one command:

```bash
npm run check
```

This executes:

```text
Unit tests
    ↓
TypeScript check
    ↓
Production build
```

## API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Products

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
GET  /api/orders
POST /api/orders
PUT  /api/orders/:id
```

### Users

```text
GET  /api/users
POST /api/users
PUT  /api/users/:id
```

Product and order endpoints require authentication.

User management endpoints require the ADMIN role.

## Quality Checks

The project currently passes:

```text
36 automated tests
TypeScript type checking
Nuxt production build
```

## Security

The project includes:

- password hashing with bcrypt
- JWT verification on the server
- HttpOnly authentication cookies
- server-side API authorization
- role-based access control
- protection against disabling the last active administrator
- server-side order total calculation
- transactional stock updates
- stock validation during concurrent order creation
- environment variables excluded from Git

## Future Improvements

Possible future improvements include:

- integration tests for API endpoints
- end-to-end tests
- server-side pagination
- improved form validation
- Docker configuration
- CI/CD
- deployment
- audit logging