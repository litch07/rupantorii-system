# Architecture Overview

Rupantorii is a local-first, full-stack commerce system with a clean separation of concerns:

```
Client (Next.js 14)
  ├─ Storefront (customers)
  ├─ Admin console (products, orders, support)
  └─ API clients (axios instances)

API (Express + Prisma)
  ├─ Public APIs (catalog, checkout, tracking)
  ├─ Auth APIs (admin + customer)
  ├─ Admin APIs (inventory, orders, reports)
  └─ Support APIs (reviews, questions, replies)

Database (PostgreSQL 15)
  ├─ Users / Addresses
  ├─ Products / Variants / Images
  ├─ Orders / OrderItems
  └─ Reviews / Questions
```

## Data flow highlights

- **Catalog**: Next.js pages call `/api/products` for listing + filters, and `/api/products/:id` for details.
- **Checkout**: Orders are created through `/api/orders`, with stock committed on delivery to avoid premature depletion.
- **Discounts**: Admin-defined discounts apply to every price calculation (cart, order totals, receipts).
- **Admin operations**: Admins update order statuses and reply to reviews/questions via protected endpoints.
- **Emails**: Order confirmations and status updates are sent when `customerEmail` is provided.

## Security controls

- JWT authentication for admins and customers
- Rate limiting on auth endpoints
- Helmet + CORS hardening
- Input validation and sanitization on every route

## Scaling path

- Move uploads to object storage (S3/Cloudinary)
- Introduce job queues for email + PDF generation
- Add caching for catalog queries
- Split admin/storefront deployments if needed
