"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderWithCenterTitle } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { toast } from "sonner";
import {
  CreateAccountForm,
  CreateAccountFormValues,
  LoginForm,
  LoginFormValue,
} from "@/components/dashboard/auth/forms";
import api from "@/lib/axios";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { MainLogo } from "@/components/uikit/icons";

const AuthPage = () => {
  const router = useRouter();

  const [tabValue, setTabValue] = useState("login-tab");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitLogin = async (data: LoginFormValue) => {
    try {
      setIsLoading(true);

      await api.post("/auth/login/", {
        email: data.email.toLowerCase(),
        password: data.password,
      });

      toast("Welcome!");
      setIsLoading(false);
      router.replace("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error.response?.data?.non_field_errors[0] ||
        error.response?.data ||
        "Something broke, probably not your fault.";

      toast(message);
    }
  };

  const onCreateAccountSubmit = async (data: CreateAccountFormValues) => {
    const parts = data.fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    try {
      setIsLoading(true);
      await api.post("/auth/registration/", {
        email: data.email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        password1: data.password1,
        password2: data.password2,
        phone: `+61${data.phone}`,
      });

      toast("Verification email sent ");
      setIsLoading(false);
      router.replace(`/auth/verify-email?email=${data.email}`);
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error.response.data.email[0] ||
        error.response?.data ||
        "Something broke, probably not your fault.";

      toast(message);
    }
  };

  return (
    <>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="absolute flex items-center gap-2 mx-auto left-1/2 -translate-x-1/2 top-6 text-[16px] font-semibold z-10">
          <MainLogo className="size-6 text-black" />
          Bendly.io
        </div>
        <TabsContent value="login-tab">
          <ContentWrapper className="pt-30 md:pt-0 md:flex items-center">
            <div className="flex flex-col max-w-[450px] mx-auto h-fit grow">
              <div className="flex flex-col gap-6">
                <div className="grid items-center text-center gap-2">
                  <h5>Welcome back!</h5>
                  <p className="subtitle-regular">
                    Enter you credentials to login
                  </p>
                </div>
                {/* <Button
                  className="w-full border-border-default text-body mt-2 opacity-40"
                  variant="secondary"
                  disabled
                >
                  <GoogleIcon className="size-5" />
                  Continue with google
                </Button>

                <DividerWithText text="OR" /> */}

                <LoginForm
                  onSubmitLogin={onSubmitLogin}
                  errorText=""
                  isLoading={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <p className="subtitle-regular">{"Don't have an account?"}</p>
                <button
                  onClick={() => setTabValue("signup-tab")}
                  className="text-primary label-regular cursor-pointer"
                >
                  Signup
                </button>
              </div>

              {/* <AuthEmailForm onSubmitEmail={onSubmitEmail} defaultEmail={defaultEmail} /> */}
            </div>
          </ContentWrapper>
        </TabsContent>
        <TabsContent value="signup-tab">
          <ContentWrapper className="pt-30 md:pt-10 md:flex items-center">
            <div className="flex flex-col max-w-[450px] mx-auto h-fit grow">
              <div className="flex flex-col gap-6">
                <div className="grid items-center text-center gap-2">
                  <h5>Welcome to Bendly!</h5>
                  <p className="subtitle-regular">
                    Enter you details to signup
                  </p>
                </div>
                {/* <Button
                  className="w-full border-border-default text-body mt-2 opacity-40"
                  variant="secondary"
                  disabled
                >
                  <GoogleIcon className="size-5" />
                  Continue with google
                </Button>

                <DividerWithText text="OR" /> */}

                <CreateAccountForm
                  onCreateAccountSubmit={onCreateAccountSubmit}
                  isLoading={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <p className="subtitle-regular">Already have an account?</p>
                <button
                  onClick={() => setTabValue("login-tab")}
                  className="text-primary label-regular cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          </ContentWrapper>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AuthPage;
