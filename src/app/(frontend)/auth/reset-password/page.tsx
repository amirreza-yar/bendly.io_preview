"use client";
import Header from "@/components/main/header";
import { Logo, Mail } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
  UILayoutHeader,
} from "@/components/main";
import { toast } from "sonner";

const ResetPasswordFormSchema = z.object({
  email: z
    .string("Please enter your email address.")
    .trim()
    .email("Please enter a valid email address.")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
      "Please enter a valid email address.",
    ),
});

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {},
  });

  const router = useRouter();

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      await api.post("/auth/password/reset/", {
        email: data.email,
      });
      toast("Email sent");
      //   router.replace("/dashboard/account/");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <UILayout>
      <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
        Bendly
      </h6>

      <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />

      <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 text-primary-foreground text-center">
        <h5 className="overflow-hidden">Forgot your password?</h5>
        <p className="caption-small">We will send a link to your email</p>
      </div>

      <UILayoutContentWrapper>
        <UILayoutContent>
          <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}>
            <FieldSet>
              <FieldGroup className="gap-6">
                <Controller
                  control={resetPasswordForm.control}
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
                <Button size="lg" className="mb-0">
                  Send Reset Link
                </Button>
              </FieldGroup>
            </FieldSet>
            <div className="flex items-center w-full justify-center pt-5">
              <p className="text-xs">Remembered your password?</p>
              <Link href="/auth">
                <Button variant="link" size="xs" type="button">
                  Back to Log in
                </Button>
              </Link>
            </div>
          </form>
        </UILayoutContent>
      </UILayoutContentWrapper>
    </UILayout>
  );
}
