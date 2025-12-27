"use client";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { useCart } from "../../contexts/CartContext";

export default function CartPageClient() {
  const { items } = useCart();

  return (
    <section className="section-pad grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <h1 className="text-3xl text-ink">Your Cart</h1>
        {items.length === 0 ? (
          <p className="text-sm text-pine">Your cart is empty.</p>
        ) : (
          items.map((item) => <CartItem key={`${item.productId}-${item.variantId}`} item={item} />)
        )}
      </div>
      <CartSummary />
    </section>
  );
}
