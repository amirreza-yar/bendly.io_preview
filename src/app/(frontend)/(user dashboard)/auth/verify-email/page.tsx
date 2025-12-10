"use client";

import { HeaderWithCenterTitle } from "@/components/dashboard/header";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import Link from "next/link";
import { Edit } from "@/components/uikit/icons";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  VerifyEmailOTPForm,
  VerifyEmailOTPValue,
} from "@/components/dashboard/auth/forms";
import {
  CodeResendTime,
  CodeResendTimeHandle,
} from "@/components/dashboard/auth/resendTime";
import api from "@/lib/axios";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const router = useRouter();

  const email = use(searchParams).email;

  // useEffect(() => {
  //   if (!email) {
  //     router.replace("/auth");
  //   }
  // }, [email, router]);

  const [isLoading, setIsLoading] = useState(false);

  const resendRef = useRef<CodeResendTimeHandle>(null);
  const [invalidCodeErrorText, setInvalidCodeErrorText] = useState<string>("");

  const onSubmitVerifyEmail = async (data: VerifyEmailOTPValue) => {
    try {
      setIsLoading(true);
      await api.post("/auth/registration/verify-email/", {
        key: data.emailOTP,
      });

      toast("Your email verified");
      setIsLoading(false);
      router.replace("/dashboard");
    } catch (error: any) {
      setIsLoading(false);

      setInvalidCodeErrorText("Invalid OTP. Please try again.");
    }
  };

  const handleResendEmailCode = async () => {
    try {
      await api.post("/auth/registration/resend-email/", {
        email: email,
      });

      toast("Verification email resent");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <HeaderWithCenterTitle title="Logo" returnHref={`/auth`} />
      <ContentWrapper className="pt-26">
        <div className="grid gap-6 items-center">
          <div className="grid items-center text-center gap-2">
            <h5>Verify your email</h5>
            <p className="subtitle-regular">We sent a 6-digit code to:</p>
            <Link
              href={`/auth`}
              className="flex gap-2 items-center rounded-full border border-border-default bg-surface-disable w-fit justify-self-center py-2 px-4 text-[16px]/[24px] font-regular"
            >
              {email}
              <Edit className="size-5" />
            </Link>
          </div>

          <VerifyEmailOTPForm
            onSubmitVerifyEmail={onSubmitVerifyEmail}
            errorText={invalidCodeErrorText}
            isLoading={isLoading}
          />

          <div className="flex gap-2 items-center justify-center">
            <span className="text-xs text-gray-600">
              Did not receive the code?
            </span>
            <CodeResendTime
              ref={resendRef}
              onResendHandler={handleResendEmailCode}
            />
          </div>
        </div>
      </ContentWrapper>
    </>
  );
}
