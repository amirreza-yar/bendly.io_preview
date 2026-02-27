"use client";
import BottomNav from "@/components/dashboard/bottom-nav";
import { ArrowLeft, Info } from "@/components/icons";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/custom-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import z from "zod";

const ChangePasswordFormSchema = z
  .object({
    old_password: z.string("Please enter your old password"),
    new_password1: z
      .string("Please enter your new password.")
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
    path: ["new_password2"],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

async function changePassowrdReq(
  url: string,
  { arg }: { arg: ChangePasswordFormValues },
) {
  const res = await api.post("/auth/password/change/", {
    old_password: arg.old_password,
    new_password1: arg.new_password1,
    new_password2: arg.new_password2,
  });

  return res.data;
}

export default function AccountSettingsPage() {
  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "/a/profile/",
    changePassowrdReq,
  );

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    try {
      await trigger(data);
      toast("Password changed");
      router.replace("/dashboard/setting/account/");
    } catch (error: any) {
      if (error.response.data.old_password) {
        changePasswordForm.setError("old_password", {
          message: "Your password is incorrect",
        });
      } else toast("Something went wrong!");
    }
  };

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed left-1 top-1 flex items-center gap-2 text-primary-foreground">
          <Button
            variant="ghost"
            size="icon-lg"
            className="hover:bg-transparent hover:text-primary-light"
            asChild
          >
            <Link href="/dashboard/setting">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h6>Change Password</h6>
        </div>
        <UILayoutContentWrapper className="fixed top-0 mt-15 pb-20">
          <UILayoutContent className="px-0 py-4">
            <form
              className="w-full max-h-[calc(100vh-175px)] overflow-y-auto px-4"
              onSubmit={changePasswordForm.handleSubmit(onChangePassword)}
            >
              <div className="text-center pt-4 px-2 pb-6">
                <h5>Change your password</h5>
                <p className="caption-small">
                  Enter a new password for your account
                </p>
              </div>
              <FieldSet>
                <FieldGroup className="gap-6">
                  <Controller
                    control={changePasswordForm.control}
                    name="old_password"
                    render={({ field, fieldState }) => (
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="password" className="pb-2">
                          Current Password
                        </FieldLabel>
                        <PasswordInput
                          placeholder="********"
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {!fieldState.invalid && (
                          <FieldDescription>
                            <Info className="size-3" />
                            Your current password
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={changePasswordForm.control}
                    name="new_password1"
                    render={({ field, fieldState }) => (
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="password" className="pb-2">
                          New Password
                        </FieldLabel>
                        <PasswordInput
                          placeholder="********"
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {!fieldState.invalid && (
                          <FieldDescription>
                            <Info className="size-3" />
                            Use 8+ characters with letters, numbers, and symbols
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={changePasswordForm.control}
                    name="new_password2"
                    render={({ field, fieldState }) => (
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="password" className="pb-2">
                          Confirm New Password
                        </FieldLabel>
                        <PasswordInput
                          placeholder="********"
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {!fieldState.invalid && (
                          <FieldDescription>
                            <Info className="size-3" />
                            Password confirmation must match the new password
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Button type="submit" size="lg" disabled={isMutating}>
                    {isMutating && <Spinner />}
                    Change Password
                  </Button>
                </FieldGroup>
              </FieldSet>
            </form>
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>
      <BottomNav />
    </>
  );
}
