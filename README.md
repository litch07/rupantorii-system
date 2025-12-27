# Rupantorii E-Commerce System

## Project Overview
Rupantorii is a local-first e-commerce platform for a Bengali jewelry and lifestyle brand. It ships with a production-structured Express API, Prisma/PostgreSQL database, and a Next.js 14 storefront + admin dashboard.

## Prerequisites
- Node.js 18+
- Docker (optional but recommended)
- PostgreSQL 15 (for non-Docker setup)

## Quick Start with Docker
```bash
# 1) Create environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 2) Build and start services
docker-compose up --build -d

# 3) Run migrations and seed data
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

## Manual Setup without Docker
```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Environment Configuration
- Root `.env` controls Docker Postgres defaults.
- `backend/.env` controls API + Prisma.
- `frontend/.env.local` controls API base URL for the browser.

Example backend `.env`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://rupantorii:rupantorii123@db:5432/rupantorii_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
```

## Database Setup & Seeding
```bash
# Docker
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed

# Non-Docker
cd backend
npm run prisma:migrate
npm run prisma:seed
```

Seeded admin:
- Email: admin@rupantorii.test
- Password: Rupantorii123

## Running the Application
- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Uploads: http://localhost:4000/uploads

## API Documentation
### Login (Admin)
```bash
curl -X POST http://localhost:4000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rupantorii.test","password":"Rupantorii123"}'
```

### Products (Public)
```bash
curl http://localhost:4000/api/products?page=1&limit=20
```

### Create Order (Public)
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName":"Asha Rahman",
    "customerPhone":"01700000000",
    "address":"House 12, Road 4",
    "city":"Dhaka",
    "paymentMethod":"cod",
    "items":[
      {"productId":"PRODUCT_ID","variantId":"VARIANT_ID","quantity":1}
    ]
  }'
```

## Project Structure
```
backend/         Express + Prisma API
frontend/        Next.js 14 storefront + admin dashboard
docker-compose.yml
```

## Troubleshooting
- If migrations fail, ensure Postgres is healthy and `DATABASE_URL` matches your environment.
- If Next.js cannot reach the API in Docker, confirm `NEXT_PUBLIC_API_URL` and `API_URL` in `docker-compose.yml`.
- If uploads fail, verify `backend/uploads` exists and has write permissions.

## Testing Checklist
- [ ] Database migrations applied
- [ ] Admin user seeded
- [ ] Can login to admin panel
- [ ] Can create product with variants
- [ ] Can upload product images
- [ ] Products appear on frontend
- [ ] Can add to cart
- [ ] Can complete checkout
- [ ] Order appears in admin dashboard
- [ ] Can update order status
- [ ] Low stock alerts working
