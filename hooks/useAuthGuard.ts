import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authstore";

export function useAuthGuard({ requireAuth = false } = {}) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // Skip in dev
    if (process.env.NODE_ENV !== "production") return;

    if (requireAuth && !accessToken) {
      router.replace("/login");
    }

    if (!requireAuth && accessToken) {
      router.replace("/tasks");
    }
  }, [accessToken, requireAuth, router]);
}
