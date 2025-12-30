"use client";
import { Button } from "@/components/uikit/buttons/button";
import { LabeledInput } from "@/components/uikit/input";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/uikit/form";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  ArrowLeft,
  Mail,
  MainLogo,
  PasswordField,
} from "@/components/uikit/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";

// Validation schema
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
        "Password must contain at least one special character."
      ),
    new_password2: z.string("Please confirm your password."),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords do not match",
    path: ["password2"], // attach the error to password2 field
  });

type ResetPasswordConfirmFormValues = z.infer<
  typeof ResetPasswordConfirmFormSchema
>;

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ uid: string; token: string }>;
}) {
  const { uid, token } = use(searchParams);

  const router = useRouter();

  const resetPasswordConfirmForm = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(ResetPasswordConfirmFormSchema),
  });

  const onSubmit = async (data: ResetPasswordConfirmFormValues) => {
    try {
      await api.post("/auth/password/reset/confirm/", {
        new_password1: data.new_password1,
        new_password2: data.new_password2,
        uid: uid,
        token: token,
      });

      toast("Password reset successfull");
      router.replace("/auth");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <ContentWrapper className="flex flex-col gap-2 items-center items-center justify-center">
        <div className="absolute flex items-center gap-2 mx-auto top-6 text-[16px] font-semibold z-10">
          <MainLogo className="size-6 text-black" />
          Bendly.io
        </div>
        <Link href="/auth" className="absolute top-5 left-5 p-1">
          <ArrowLeft />
        </Link>

        <h5>Password Reset Confirm</h5>
        <p className="text-[13px] pb-6 max-w-100 text-center">
          Enter your new password
        </p>

        <Form {...resetPasswordConfirmForm}>
          <form
            className="w-full max-w-80 flex flex-col gap-6"
            onSubmit={resetPasswordConfirmForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={resetPasswordConfirmForm.control}
              name="new_password1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="New Password"
                      icon={PasswordField}
                      placeholder="Your Password"
                      type="password"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>
                    Use 8+ characters with letters, numbers, and symbols
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={resetPasswordConfirmForm.control}
              name="new_password2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      icon={PasswordField}
                      label="New Password Confirm"
                      placeholder="Your Password Confirmation"
                      type="password"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage>Password confirmation</FormMessage>
                </FormItem>
              )}
            />
            <Button className="w-full">Reset Password</Button>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
}
