"use client";
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
import { Info, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { UILayoutBackground } from "@/components/main";
import useSWRMutation from "swr/mutation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/custom-field";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

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

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

async function signupRequest(
  url: string,
  {
    arg,
  }: {
    arg: SignupFormValues & {
      factory_token?: string;
      registration_role?: string;
    };
  },
) {
  const parts = arg.fullName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || ".";

  const res = await api.post("/auth/registration/", {
    email: arg.email.toLowerCase(),
    first_name: firstName,
    last_name: lastName,
    password1: arg.password1,
    password2: arg.password2,
    phone: `+61${arg.phone}`,
    factory_token: arg.factory_token ?? "",
    registration_role: arg.registration_role ?? "",
  });

  return res.data;
}

export default function SignupPage() {
  const searchParams = useSearchParams();

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
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
    const dataWithQ = {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      password1: data.password1,
      password2: data.password2,
      terms: data.terms,
      factory_token:
        searchParams.get("factory_token") ??
        process.env.NEXT_PUBLIC_FACTORY_TOKEN,
      registration_role: searchParams.get("registration_role") ?? "client",
    };

    try {
      await trigger(dataWithQ);
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
        <Button
          variant="ghost"
          size="icon-lg"
          className="absolute right-1 top-1 text-primary-foreground hover:bg-transparent hover:text-primary-light"
          asChild
        >
          <Link href="">
            <Settings className="size-6" />
          </Link>
        </Button>

        <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 text-primary-foreground text-center">
          <h5 className="overflow-hidden">Welcome to Bendly!</h5>
          <p className="caption-small">Create your account to get started</p>
        </div>
      </div>
      <div className="fixed top-40 w-full bottom-4 sm:px-8 px-4 max-w-150 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pb-0! h-full [@media(min-height:900px)]:h-fit shadow-md">
          <form
            className="relative h-full gap-2 flex flex-col"
            onSubmit={signupForm.handleSubmit(onSignup)}
          >
            <ScrollArea className="h-full">
              <FieldSet className="px-4 md:px-6">
                <FieldGroup className="gap-6 py-4 md:py-6 pb-30 md:pb-34">
                  <Controller
                    control={signupForm.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
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
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            type="text"
                            placeholder="Your Full Name"
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
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor={field.name}>
                          Phone Number
                        </FieldLabel>
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
                            +61
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
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
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
                      <Field
                        className="gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
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
                          <FieldLabel
                            className="line-clamp-2"
                            htmlFor={field.name}
                          >
                            <>
                              I agree to the
                              <Link
                                href="/terms"
                                className="text-primary underline-offset-4 underline px-2"
                              >
                                Terms & Conditions
                              </Link>
                              and
                              <Link
                                href="/privacy-policy"
                                className="text-primary underline-offset-4 underline px-2"
                              >
                                Privacy Policy
                              </Link>
                            </>
                          </FieldLabel>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </ScrollArea>
            <div className="absolute bottom-0 w-full border-t px-4 md:px-6 py-2 md:py-4 bg-background rounded-b-xl">
              <Button size="lg" className="mb-0 w-full" disabled={isMutating}>
                {isMutating && <Spinner />}
                Sign up
              </Button>
              <div className="flex items-center w-full justify-center pt-3">
                <p className="text-xs">Already have an account? </p>
                <Link href="/auth">
                  <Button variant="link" size="xs" type="button">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
