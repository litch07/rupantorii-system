import { Prisma } from "@prisma/client";

const DISCOUNT_TYPES = ["percentage", "amount"];

export function normalizeDiscount(type, value) {
  const normalizedType = DISCOUNT_TYPES.includes(type) ? type : null;
  const numericValue = value === null || value === undefined || Number.isNaN(Number(value)) ? null : Number(value);

  if (!normalizedType || numericValue === null || numericValue <= 0) {
    return { discountType: null, discountValue: null };
  }

  const clampedValue = normalizedType === "percentage"
    ? Math.min(numericValue, 100)
    : numericValue;

  return { discountType: normalizedType, discountValue: clampedValue };
}

export function applyDiscount(price, discountType, discountValue) {
  const base = new Prisma.Decimal(price || 0);
  const normalized = normalizeDiscount(discountType, discountValue);

  if (!normalized.discountType || normalized.discountValue === null) {
    return base;
  }

  if (normalized.discountType === "percentage") {
    const multiplier = new Prisma.Decimal(1).minus(new Prisma.Decimal(normalized.discountValue).div(100));
    const discounted = base.mul(multiplier);
    return discounted.lessThan(0) ? new Prisma.Decimal(0) : discounted;
  }

  const discounted = base.minus(new Prisma.Decimal(normalized.discountValue));
  return discounted.lessThan(0) ? new Prisma.Decimal(0) : discounted;
}

export function getDiscountPercent(price, discountType, discountValue) {
  const base = Number(price);
  if (!base) {
    return 0;
  }
  const discounted = Number(applyDiscount(base, discountType, discountValue));
  const percent = ((base - discounted) / base) * 100;
  return percent > 0 ? Math.round(percent) : 0;
}
