"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/uikit/form";
import { Button } from "@/components/uikit/buttons/button";
import { Mail, PasswordField, ProfileNav } from "@/components/uikit/icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/uikit/inputOTP";
import z from "zod";
import { LabeledInput, LabeledInputWithCode } from "@/components/uikit/input";
import { useEffect } from "react";
import { Checkbox } from "@/components/uikit/checkbox";
import Link from "next/link";
import { Loader } from "lucide-react";

const VerifyEmailOTPSchema = z.object({
  emailOTP: z.string().min(6, {
    message: "Please enter the code",
  }),
});

export type VerifyEmailOTPValue = z.infer<typeof VerifyEmailOTPSchema>;

export const VerifyEmailOTPForm = ({
  onSubmitVerifyEmail,
  errorText,
  isLoading = false,
}: {
  onSubmitVerifyEmail: (data: VerifyEmailOTPValue) => void;
  errorText?: string;
  isLoading?: boolean;
}) => {
  const form = useForm<VerifyEmailOTPValue>({
    resolver: zodResolver(VerifyEmailOTPSchema),
  });

  useEffect(() => {
    if (errorText) {
      form.setError("emailOTP", { type: "manual", message: errorText });
    }
  }, [errorText, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitVerifyEmail)}
        className="grid gap-6 pt-2 justify-center"
      >
        <FormField
          control={form.control}
          name="emailOTP"
          render={({ field }) => (
            <div className="flex items-center justify-center">
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-fit flex justify-center">
                      <InputOTPSlot className="border-border-dark" index={0} />
                      <InputOTPSlot className="border-border-dark" index={1} />
                      <InputOTPSlot className="border-border-dark" index={2} />
                      <InputOTPSlot className="border-border-dark" index={3} />
                      <InputOTPSlot className="border-border-dark" index={4} />
                      <InputOTPSlot className="border-border-dark" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <Button type="submit" className="w-full max-w-82" disabled={isLoading}>
          {isLoading && <Loader className="animate-spin" />}
          Verify
        </Button>
      </form>
    </Form>
  );
};

const EmailInputSchema = z.object({
  email: z
    .string("Please enter a valid email address.")
    .trim()
    .email("Please enter a valid email address."),
});

export type EmailInputValue = z.infer<typeof EmailInputSchema>;

export const AuthEmailForm = ({
  onSubmitEmail,
  defaultEmail,
  isLoading = false,
}: {
  onSubmitEmail: (data: EmailInputValue) => void;
  defaultEmail: string | null | undefined;
  isLoading?: boolean;
}) => {
  const form = useForm<EmailInputValue>({
    resolver: zodResolver(EmailInputSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  // const mutation = useMutation({
  //   mutationFn: async (data: EmailInputValue) => {
  //     const res = await fetch('/api/auth', {
  //       method: 'POST',
  //       body: JSON.stringify({ email: data.email }),
  //       headers: { 'Content-Type': 'application/json' },
  //     })

  //     if (!res.ok) {
  //       throw new Error('Failed to send email')
  //     }
  //     return res.json()
  //   },
  //   onSuccess: (_, variables) => {
  //     toast(`Code sent to ${variables.email}`)
  //   },
  //   onError: (err: any) => {
  //     toast(err.message || 'Something went wrong')
  //   },
  // })

  return (
    <Form {...form}>
      {/* <form
        onSubmit={form.handleSubmit((data: EmailInputValue) => {
          mutation.mutate(data)
        })}
        className="grid gap-6"
      > */}
      <form onSubmit={form.handleSubmit(onSubmitEmail)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <LabeledInput
                  icon={Mail}
                  placeholder="Enter your email"
                  {...field}
                  value={field.value ?? ""}
                  error={Boolean(form.getFieldState("email").error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Countinue'}
        </Button> */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader className="animate-spin" />}
          Countinue
        </Button>
      </form>
    </Form>
  );
};

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

export type LoginFormValue = z.infer<typeof LoginFormSchema>;

export const LoginForm = ({
  onSubmitLogin,
  errorText,
  isLoading = false,
}: {
  onSubmitLogin: (data: LoginFormValue) => void;
  errorText: string;
  isLoading?: boolean;
}) => {
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (errorText) {
      form.setError("password", {
        type: "data_not_verified",
        message: errorText,
      });
    }
  }, [errorText, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitLogin)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">Email</FormLabel>
              <FormControl>
                <LabeledInput
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Password
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
              <FormMessage />
              <Link
                href="/auth/reset-password"
                className="text-primary label-regular justify-self-end"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading && <Loader className="animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
};

const CreateAccountFormSchema = z
  .object({
    password1: z
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
    password2: z.string("Please confirm your password."),
    email: z
      .string("Please enter your email address.")
      .trim()
      .email("Please enter a valid email address.")
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
        "Please enter a valid email address.",
      ),
    fullName: z
      .string()
      .nonempty("Full name is required")
      .regex(/^[a-zA-Z ]+$/, "Full name must contain letters only")
      .max(50, "Full name is 50 characters max"),

    phone: z
      .string()
      .nonempty("Mobile number is required")
      .regex(/^\d{10}$/, "Enter a valid phone number"),
    terms: z
      .boolean("Terms & Conditions must be accepted")
      .refine((val) => val === true, {
        message: "Terms & Conditions must be accepted",
      }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"], // attach the error to password2 field
  });

export type CreateAccountFormValues = z.infer<typeof CreateAccountFormSchema>;

export const CreateAccountForm = ({
  onCreateAccountSubmit,
  isLoading = false,
}: {
  onCreateAccountSubmit: (data: CreateAccountFormValues) => void;
  isLoading?: boolean;
}) => {
  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={form.handleSubmit(onCreateAccountSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">Email</FormLabel>
              <FormControl>
                <LabeledInput
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
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Full Name
                <span className="text-[#E50000]">*</span>
              </FormLabel>
              <FormControl>
                <LabeledInput
                  icon={ProfileNav}
                  type="text"
                  placeholder="Enter your full name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Mobile Number
                <span className="text-[#E50000]">*</span>
              </FormLabel>
              <FormControl>
                <LabeledInputWithCode
                  type="number"
                  placeholder="e.g., 400123456"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Password
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
          control={form.control}
          name="password2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Password Confirmation
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

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <div className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <div className="grid">
                  <FormLabel className="flex gap-2 label-regular">
                    I agree to the
                    <Link href="" className="text-primary underline">
                      Terms & Conditions
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading && <Loader className="animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
};

const VerifyPhoneOTPSchema = z.object({
  phoneOTP: z.string().min(5, {
    message: "Please enter the code",
  }),
});

export type VerifyPhoneOTPValue = z.infer<typeof VerifyPhoneOTPSchema>;

export const VerifyPhoneOTPForm = ({
  onSubmitVerifyPhone,
  errorText,
}: {
  onSubmitVerifyPhone: (data: VerifyPhoneOTPValue) => void;
  errorText?: string;
}) => {
  const form = useForm<VerifyPhoneOTPValue>({
    resolver: zodResolver(VerifyPhoneOTPSchema),
  });

  useEffect(() => {
    if (errorText) {
      form.setError("phoneOTP", { type: "manual", message: errorText });
    }
  }, [errorText, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitVerifyPhone)}
        className="grid gap-6 pt-2"
      >
        <FormField
          control={form.control}
          name="phoneOTP"
          render={({ field }) => (
            <div className="flex items-center justify-center">
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={5} {...field}>
                    <InputOTPGroup className="w-fit flex justify-center">
                      <InputOTPSlot className="border-border-dark" index={0} />
                      <InputOTPSlot className="border-border-dark" index={1} />
                      <InputOTPSlot className="border-border-dark" index={2} />
                      <InputOTPSlot className="border-border-dark" index={3} />
                      <InputOTPSlot className="border-border-dark" index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </Form>
  );
};
