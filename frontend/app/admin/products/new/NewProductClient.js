"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";
import Button from "../../../../components/common/Button";
import { getErrorMessage } from "../../../../lib/helpers";

const emptyVariant = { sku: "", size: "", color: "", material: "", price: "", stock: "" };

export default function NewProductClient() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageAlt, setImageAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brand: "",
    basePrice: "",
    discountType: "none",
    discountValue: "",
    isFeatured: false,
    stock: "",
    status: "active"
  });
  const [variants, setVariants] = useState([{ ...emptyVariant }]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/api/admin/categories");
        setCategories(response.data || []);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Unable to load categories."));
      }
    };
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    setLoading(true);
    setErrorMessage("");
    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      stock: Number(form.stock || 0),
      discountType: form.discountType === "none" ? null : form.discountType,
      discountValue: form.discountType === "none" || !form.discountValue ? null : Number(form.discountValue),
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

    try {
      const response = await api.post("/api/admin/products", payload);
      const productId = response.data?.id;

      if (productId && images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        if (imageAlt.trim()) {
          formData.append("alt", imageAlt.trim());
        }
        await api.post(`/api/admin/products/${productId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      router.push(productId ? `/admin/products/${productId}/edit` : "/admin/products");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create product."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ink">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
            {errorMessage}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Name</span>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Brand</span>
            <input name="brand" value={form.brand} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Category</span>
            <select
              name="categoryId"
              required
              value={form.categoryId}
              onChange={handleChange}
              className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Base Price</span>
            <input
              name="basePrice"
              required
              value={form.basePrice}
              onChange={handleChange}
              inputMode="decimal"
              placeholder="e.g. 2500"
              className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Discount Type</span>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
            >
              <option value="none">No discount</option>
              <option value="percentage">Percentage (%)</option>
              <option value="amount">Flat amount (BDT)</option>
            </select>
          </label>
          {form.discountType !== "none" ? (
            <label className="flex flex-col gap-2 text-sm text-pine">
              <span className="uppercase tracking-[0.2em]">Discount Value</span>
              <input
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                inputMode="decimal"
                placeholder={form.discountType === "percentage" ? "e.g. 15" : "e.g. 300"}
                className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
              />
            </label>
          ) : null}
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Stock Qty</span>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 20"
              className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
            />
            <span className="text-xs text-pine">Used when no variants are added.</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-pine">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 accent-rose"
            />
            <span className="uppercase tracking-[0.2em]">Feature on dashboard</span>
          </label>
          <label className="flex flex-col gap-2 text-sm text-pine">
            <span className="uppercase tracking-[0.2em]">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="rounded-2xl border border-mist bg-white/80 px-4 py-3">
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm text-pine">
          <span className="uppercase tracking-[0.2em]">Description</span>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            className="min-h-[140px] rounded-2xl border border-mist bg-white/80 px-4 py-3"
          />
        </label>

        <div className="space-y-3 rounded-3xl border border-mist bg-white/60 p-4">
          <h2 className="text-xl text-ink">Product Images</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setImages(Array.from(event.target.files || []))}
            className="block w-full text-sm text-pine file:mr-4 file:rounded-full file:border-0 file:bg-rose/20 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.2em] file:text-rose"
          />
          <input
            placeholder="Optional image alt text"
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            className="w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm"
          />
          <p className="text-xs text-pine">
            You can also upload or replace images later from the edit page.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-ink">Variants</h2>
            <button type="button" className="btn-outline" onClick={addVariant}>Add Variant</button>
          </div>
          {variants.map((variant, index) => (
            <div key={index} className="grid gap-3 rounded-3xl border border-mist bg-white/70 p-4 md:grid-cols-3">
              <input placeholder="SKU" value={variant.sku} onChange={(e) => updateVariant(index, "sku", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Size" value={variant.size} onChange={(e) => updateVariant(index, "size", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Color" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Material" value={variant.material} onChange={(e) => updateVariant(index, "material", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input placeholder="Price" inputMode="decimal" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} className="rounded-xl border border-mist bg-white/80 px-3 py-2" />
              <input
                placeholder="Stock Qty"
                inputMode="numeric"
                pattern="[0-9]*"
                value={variant.stock}
                onChange={(e) => updateVariant(index, "stock", e.target.value)}
                className="rounded-xl border border-mist bg-white/80 px-3 py-2"
              />
              <button type="button" className="text-xs uppercase tracking-[0.2em] text-pine hover:text-rose" onClick={() => removeVariant(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
