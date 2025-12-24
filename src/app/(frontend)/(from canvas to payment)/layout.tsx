"use client";
import { setupAxiosInterceptor } from "@/lib/axios";
import React, { useEffect } from "react";

export default function MyComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupAxiosInterceptor();
  }, []);

  return <>{children}</>;
}
