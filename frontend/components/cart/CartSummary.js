"use client";

import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from "../../lib/helpers";

export default function CartSummary() {
  const { subtotal, totalItems } = useCart();

  return (
    <div className="glass-card rounded-3xl p-6">
      <h3 className="text-xl text-ink">Order Summary</h3>
      <div className="mt-4 space-y-2 text-sm text-pine">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-rose">{formatPrice(subtotal)}</span>
        </div>
      </div>
      <Link href="/checkout" className="btn-primary mt-6 w-full">
        Proceed to Checkout
      </Link>
    </div>
  );
}
