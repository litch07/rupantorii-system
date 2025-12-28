"use client";

import Image from "next/image";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../lib/helpers";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 1) {
      updateQuantity(item.productId, item.variantId, value);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-mist bg-white/80 p-5 md:flex-row md:items-center">
      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-mist">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1">
        <h3 className="text-lg text-ink">{item.name}</h3>
        <p className="text-xs uppercase tracking-[0.3em] text-pine">{item.variantLabel || "Standard"}</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 rounded-full border border-mist bg-white/80 px-3 py-2 text-center text-sm"
        />
        <span className="text-sm text-rose">{formatPrice(Number(item.price) * item.quantity)}</span>
        <button
          type="button"
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-xs uppercase tracking-[0.2em] text-pine hover:text-rose"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

