"use client";

import { useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../lib/helpers";
import VariantSelector from "./VariantSelector";

export default function ProductDetailsClient({ product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant?.price ?? product.basePrice;
  const variantLabel = useMemo(() => {
    if (!selectedVariant) return null;
    return [selectedVariant.size, selectedVariant.color, selectedVariant.material]
      .filter(Boolean)
      .join(" · ");
  }, [selectedVariant]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      variantLabel,
      price,
      quantity,
      image: product.primaryImage
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-pine">{product.category?.name}</p>
        <h1 className="text-3xl text-ink">{product.name}</h1>
        <p className="mt-3 text-sm text-pine">{product.description}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-2xl text-rose">{formatPrice(price)}</span>
        {selectedVariant ? (
          <span className="text-xs uppercase tracking-[0.3em] text-pine">
            Stock: {selectedVariant.stock}
          </span>
        ) : null}
      </div>

      <VariantSelector
        variants={product.variants}
        selectedId={selectedVariant?.id}
        onChange={setSelectedVariant}
      />

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="w-20 rounded-full border border-mist bg-white/80 px-4 py-3 text-center text-sm"
        />
        <button className="btn-primary" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
