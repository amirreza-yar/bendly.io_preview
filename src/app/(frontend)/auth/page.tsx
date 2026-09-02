"use client";
import { Logo, Mail, PasswordField } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { UILayoutBackground } from "@/components/main";
import api from "@/lib/axios";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { PasswordInput } from "@/components/ui/custom-field";

const LoginFormSchema = z.object({
  password: z.string("Please enter your password."),
  email: z
    .string("Please enter your email address.")
    .trim()
    .email("Please enter a valid email address.")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
      "Please enter a valid email address.",
    ),
});

type LoginFormValue = z.infer<typeof LoginFormSchema>;

async function loginRequest(url: string, { arg }: { arg: LoginFormValue }) {
  const res = await api.post("/auth/login/", {
    email: arg.email.toLowerCase(),
    password: arg.password,
  });

  return res.data;
}

export default function LoginPage() {
  const loginForm = useForm<LoginFormValue>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation("/auth/login/", loginRequest);

  const onLogin = async (data: LoginFormValue) => {
    try {
      await trigger({ email: "demo@domain.co", password: "*123123Demo" });

      toast("Successfully signed in");
      router.replace("/dashboard");
    } catch (error: any) {
      const message: string =
        error.response?.data?.non_field_errors[0] ||
        error.response?.data ||
        "Something broke, probably not your fault.";

      if (message.startsWith("E-mail is not verified")) {
        router.push(`/auth/verify-email?email=${data.email}&from=login`);
      }

      // http://localhost:3000/auth/verify-email?email=demo2@domain.co

      toast(message);
    }
  };

  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        {/* <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
          Bendly
        </h6> */}

        <Image
          src="/images/logo-title.svg"
          height={0}
          width={0}
          alt="Bendly logo"
          className="absolute top-4 left-1/2 -translate-x-1/2 w-18 -ml-2"
        />

        {/* <Logo className="absolute text-primary-foreground top-4 left-4 size-5" /> */}

        <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 sm:top-24 text-primary-foreground text-center">
          <h2 className="overflow-hidden">Welcome Back!</h2>
          <p className="caption-small">Enter your credentials to Sign in</p>
        </div>
      </div>
      <div className="fixed top-45 sm:top-50 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-150 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg px-6 sm:px-8 py-8 sm:py-10 h-fit shadow-md space-y-4">
          <form onSubmit={loginForm.handleSubmit(onLogin)}>
            <FieldSet>
              <FieldGroup className="gap-6">
                <Controller
                  control={loginForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="email"
                          placeholder="demo@bendly.io"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <InputGroupAddon>
                          <Mail className="size-5" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />
                <Controller
                  control={loginForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <PasswordInput
                        {...field}
                        id={field.name}
                        placeholder="********"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <Button
                        size="xs"
                        className="w-fit! self-end pr-1"
                        variant="link"
                        type="button"
                        asChild
                      >
                        <Link href="/auth/reset-password">
                          Forgot Password?
                        </Link>
                      </Button>
                    </Field>
                  )}
                />
                <Button size="lg" className="mb-0" disabled={isMutating}>
                  {isMutating && <Spinner />}
                  View Demo
                </Button>
              </FieldGroup>
            </FieldSet>
            <div className="flex items-center w-full justify-center pt-5">
              <p className="text-xs">Don&apos;t have an account? </p>
              <Button variant="link" size="xs" type="button" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
