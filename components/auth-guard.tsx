"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    // When user navigates with browser Back/Forward (pageshow), check if session was invalidated
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache, force reload to let server re-verify session cookie
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  return null;
}
