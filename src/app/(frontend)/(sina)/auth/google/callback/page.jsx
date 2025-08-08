"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleGoogleCallback } from "@/app/(frontend)/sina/login/actions";

const GoogleCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleGoogleCallback(code).then((result) => {
        if (result.success) {
          router.push("/");
        } else {
          // Handle error, maybe redirect to login page with an error message
          router.push("/sina/login?error=google-login-failed");
        }
      });
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div>Loading...</div>
    </div>
  );
};

export default GoogleCallbackPage; 