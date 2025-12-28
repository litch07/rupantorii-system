"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
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
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="w-28 rounded-full border border-mist bg-white/80 px-4 py-3 text-sm text-ink outline-none focus:border-rose"
          placeholder="Min price"
          inputMode="numeric"
          aria-label="Minimum price"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <input
          className="w-28 rounded-full border border-mist bg-white/80 px-4 py-3 text-sm text-ink outline-none focus:border-rose"
          placeholder="Max price"
          inputMode="numeric"
          aria-label="Maximum price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>
      <select
        className="rounded-full border border-mist bg-white/80 px-5 py-3 text-sm text-ink outline-none focus:border-rose"
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        aria-label="Sort products"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="top_rated">Top Rated</option>
      </select>
      <button type="submit" className="btn-primary">Filter</button>
    </form>
  );
}

