"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AccountGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useCustomerAuth();

  const isAuthRoute = pathname === "/account/login" || pathname === "/account/register";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isAuthRoute) {
      router.replace("/account/login");
    }
  }, [loading, isAuthenticated, isAuthRoute, router]);

  if (isAuthRoute) {
    return children;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Checking account" />
      </div>
    );
  }

  return children;
}
