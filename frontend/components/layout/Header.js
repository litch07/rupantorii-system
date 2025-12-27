"use client";

import Link from "next/link";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="section-pad py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="font-display text-3xl tracking-[0.15em] text-ink">
          Rupantorii
        </Link>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.3em] text-pine">
          <Link href="/products" className="hover:text-rose">Collections</Link>
          <Link href="/cart" className="hover:text-rose">
            Cart ({totalItems})
          </Link>
          <Link href="/admin/login" className="hover:text-rose">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
