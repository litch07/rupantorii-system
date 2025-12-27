"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginRoute) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginRoute, router]);

  if (isLoginRoute) {
    return children;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Checking access" />
      </div>
    );
  }

  return children;
}
