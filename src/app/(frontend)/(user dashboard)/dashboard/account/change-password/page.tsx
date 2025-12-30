"use client";
import { Button } from "@/components/uikit/buttons/button";
import { LabeledInput } from "@/components/uikit/input";
import { Header } from "@/components/dashboard/header";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/uikit/form";
import { toast } from "sonner";
import api from "@/lib/axios";
import { PasswordField } from "@/components/uikit/icons";
import { useRouter } from "next/navigation";

// Validation schema
const ChangePasswordFormSchema = z
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
    path: ["new_password2"], // attach the error to password2 field
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();

  const ChangePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await api.post("/auth/password/change/", {
        new_password1: data.new_password1,
        new_password2: data.new_password2,
      });

      toast("Password changed Updated");
      router.replace("/dashboard/account/");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <Header title="Change Password" returnHref="/dashboard/account" />
      <ContentWrapper className="pt-18">
        {/* Give form an ID so Footer button can reference it */}
        <Form {...ChangePasswordForm}>
          <form
            id="edit-name-form"
            className="grid gap-6"
            onSubmit={ChangePasswordForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={ChangePasswordForm.control}
              name="new_password1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 label-regular">
                    New Password
                    <span className="text-[#E50000]">*</span>
                  </FormLabel>
                  <FormControl>
                    <LabeledInput
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
              control={ChangePasswordForm.control}
              name="new_password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 label-regular">
                    New Password Confirmation
                    <span className="text-[#E50000]">*</span>
                  </FormLabel>
                  <FormControl>
                    <LabeledInput
                      icon={PasswordField}
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
          </form>
        </Form>
      </ContentWrapper>
      <Footer>
        <Button
          type="submit"
          form="edit-name-form"
          className="w-full bg-primary md:max-w-[700px]"
        >
          Change Password
        </Button>
      </Footer>
    </>
  );
}
