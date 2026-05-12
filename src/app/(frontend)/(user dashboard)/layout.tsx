"use client";
import { setupAxiosInterceptor } from "@/lib/axios";
import { useEffect } from "react";

export default function DashboardMainRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupAxiosInterceptor();
  }, []);
  return <>{children}</>;
}
