"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateAuthFromStorage } from "@/store/authSlice";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";

export default function RootWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isHydrating, setIsHydrating] = useState(false);

  //   Handle initial auth hydration
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        await dispatch(hydrateAuthFromStorage()).unwrap();
      } catch (error) {
        console.error("Failed to hydrate auth:", error);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateAuth();
  }, [dispatch]);

  //   Handle routing after hydration is complete
  useEffect(() => {
    if (!isHydrating) {
      const publicRoutes = ["/login", "/signup", "/forgot-password"];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
      } else if (isAuthenticated && isPublicRoute) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, isHydrating]);

  if (isHydrating) {
    return <CitySkylineLoading animated={true} />;
  }

  //   For public routes or authenticated users, show content
  return <>{children}</>;
}
