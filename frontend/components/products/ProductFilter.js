"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center">
      <input
        className="flex-1 rounded-full border border-mist bg-white/80 px-5 py-3 text-sm text-ink outline-none focus:border-rose"
        placeholder="Search jewelry, materials, collections..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select
        className="rounded-full border border-mist bg-white/80 px-5 py-3 text-sm text-ink outline-none focus:border-rose"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-primary">Filter</button>
    </form>
  );
}
