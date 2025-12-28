"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

const links = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" }
];

export default function AccountShell({ children }) {
  const pathname = usePathname();
  const { isAuthenticated } = useCustomerAuth();
  const isAuthRoute = pathname === "/account/login" || pathname === "/account/register";

  if (isAuthRoute || !isAuthenticated) {
    return children;
  }

  return (
    <section className="section-pad space-y-6 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-pine">Account</p>
        <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-pine">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname?.startsWith(link.href) ? "text-rose" : "hover:text-rose"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}
