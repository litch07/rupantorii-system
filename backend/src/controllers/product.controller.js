import {
  addProductImages,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProductById,
  listProducts,
  updateProduct
} from "../services/product.service.js";

function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
  return { page, limit };
}

export async function listPublicProducts(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await listProducts({
      page,
      limit,
      categorySlug: req.query.category,
      q: req.query.q,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      admin: false
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function listAdminProducts(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await listProducts({
      page,
      limit,
      categorySlug: req.query.category,
      q: req.query.q,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      status: req.query.status,
      admin: true
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getPublicProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id, false);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function getAdminProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id, true);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function createProductHandler(req, res, next) {
  try {
    const product = await createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function updateProductHandler(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProductHandler(req, res, next) {
  try {
    await deleteProduct(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
}

export async function uploadProductImages(req, res, next) {
  try {
    const product = await addProductImages(req.params.id, req.files, req.body.alt);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProductImageHandler(req, res, next) {
  try {
    const result = await deleteProductImage(req.params.imageId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
