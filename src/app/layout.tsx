"use client";

import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { AuthGuard } from "@/components/AuthGuard";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const hideSidebarAndHeader = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <AuthGuard>
            <div className="flex min-h-screen">
              {!hideSidebarAndHeader && <Sidebar />}
              <div
                className={cn(
                  "w-full bg-gray-2 dark:bg-[#020d1a]",
                  hideSidebarAndHeader && "flex-1"
                )}
              >
                {!hideSidebarAndHeader && <Header />}
                <main className={cn("isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10", hideSidebarAndHeader && "flex-1"
                )}>
                  {children}
                </main>
              </div>
            </div>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}