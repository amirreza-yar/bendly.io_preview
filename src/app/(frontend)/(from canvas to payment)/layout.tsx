"use client";
import { setupAxiosInterceptor } from "@/lib/axios";
import React, { useEffect } from "react";

export default function MyComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // console.log("sw registered!");
          // console.log(reg);
        })
        .catch((error) => {
          // console.log("sw reg failed!");
          // console.log(error);
        });
      setupAxiosInterceptor();
    }
  }, []);

  return <>{children}</>;
}
