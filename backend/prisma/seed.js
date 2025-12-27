import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@rupantorii.test";
const ADMIN_PASSWORD = "Rupantorii123";

const placeholderImages = [
  "/uploads/placeholder-1.png",
  "/uploads/placeholder-2.png",
  "/uploads/placeholder-3.png"
];

const categories = [
  { name: "Bangles (?????)", slug: "bangles", description: "Traditional bangles with modern elegance." },
  { name: "Bracelets", slug: "bracelets", description: "Lightweight daily-wear bracelets." },
  { name: "Necklaces", slug: "necklaces", description: "Statement necklaces for special moments." },
  { name: "Rings", slug: "rings", description: "Minimal rings with intricate detailing." },
  { name: "Earrings", slug: "earrings", description: "Classic earrings for festive looks." },
  { name: "Jewelry Sets", slug: "jewelry-sets", description: "Coordinated sets for weddings and events." }
];

const products = [
  {
    name: "Rose Aura Bangles",
    slug: "rose-aura-bangles",
    description: "Warm rose-gold bangles crafted for everyday radiance.",
    brand: "Rupantorii",
    basePrice: 2800,
    status: "active",
    categorySlug: "bangles",
    variants: [
      { sku: "RUP-BAN-001-XS", size: "XS", color: "Rose Gold", material: "Brass", price: 2600, stock: 3 },
      { sku: "RUP-BAN-001-M", size: "M", color: "Rose Gold", material: "Brass", price: 2800, stock: 12 }
    ],
    images: [
      { url: placeholderImages[0], alt: "Rose Aura Bangles front", isPrimary: true },
      { url: placeholderImages[1], alt: "Rose Aura Bangles detail", isPrimary: false }
    ]
  },
  {
    name: "Lotus Whisper Necklace",
    slug: "lotus-whisper-necklace",
    description: "A delicate pendant necklace inspired by lotus petals.",
    brand: "Rupantorii",
    basePrice: 4200,
    status: "active",
    categorySlug: "necklaces",
    variants: [
      { sku: "RUP-NEC-010-16", size: "16in", color: "Champagne Gold", material: "Alloy", stock: 7 },
      { sku: "RUP-NEC-010-18", size: "18in", color: "Champagne Gold", material: "Alloy", price: 4500, stock: 2 }
    ],
    images: [
      { url: placeholderImages[1], alt: "Lotus Whisper Necklace", isPrimary: true },
      { url: placeholderImages[2], alt: "Lotus Whisper Necklace closeup", isPrimary: false }
    ]
  },
  {
    name: "Midnight Pearl Earrings",
    slug: "midnight-pearl-earrings",
    description: "Pearl drop earrings with a midnight enamel finish.",
    brand: "Rupantorii",
    basePrice: 1900,
    status: "active",
    categorySlug: "earrings",
    variants: [
      { sku: "RUP-EAR-021-STD", color: "Midnight Blue", material: "Resin", stock: 18 },
      { sku: "RUP-EAR-021-PRM", color: "Midnight Blue", material: "Resin", price: 2100, stock: 4 }
    ],
    images: [
      { url: placeholderImages[2], alt: "Midnight Pearl Earrings", isPrimary: true },
      { url: placeholderImages[0], alt: "Midnight Pearl Earrings detail", isPrimary: false }
    ]
  }
];

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: hashedPassword },
    create: { email: ADMIN_EMAIL, password: hashedPassword, role: "admin" }
  });

  const categoryMap = new Map();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description
      },
      create: category
    });

    categoryMap.set(category.slug, record);
  }

  for (const product of products) {
    const category = categoryMap.get(product.categorySlug);

    if (!category) {
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        brand: product.brand,
        basePrice: product.basePrice,
        status: product.status,
        categoryId: category.id,
        variants: {
          deleteMany: {},
          create: product.variants
        },
        images: {
          deleteMany: {},
          create: product.images
        }
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        brand: product.brand,
        basePrice: product.basePrice,
        status: product.status,
        categoryId: category.id,
        variants: { create: product.variants },
        images: { create: product.images }
      }
    });
  }
}

main()
  .then(() => {
    console.log("Seed data inserted.");
  })
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
