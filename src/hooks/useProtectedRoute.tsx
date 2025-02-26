"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  function AuthComponent(props: P) {
    const router = useRouter();
    const isAuthenticated = useAppSelector(
      (state) => !!state?.auth?.user?.access
    );

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  }

  AuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthComponent;
}
