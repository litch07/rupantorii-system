"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import { formatPrice } from "../../../lib/helpers";

export default function ProductsClient() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get("/api/admin/products");
      setProducts(response.data.data || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add Product</Link>
      </div>
      <div className="overflow-hidden rounded-3xl border border-mist bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-[0.3em] text-pine">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-mist">
                <td className="px-4 py-4 font-medium text-ink">{product.name}</td>
                <td className="px-4 py-4 text-pine">{product.category?.name}</td>
                <td className="px-4 py-4 text-rose">{formatPrice(product.basePrice)}</td>
                <td className="px-4 py-4 text-pine">{product.status}</td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-xs uppercase tracking-[0.2em] text-rose">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
