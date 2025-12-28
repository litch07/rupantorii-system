import Image from "next/image";
import ProductDetailsClient from "../../../components/products/ProductDetailsClient";
import { getServerApiUrl } from "../../../lib/helpers";

async function getProduct(id) {
  const apiUrl = getServerApiUrl();
  const res = await fetch(`${apiUrl}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product | Rupantorii",
      description: "Discover Rupantorii jewelry crafted for modern Bengali rituals."
    };
  }

  return {
    title: `${product.name} | Rupantorii`,
    description: product.description?.slice(0, 150) || "Rupantorii jewelry crafted for modern rituals."
  };
}

export default async function ProductDetailsPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="section-pad py-20 text-center text-sm text-pine">
        Product not found.
      </div>
    );
  }

  const image = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const apiUrl = getServerApiUrl();
  const imageUrl = image ? `${apiUrl}${image.url}` : null;

  const productData = {
    ...product,
    primaryImage: imageUrl
  };

  return (
    <section className="section-pad grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-card relative min-h-[360px] overflow-hidden rounded-[40px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alt || product.name}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <ProductDetailsClient product={productData} />
    </section>
  );
}
