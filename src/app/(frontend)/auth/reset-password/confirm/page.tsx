"use client";
import Header from "@/components/main/header";
import { Logo, PasswordField } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";

const ResetPasswordConfirmFormSchema = z
  .object({
    new_password1: z
      .string("Please enter your password.")
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password must be at most 64 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character.",
      ),
    new_password2: z.string("Please confirm your password."),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords do not match",
    path: ["password2"], // attach the error to password2 field
  });
export type ResetPasswordConfirmFormValues = z.infer<
  typeof ResetPasswordConfirmFormSchema
>;

export default function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ uid: string; token: string }>;
}) {
  const { uid, token } = use(searchParams);
  const resetPasswordConfirmForm = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(ResetPasswordConfirmFormSchema),
    defaultValues: {},
  });

  const router = useRouter();

  const onResetPasswordConfirm = async (
    data: ResetPasswordConfirmFormValues,
  ) => {
    console.log(data);
    // try {
    //   await api.post("/auth/password/reset/confirm/", {
    //     new_password1: data.new_password1,
    //     new_password2: data.new_password2,
    //     uid: uid,
    //     token: token,
    //   });

    //   toast("Password reset successfull");
    //   router.replace("/auth");
    // } catch (error: any) {
    //   toast("Something went wrong!");
    // }
  };

  return (
    <UILayout>
      <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
        Bendly
      </h6>

      <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />

      <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 text-primary-foreground text-center">
        <h5 className="overflow-hidden">Reset Your Password</h5>
        <p className="caption-small">
          Please enter a new password for your account
        </p>
      </div>
      <UILayoutContentWrapper>
        <UILayoutContent>
          <form
            onSubmit={resetPasswordConfirmForm.handleSubmit(
              onResetPasswordConfirm,
            )}
          >
            <FieldSet>
              <FieldGroup className="gap-6">
                <Controller
                  control={resetPasswordConfirmForm.control}
                  name="new_password1"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="password"
                          placeholder="********"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <InputGroupAddon>
                          <PasswordField className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <EyeOffIcon />
                        </InputGroupAddon>
                      </InputGroup>

                      <FieldDescription>
                        <Info className="size-2" />
                        Use 8+ characters with letters, numbers, and symbols
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  control={resetPasswordConfirmForm.control}
                  name="new_password2"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Password Confirmation
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="password"
                          placeholder="********"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <InputGroupAddon>
                          <PasswordField className="size-5" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <EyeOffIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />
                <Button size="lg" className="mb-0">
                  Reset Password
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
