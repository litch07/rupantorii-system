import prisma from "../config/database.js";
import { slugify } from "../utils/slug.js";

export async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug, description } = req.body;
    const finalSlug = slug ? slug : slugify(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null
      }
    });

    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const data = {
      ...(name ? { name } : {}),
      ...(slug ? { slug } : {}),
      ...(description !== undefined ? { description: description || null } : {})
    };

    const category = await prisma.category.update({
      where: { id },
      data
    });

    return res.json(category);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });

    if (productCount > 0) {
      return res.status(400).json({ message: "Category has products and cannot be deleted." });
    }

    await prisma.category.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
}
