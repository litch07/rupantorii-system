# Rupantorii - E-Commerce Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com)

> A modern, local-first e-commerce platform inspired by Bengali jewelry and lifestyle traditions.

---

## Features

- Guest checkout with cash on delivery
- Customer accounts with saved addresses and order history
- Product variants, stock alerts, and availability states
- Admin dashboard for products, orders, reviews, questions, and reports
- PDF order receipts and email status updates
- Mobile-first, responsive UI with accessible components

---

## Quick Start

### Prerequisites
- Node.js 18+ LTS
- Docker + Docker Compose (recommended)
- PostgreSQL 15+ (non-Docker setup)

### Option A: Docker (recommended)
```bash
# Clone and enter the repo
git clone https://github.com/yourusername/rupantorii.git
cd rupantorii

# Create environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start services
docker compose up --build -d

# Run migrations and seed data
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed
```

Access the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin Panel: http://localhost:3000/admin

### Option B: Manual setup
```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/rupantorii_db
NODE_ENV=development
PORT=4000
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=Rupantorii <your-email@example.com>
```

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## API Overview

### Admin Login
```bash
curl -X POST http://localhost:4000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### Create Order
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName":"Asha Rahman",
    "customerPhone":"01700000000",
    "customerEmail":"asha@example.com",
    "address":"House 12, Road 4",
    "city":"Dhaka",
    "paymentMethod":"cod",
    "items":[
      {"productId":"PRODUCT_ID","variantId":"VARIANT_ID","quantity":1}
    ]
  }'
```

### Track Order
```bash
curl "http://localhost:4000/api/orders/track?orderNumber=RUP-XXXXX&phone=01700000000"
```

---

## Project Structure
```
backend/   Express + Prisma API
frontend/  Next.js 14 storefront + admin
docker-compose.yml
```

---

## Production Checklist
- Update environment variables for production
- Configure HTTPS and domain-based CORS
- Enable file storage (S3 or CDN) if needed
- Set up database backups
- Add monitoring and alerting

---

## Testing Checklist

Frontend
- [ ] All pages load without errors
- [ ] Mobile responsiveness across 320px to 1024px
- [ ] Forms validate and display error messages
- [ ] Cart persists across refresh
- [ ] Checkout completes successfully
- [ ] Order confirmation and tracking work
- [ ] Accessibility labels present

Backend
- [ ] Auth endpoints enforce rate limits
- [ ] API responses return proper status codes
- [ ] File uploads validate type and size
- [ ] Prisma migrations applied
- [ ] Orders update stock on delivery/cancel
- [ ] Email notifications send successfully

Security
- [ ] JWT secrets are not committed
- [ ] Sensitive data removed from responses
- [ ] CORS restricted to frontend domain
- [ ] Rate limits configured

---

## License
MIT
