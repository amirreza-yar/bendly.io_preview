"use client";

import { HeaderWithCenterTitle } from "@/components/dashboard/header";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  FeaturedSuccess,
  Mail,
  MainLogo,
} from "@/components/uikit/icons";
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
import { Button } from "@/components/uikit/buttons/button";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const router = useRouter();

  const email = use(searchParams).email;

  useEffect(() => {
    if (!email) {
      router.replace("/auth");
    }
  }, [email, router]);

  // const [isLoading, setIsLoading] = useState(false);

  const resendRef = useRef<CodeResendTimeHandle>(null);
  // const [invalidCodeErrorText, setInvalidCodeErrorText] = useState<string>("");

  // const onSubmitVerifyEmail = async (data: VerifyEmailOTPValue) => {
  //   try {
  //     setIsLoading(true);
  //     await api.post("/auth/registration/verify-email/", {
  //       key: data.emailOTP,
  //     });

  //     toast("Your email verified");
  //     setIsLoading(false);
  //     router.replace("/dashboard");
  //   } catch (error: any) {
  //     setIsLoading(false);

  //     setInvalidCodeErrorText("Invalid OTP. Please try again.");
  //   }
  // };

  const handleResendEmailCode = async () => {
    try {
      await api.post("/auth/registration/resend-email/", {
        email: email,
      });

      resendRef.current?.resetTimer();

      toast("Verification email resent");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <>
      {/* <HeaderWithCenterTitle
        title=""
        returnHref={`/auth`}
        className="pt-4 pl-8"
      /> */}
      <ContentWrapper className="flex flex-col gap-2 items-center items-center justify-center">
        <div className="absolute flex items-center gap-2 mx-auto top-6 text-[16px] font-semibold z-10">
          <MainLogo className="size-6 text-black" />
          Bendly.io
        </div>
        <Link href="/auth" className="absolute top-5 left-5 p-1">
          <ArrowLeft />
        </Link>

        <FeaturedSuccess className="size-10 mb-4" />
        <h5>Verification email sent</h5>
        <p className="subtitle-regular pt-4">We sent a verification link to:</p>
        <div className="flex gap-2 items-center rounded-full border border-border-default bg-surface-disable w-fit justify-self-center py-2 px-4 text-[14px] font-regular">
          <Mail className="size-4" />
          {email}
        </div>

        {/* <VerifyEmailOTPForm
            onSubmitVerifyEmail={onSubmitVerifyEmail}
            errorText={invalidCodeErrorText}
            isLoading={isLoading}
          /> */}

        {/* <Button className="w-50 mt-6">Resend Email</Button> */}

        <div className="flex gap-2 items-center justify-center pt-6">
          <span className="text-xs text-gray-600">
            Did not receive the email?
          </span>
          <CodeResendTime
            ref={resendRef}
            onResendHandler={handleResendEmailCode}
          />
        </div>
      </ContentWrapper>
    </>
  );
}
