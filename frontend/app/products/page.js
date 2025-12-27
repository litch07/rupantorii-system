import ProductFilter from "../../components/products/ProductFilter";
import ProductGrid from "../../components/products/ProductGrid";
import { getServerApiUrl } from "../../lib/helpers";

export const metadata = {
  title: "Collections | Rupantorii",
  description: "Browse Rupantorii jewelry collections by category, style, and heritage."
};

async function getCategories() {
  const apiUrl = getServerApiUrl();
  const res = await fetch(`${apiUrl}/api/categories`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

async function getProducts(searchParams) {
  const apiUrl = getServerApiUrl();
  const params = new URLSearchParams();

  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.category) params.set("category", searchParams.category);
  if (searchParams?.page) params.set("page", searchParams.page);

  const res = await fetch(`${apiUrl}/api/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    return { data: [], total: 0 };
  }
  return res.json();
}

export default async function ProductsPage({ searchParams }) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchParams)
  ]);

  return (
    <section className="section-pad space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-pine">Collections</p>
        <h1 className="text-3xl text-ink">Discover Rupantorii Jewelry</h1>
      </div>
      <ProductFilter categories={categories} />
      <ProductGrid products={products.data || []} />
    </section>
  );
}
