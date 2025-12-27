import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../lib/helpers";

export default function ProductCard({ product }) {
  const image = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="glass-card group flex h-full flex-col gap-4 rounded-3xl p-5">
      <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-mist">
        {image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${image.url}`}
            alt={image.alt || product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-pine">{product.category?.name}</p>
          <h3 className="text-xl text-ink">{product.name}</h3>
        </div>
        <p className="text-sm text-pine">{product.description.slice(0, 80)}...</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg text-rose">{formatPrice(product.basePrice)}</span>
          <Link href={`/products/${product.id}`} className="btn-outline">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
