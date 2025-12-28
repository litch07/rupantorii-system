export function formatPrice(value) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function getServerApiUrl() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) {
    return fallback;
  }
  if (error.response?.status === 429) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  const responseMessage = error.response?.data?.message;
  if (responseMessage) {
    return responseMessage;
  }
  const responseErrors = error.response?.data?.errors;
  if (Array.isArray(responseErrors) && responseErrors.length > 0) {
    return responseErrors[0]?.msg || fallback;
  }
  return error.message || fallback;
}

export function getDiscountMeta(price, discountType, discountValue) {
  const base = Number(price || 0);
  const value = discountValue === null || discountValue === undefined ? 0 : Number(discountValue);
  if (!discountType || value <= 0 || !base) {
    return { discountedPrice: base, discountPercent: 0, isDiscounted: false };
  }

  let discountedPrice = base;
  if (discountType === "percentage") {
    discountedPrice = base * (1 - value / 100);
  } else if (discountType === "amount") {
    discountedPrice = base - value;
  }

  if (discountedPrice < 0) {
    discountedPrice = 0;
  }

  const discountPercent = Math.round(((base - discountedPrice) / base) * 100);
  return {
    discountedPrice,
    discountPercent: discountPercent > 0 ? discountPercent : 0,
    isDiscounted: discountedPrice < base
  };
}

