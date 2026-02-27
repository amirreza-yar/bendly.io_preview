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

import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Logo } from "@/components/icons";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const router = useRouter();

  const email = use(searchParams).email;

  const resendRef = useRef<CodeResendTimeHandle>(null);

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
      <UILayout>
        <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
          Bendly
        </h6>

        <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />

        <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 text-primary-foreground text-center">
          <h5 className="overflow-hidden">Verification email sent.</h5>
          <p className="caption-small">We&apos;ve sent a link to your email</p>
        </div>

        <UILayoutContentWrapper>
          <UILayoutContent>
            <Field className="gap-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  disabled
                />
                <InputGroupAddon>
                  <Mail className="size-5" />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="flex flex-col pt-6">
              <CodeResendTime
                ref={resendRef}
                onResendHandler={handleResendEmailCode}
              />
            </div>

            <div className="flex items-center w-full justify-center pt-5">
              <p className="text-xs">Not your email?</p>
              <Link href="/auth/signup">
                <Button variant="link" size="xs" type="button">
                  Change email
                </Button>
              </Link>
            </div>
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>
      {/* <ContentWrapper className="flex flex-col gap-2 items-center items-center justify-center">
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

        <div className="flex gap-2 items-center justify-center pt-6">
          <span className="text-xs text-gray-600">
            Did not receive the email?
          </span>
          <CodeResendTime
            ref={resendRef}
            onResendHandler={handleResendEmailCode}
          />
        </div>
      </ContentWrapper> */}
    </>
  );
}
