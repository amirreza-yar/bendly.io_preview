"use client";
import Header from "@/components/main/header";
import { Logo, Mail, ProfileNav } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOffIcon, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import useSWRMutation from "swr/mutation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/custom-field";
import { Checkbox } from "@/components/ui/checkbox";

const SignupFormSchema = z
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
      .regex(/^[2-478]\d{8}$/, "Enter a valid phone number"),
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

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

async function signupRequest(url: string, { arg }: { arg: SignupFormValues }) {
  const parts = arg.fullName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";

  const res = await api.post("/auth/registration/", {
    email: arg.email.toLowerCase(),
    first_name: firstName,
    last_name: lastName,
    password1: arg.password1,
    password2: arg.password2,
    phone: `+61${arg.phone}`,
  });

  return res.data;
}

export default function SignupPage() {
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      password1: "",
      password2: "",
      terms: false,
    },
  });

  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation("/auth/login/", signupRequest);

  const onSignup = async (data: SignupFormValues) => {
    console.log(data);

    try {
      await trigger(data);
      toast("Verification email sent ");
      router.replace(`/auth/verify-email?email=${data.email}`);
    } catch (error: any) {
      const message =
        error.response.data?.email?.[0] ||
        "Something broke, probably not your fault.";

      toast(message);
    }
  };

  return (
    <UILayout>
      <Header variant="long" />
      <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
        Bendly
      </h6>

      <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />

      <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-14 text-primary-foreground text-center">
        <h5 className="overflow-hidden">Welcome to Bendly!</h5>
        <p className="caption-small">Enter credentials to login</p>
      </div>
      <UILayoutContentWrapper className="top-34">
        <UILayoutContent>
          <form onSubmit={signupForm.handleSubmit(onSignup)}>
            <FieldSet>
              <FieldGroup className="gap-6">
                <Controller
                  control={signupForm.control}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={signupForm.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="text"
                          placeholder="John Doe"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <InputGroupAddon>
                          <ProfileNav className="size-5" />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={signupForm.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="number"
                          placeholder="4100123456"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <InputGroupAddon className="bg-primary h-full pr-2.5 pl-2 rounded-l-md text-sm bg-[#eee] text-[#b1b1b1]">
                          +67
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={signupForm.control}
                  name="password1"
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
                  control={signupForm.control}
                  name="password2"
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Password Confirmation
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id={field.name}
                        placeholder="********"
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

                <Controller
                  control={signupForm.control}
                  name="terms"
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldContent className="gap-1">
                        <FieldLabel htmlFor={field.name}>
                          <>
                            Accept
                            <Link
                              href="/terms"
                              className="text-primary underline-offset-4 underline"
                            >
                              Terms and Conditions
                            </Link>
                          </>
                        </FieldLabel>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {!fieldState.invalid && (
                          <FieldDescription className="text-gray-600">
                            By clicking this checkbox, you agree to the terms.
                          </FieldDescription>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Button size="lg" className="mb-0" disabled={isMutating}>
                  {isMutating && <Spinner />}
                  Sign up
                </Button>
              </FieldGroup>
            </FieldSet>
            <div className="flex items-center w-full justify-center pt-5">
              <p className="text-xs">Already have an account? </p>
              <Link href="/auth">
                <Button variant="link" size="xs" type="button">
                  Log in
                </Button>
              </Link>
            </div>
          </form>
        </UILayoutContent>
      </UILayoutContentWrapper>
    </UILayout>
  );
}
