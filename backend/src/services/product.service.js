import fs from "fs";
import path from "path";
import prisma from "../config/database.js";
import { slugify } from "../utils/slug.js";
import { applyDiscount, getDiscountPercent, normalizeDiscount } from "../utils/discount.js";

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const resolvedUploadDir = path.resolve(process.cwd(), uploadDir);

const SORT_OPTIONS = {
  newest: [{ createdAt: "desc" }],
  price_asc: [{ basePrice: "asc" }],
  price_desc: [{ basePrice: "desc" }],
  top_rated: [{ reviews: { _avg: { rating: "desc" } } }, { createdAt: "desc" }]
};

function buildProductWhere({ categorySlug, q, minPrice, maxPrice, status, admin }) {
  const where = {};

  if (!admin) {
    where.status = { in: ["active", "out_of_stock"] };
  } else if (status) {
    where.status = status;
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {})
    };
  }

  return where;
}

export async function listProducts({
  page = 1,
  limit = 20,
  categorySlug,
  q,
  minPrice,
  maxPrice,
  status,
  sort = "newest",
  admin = false
}) {
  const skip = (page - 1) * limit;
  const where = buildProductWhere({ categorySlug, q, minPrice, maxPrice, status, admin });
  const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        variants: true
      },
      orderBy,
      skip,
      take: limit
    })
  ]);

  const productIds = data.map((product) => product.id);
  const ratingStats = productIds.length
    ? await prisma.productReview.groupBy({
        by: ["productId"],
        where: { productId: { in: productIds } },
        _avg: { rating: true },
        _count: { _all: true }
      })
    : [];

  const ratingMap = new Map(
    ratingStats.map((row) => [
      row.productId,
      { rating: Number(row._avg.rating || 0), count: row._count._all || 0 }
    ])
  );

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: data.map((product) => {
      const stats = ratingMap.get(product.id) || { rating: 0, count: 0 };
      const discountedPrice = applyDiscount(product.basePrice, product.discountType, product.discountValue);
      return {
        ...product,
        rating: stats.rating,
        reviewCount: stats.count,
        discountedPrice,
        discountPercent: getDiscountPercent(product.basePrice, product.discountType, product.discountValue)
      };
    }),
    total,
    page,
    totalPages
  };
}

export async function getProductById(idOrSlug, admin = false) {
  const where = admin
    ? { OR: [{ id: idOrSlug }, { slug: idOrSlug }] }
    : { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: { in: ["active", "out_of_stock"] } };

  const product = await prisma.product.findFirst({
    where,
    include: {
      category: true,
      images: true,
      variants: true
    }
  });

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  const ratingStats = await prisma.productReview.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: { _all: true }
  });

  return {
    ...product,
    rating: Number(ratingStats._avg.rating || 0),
    reviewCount: ratingStats._count._all || 0,
    discountedPrice: applyDiscount(product.basePrice, product.discountType, product.discountValue),
    discountPercent: getDiscountPercent(product.basePrice, product.discountType, product.discountValue)
  };
}

export async function createProduct(payload) {
  const slug = payload.slug ? payload.slug : slugify(payload.name);
  const discount = normalizeDiscount(payload.discountType, payload.discountValue);

  return prisma.product.create({
    data: {
      name: payload.name,
      slug,
      description: payload.description,
      categoryId: payload.categoryId,
      brand: payload.brand || null,
      basePrice: payload.basePrice,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      isFeatured: Boolean(payload.isFeatured),
      stock: payload.stock ?? 0,
      status: payload.status || "active",
      variants: payload.variants?.length ? { create: payload.variants } : undefined
    },
    include: {
      category: true,
      images: true,
      variants: true
    }
  });
}

export async function updateProduct(id, payload) {
  const applyDiscountUpdate = payload.discountType !== undefined || payload.discountValue !== undefined;
  const discount = applyDiscountUpdate
    ? normalizeDiscount(payload.discountType, payload.discountValue)
    : null;

  const updateData = {
    ...(payload.name ? { name: payload.name } : {}),
    ...(payload.slug ? { slug: payload.slug } : {}),
    ...(payload.description ? { description: payload.description } : {}),
    ...(payload.categoryId ? { categoryId: payload.categoryId } : {}),
    ...(payload.brand !== undefined ? { brand: payload.brand } : {}),
    ...(payload.basePrice !== undefined ? { basePrice: payload.basePrice } : {}),
    ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.isFeatured !== undefined ? { isFeatured: Boolean(payload.isFeatured) } : {}),
    ...(applyDiscountUpdate
      ? { discountType: discount.discountType, discountValue: discount.discountValue }
      : {})
  };

  if (payload.variants) {
    updateData.variants = {
      deleteMany: {},
      create: payload.variants
    };
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      images: true,
      variants: true
    }
  });
}

export async function deleteProduct(id) {
  return prisma.product.delete({ where: { id } });
}

export async function addProductImages(productId, files, alt) {
  if (!files || files.length === 0) {
    const error = new Error("No files uploaded");
    error.status = 400;
    throw error;
  }

  const existingPrimary = await prisma.productImage.findFirst({
    where: { productId, isPrimary: true }
  });

  const imagesData = files.map((file, index) => ({
    url: `/uploads/${file.filename}`,
    alt: alt || null,
    isPrimary: !existingPrimary && index === 0
  }));

  await prisma.productImage.createMany({
    data: imagesData.map((image) => ({ ...image, productId }))
  });

  return prisma.product.findUnique({
    where: { id: productId },
    include: { images: true }
  });
}

export async function deleteProductImage(imageId) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });

  if (!image) {
    const error = new Error("Image not found");
    error.status = 404;
    throw error;
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  const filename = path.basename(image.url);
  const filePath = path.join(resolvedUploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return { success: true };
}
