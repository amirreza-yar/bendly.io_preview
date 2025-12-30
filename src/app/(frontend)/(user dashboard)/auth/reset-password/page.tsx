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
import { ArrowLeft, Mail, MainLogo } from "@/components/uikit/icons";
import Link from "next/link";

// Validation schema
const ResetPasswordFormSchema = z.object({
  email: z
    .string("Please enter your email address.")
    .trim()
    .email("Please enter a valid email address.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i),
});

type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
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
    <>
      <ContentWrapper className="flex flex-col gap-2 items-center items-center justify-center">
        <div className="absolute flex items-center gap-2 mx-auto top-6 text-[16px] font-semibold z-10">
          <MainLogo className="size-6 text-black" />
          Bendly.io
        </div>
        <Link href="/auth" className="absolute top-5 left-5 p-1">
          <ArrowLeft />
        </Link>

        <h5>Forgot your passowrd?</h5>
        <p className="text-[13px] pb-6 max-w-100 text-center">
          We will send a link to your email
        </p>

        <Form {...resetPasswordForm}>
          <form
            className="w-full max-w-80 flex flex-col gap-6"
            onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={resetPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Email"
                      icon={Mail}
                      placeholder="Your Email"
                      type="text"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Send Email</Button>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
}
