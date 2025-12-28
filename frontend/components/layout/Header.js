"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useCustomerAuth();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="section-pad py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin/dashboard" className="font-display text-2xl tracking-[0.12em] text-ink">
            Rupantorii Admin
          </Link>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-pine">
            <Link href="/" className="hover:text-rose">Storefront</Link>
          </nav>
        </div>
      </header>
    );
  }

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
          <Link href={isAuthenticated ? "/account" : "/account/login"} className="hover:text-rose">
            {isAuthenticated ? `Account (${user?.name || "Active"})` : "Account"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

