"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, PropsWithChildren } from "react";

export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !["/auth/sign-in", "/auth/sign-up"].includes(pathname)) {
      router.push("/auth/sign-in");
    }

    if (accessToken && pathname === "/auth/sign-in") {
      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
