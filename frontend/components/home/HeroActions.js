"use client";

import Link from "next/link";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

export default function HeroActions() {
  const { isAuthenticated } = useCustomerAuth();

  return (
    <div className="flex flex-wrap gap-4">
      <Link href="/products" className="btn-primary">Explore Collections</Link>
      {isAuthenticated ? null : (
        <Link href="/account/login" className="btn-outline">Customer Login</Link>
      )}
    </div>
  );
}
