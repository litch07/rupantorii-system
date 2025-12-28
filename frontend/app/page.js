import Link from "next/link";
import ProductGrid from "../components/products/ProductGrid";
import HeroActions from "../components/home/HeroActions";
import { getServerApiUrl } from "../lib/helpers";

export const metadata = {
  title: "Rupantorii | Bengali Jewelry & Lifestyle",
  description: "Explore handcrafted Bengali jewelry collections and modern heirlooms from Rupantorii."
};

async function getFeaturedProducts() {
  const apiUrl = getServerApiUrl();
  const res = await fetch(`${apiUrl}/api/products?limit=6`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.data || [];
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-16">
      <section className="section-pad">
        <div className="glass-card relative overflow-hidden rounded-[48px] px-8 py-16 md:px-16">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.5em] text-pine">Rupantorii Atelier</p>
              <h1 className="text-4xl md:text-5xl text-ink">
                Modern Bengali heirlooms for rituals, reunions, and every day.
              </h1>
              <p className="max-w-xl text-sm text-pine">
                Explore handcrafted jewelry inspired by Bengali heritage. Shop curated collections with
                variants, artisan details, and low-stock alerts for limited pieces.
              </p>
              <HeroActions />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Artisan finish", "Warm rose gold", "Limited batches", "Local-first"].map((tag) => (
                <div key={tag} className="rounded-3xl border border-mist bg-white/70 p-6 text-sm text-pine">
                  <p className="text-lg text-ink">{tag}</p>
                  <p className="mt-2">Designed for slow fashion and everyday elegance.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl text-ink">Featured pieces</h2>
          <Link href="/products" className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose">
            View All
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}

