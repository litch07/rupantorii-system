"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../../lib/api";
import Button from "../../../../../components/common/Button";

const emptyVariant = { sku: "", size: "", color: "", material: "", price: "", stock: 0 };

export default function EditProductClient({ productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brand: "",
    basePrice: "",
    status: "active"
  });
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [categoryRes, productRes] = await Promise.all([
        api.get("/api/admin/categories"),
        api.get(`/api/admin/products/${productId}`)
      ]);

      setCategories(categoryRes.data || []);
      setProduct(productRes.data);
      setForm({
        name: productRes.data.name,
        description: productRes.data.description,
        categoryId: productRes.data.categoryId,
        brand: productRes.data.brand || "",
        basePrice: productRes.data.basePrice,
        status: productRes.data.status
      });
      setVariants(productRes.data.variants?.length ? productRes.data.variants : [{ ...emptyVariant }]);
    };

    load();
  }, [productId]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, idx) => (idx === index ? { ...variant, [field]: value } : variant))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      variants: variants
        .filter((variant) => variant.sku)
        .map((variant) => ({
          sku: variant.sku,
          size: variant.size || null,
          color: variant.color || null,
          material: variant.material || null,
          price: variant.price ? Number(variant.price) : null,
          stock: Number(variant.stock || 0)
        }))
    };

    await api.put(`/api/admin/products/${productId}`, payload);
    router.push("/admin/products");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    await api.post(`/api/admin/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const refreshed = await api.get(`/api/admin/products/${productId}`);
    setProduct(refreshed.data);
  };

  const handleDelete = async () => {
    await api.delete(`/api/admin/products/${productId}`);
    router.push("/admin/products");
  };

  if (!product) {
    return <p className="text-sm text-pine">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Edit Product</h1>
        <button type="button" className="btn-outline" onClick={handleDelete}>
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Name</span>
            <input name="name" value={form.name} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Brand</span>
            <input name="brand" value={form.brand} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Category</span>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Base Price</span>
            <input name="basePrice" value={form.basePrice} onChange={handleChange} type="number" className="rounded-2xl border border-mist bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3">
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm text-pine">
          <span className="uppercase tracking-[0.2em]">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} className="min-h-[140px] rounded-2xl border border-mist bg-white/80 px-4 py-3" />
        </label>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-ink">Variants</h2>
            <button type="button" className="btn-outline" onClick={addVariant}>Add Variant</button>
          </div>
          {variants.map((variant, index) => (
            <div key={index} className="grid gap-3 rounded-3xl border border-mist bg-white/70 p-4 md:grid-cols-3">
              <input placeholder="SKU" value={variant.sku} onChange={(e) => updateVariant(index, "sku", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Size" value={variant.size || ""} onChange={(e) => updateVariant(index, "size", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Color" value={variant.color || ""} onChange={(e) => updateVariant(index, "color", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Material" value={variant.material || ""} onChange={(e) => updateVariant(index, "material", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Price" type="number" value={variant.price || ""} onChange={(e) => updateVariant(index, "price", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Stock" type="number" value={variant.stock} onChange={(e) => updateVariant(index, "stock", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <button type="button" className="text-xs uppercase tracking-[0.2em] text-pine hover:text-rose" onClick={() => removeVariant(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button type="submit">Save Changes</Button>
      </form>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl text-ink">Product Images</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {product.images?.map((image) => (
            <div key={image.id} className="rounded-2xl border border-mist bg-white/70 px-4 py-3 text-xs text-pine">
              {image.url}
            </div>
          ))}
        </div>
        <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-center gap-4">
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
          <Button type="submit" variant="outline">Upload Images</Button>
        </form>
      </div>
    </div>
  );
}
