"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, PropsWithChildren } from "react";
import Cookies from "js-cookie";

export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    console.log("Access Token:", accessToken);

    // Rute yang diizinkan tanpa autentikasi
    const publicPaths = ["/auth/sign-in", "/auth/sign-up"];

    // Jika tidak ada accessToken dan bukan rute publik, arahkan ke login
    if (!accessToken && !publicPaths.includes(pathname)) {
      router.push("/auth/sign-in");
    }

    // Jika ada accessToken dan pengguna berada di rute login/register, arahkan ke dashboard
    if (accessToken && publicPaths.includes(pathname)) {
      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}