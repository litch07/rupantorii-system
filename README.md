# Rupantorii - Full-Stack E-Commerce Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com)

A production-minded, local-first e-commerce system designed for modern Bengali jewelry and lifestyle brands. Rupantorii combines a clean storefront experience with a capable admin console, structured data design, and practical operational tooling.

---

## Project Overview

Rupantorii is a full-stack commerce platform built to show end-to-end product lifecycle management: catalog, checkout, fulfillment, and post-purchase support. It is designed to be approachable for small businesses and students, while still reflecting professional engineering practices.

### Problem Statement & Vision

- **Problem:** Many small brands struggle to launch a reliable, maintainable storefront with modern admin capabilities.
- **Vision:** Deliver a clean, local-first commerce stack that can evolve into a production-ready system with minimal friction.

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- React Hook Form + Zod validation

**Backend**
- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL 15
- JWT authentication

**Infrastructure**
- Docker Compose
- Local file storage for uploads

---

## Core Features

### Customer-Facing
- Product discovery with filters, search, and price range
- Product variants with stock visibility
- Discounts with live price updates
- Cart persistence and checkout
- Customer accounts, saved addresses, and order history
- Order tracking by order number and phone
- Reviews and questions with admin replies

### Admin-Facing
- Full product and category management
- Variant inventory management
- Discount and featured product controls
- Order workflow with receipts and status updates
- Low-stock alerts
- Sales reports with CSV export
- Review and question management

---

## Architecture (High-Level)

```
Frontend (Next.js)
  -> API Gateway (Express)
  -> Database (PostgreSQL)
```

Detailed architecture notes: `docs/ARCHITECTURE.md`

---

## Local Development Setup

### Prerequisites
- Node.js 18+ LTS
- Docker + Docker Compose (recommended)
- PostgreSQL 15+ (non-Docker option)

### Option A: Docker (Recommended)
```bash
# clone
git clone https://github.com/litch07/rupantorii-system.git
cd rupantorii-system

# environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# start services
docker compose up --build -d

# migrate and seed
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed
```

Access:
- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin
- API: http://localhost:4000

### Option B: Manual Setup
```bash
# backend
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev

# frontend
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

**Windows note:** use `npm.cmd` instead of `npm` when needed.

---

## Deployment (Vercel + Render + Supabase)

Recommended low-cost stack:
- **Database:** Supabase or Neon (PostgreSQL)
- **Backend:** Render (Node.js service)
- **Frontend:** Vercel (Next.js)

High-level flow:
1. Create the PostgreSQL database and copy the `DATABASE_URL`.
2. Deploy the backend and set production env vars (including `DATABASE_URL`).
3. Deploy the frontend and set `NEXT_PUBLIC_API_URL` to the backend URL.
4. Test end-to-end flows (catalog, checkout, admin).

See the deployment guide in the project instructions or open an issue if you need help.

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/rupantorii_db
NODE_ENV=development
PORT=4000
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT=10
API_RATE_LIMIT=100

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=Rupantorii <your-email@example.com>
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000
```

---

## Database & Seeding

- Prisma schema lives in `backend/prisma/schema.prisma`.
- Run `npm run prisma:migrate` to apply schema changes.
- Run `npm run prisma:seed` to seed categories, products, and admin user.

---

## API Overview

### Public
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/orders`
- `GET /api/orders/track?orderNumber=...&phone=...`

### Admin
- `POST /api/admin/auth/login`
- `PUT /api/admin/auth/password`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/reports/sales`

---

## Security Considerations

- JWT-based authentication
- Rate limiting on auth routes
- Helmet + CORS hardening
- Input validation on all API endpoints
- No secrets committed to the repository

---

## Scalability & Future Improvements

- Move uploads to cloud storage (S3/Cloudinary)
- Background jobs for emails and PDF receipts
- CDN for static media
- Advanced analytics and audit logs
- Payment gateway integration

---

## Repository Structure

```
backend/    Express + Prisma API
frontend/   Next.js storefront + admin
docs/       Architecture notes
```

---

## Disclaimer

This project is intended for portfolio and educational purposes. It demonstrates full-stack engineering practices and a production-ready mindset, but it should be audited and configured for real-world deployment requirements.

---

## License

MIT
