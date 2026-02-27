"use client";
import BottomNav from "@/components/dashboard/bottom-nav";
import { ArrowLeft, Mail, PasswordField, ProfileNav } from "@/components/icons";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import {
  Field,
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
import { Spinner } from "@/components/ui/spinner";
import api, { fetcher } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import z from "zod";

const EditNameORPhoneFormSchema = z.object({
  phone: z
    .string("Phone number is required")
    .regex(/^[2-478]\d{8}$/, "Enter a valid phone number"),
  fullName: z
    .string()
    .nonempty("Fullname is required")
    .regex(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name must only contain letters and spaces, and cannot start or end with a space.",
    )
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name must be less than 50 characters"),
});

async function editNameORPhoneReq(
  url: string,
  { arg }: { arg: z.infer<typeof EditNameORPhoneFormSchema> },
) {
  const parts = arg.fullName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";

  const res = await api.patch("/a/profile/", {
    phone: `+61${arg.phone}`,
    first_name: firstName,
    last_name: lastName,
  });

  return res.data;
}

export default function AccountSettingsPage() {
  const editNameORPhoneForm = useForm<
    z.infer<typeof EditNameORPhoneFormSchema>
  >({
    resolver: zodResolver(EditNameORPhoneFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
    // mode: "onChange",
  });

  const { data, isLoading, mutate } = useSWR("/a/profile/", fetcher, {
    onError: () => notFound(),
  });

  const { trigger, isMutating } = useSWRMutation(
    "/a/profile/",
    editNameORPhoneReq,
  );

  useEffect(() => {
    if (data) {
      editNameORPhoneForm.reset({
        phone: `${String(data.phone).slice(2)}`,
        fullName: `${data.first_name} ${data.last_name}`,
      });
    }
  }, [data, editNameORPhoneForm]);

  const onEditNameORPhone = async (
    data: z.infer<typeof EditNameORPhoneFormSchema>,
  ) => {
    try {
      const updated = await trigger(data);

      mutate(updated, false);

      toast("Account Updated");
    } catch (error: any) {
      toast("Something went wrong!");
    }
  };

  const isDirty = editNameORPhoneForm.formState.isDirty;

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
          <h6>Account</h6>
        </div>
        <UILayoutContentWrapper className="fixed top-0 mt-15 pb-20">
          <UILayoutContent className="px-0 py-4">
            {isLoading ? (
              <div className="flex flex-col gap-2 w-full animate-pulse px-4">
                <div className="h-4 w-16 bg-gray-300 rounded-md" />
                <div className="h-10 w-full bg-gray-300 rounded-md" />
                <div className="h-4 w-16 bg-gray-300 rounded-md mt-4" />
                <div className="h-10 w-full bg-gray-300 rounded-md" />
                <div className="h-4 w-16 bg-gray-300 rounded-md mt-4" />
                <div className="h-10 w-full bg-gray-300 rounded-md" />
                <div className="h-5 w-24 bg-gray-300 rounded-md" />
                <div className="h-4 w-16 bg-gray-300 rounded-md mt-4" />
                <div className="h-10 w-full bg-gray-300 rounded-md" />
                <div className="h-5 w-24 bg-gray-300 rounded-md" />

                <div className="h-11 w-full bg-gray-300 rounded-md mt-4" />
              </div>
            ) : (
              <form
                className="w-full max-h-[calc(100vh-175px)] overflow-y-auto px-4"
                onSubmit={editNameORPhoneForm.handleSubmit(onEditNameORPhone)}
              >
                <FieldSet>
                  <FieldGroup className="gap-6">
                    <Controller
                      control={editNameORPhoneForm.control}
                      name="fullName"
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-2"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor={field.name}>
                            Full Name
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id={field.name}
                              type="text"
                              {...field}
                              placeholder="demo@bendly.io"
                              aria-invalid={fieldState.invalid}
                              autoComplete="off"
                            />
                            <InputGroupAddon>
                              <ProfileNav />
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={editNameORPhoneForm.control}
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
                              +67
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Field className="gap-0">
                      <FieldLabel htmlFor="email" className="pb-2">
                        Email
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="email"
                          type="email"
                          placeholder="demo@bendly.io"
                          value={data?.email || ""}
                          autoComplete="off"
                          disabled
                        />
                        <InputGroupAddon>
                          <Mail className="size-5" />
                        </InputGroupAddon>
                      </InputGroup>
                      {/* <FieldDescription>
                        <Button variant="link" type="button" className="-ml-2">
                          Change email ? <ChevronRight />
                        </Button>
                      </FieldDescription> */}
                    </Field>

                    <Field className="gap-0">
                      <FieldLabel htmlFor="password" className="pb-2">
                        Password
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="password"
                          type="password"
                          value="********"
                          autoComplete="off"
                          disabled
                        />
                        <InputGroupAddon>
                          <PasswordField className="size-5" />
                        </InputGroupAddon>
                      </InputGroup>

                      <FieldDescription>
                        <Button
                          variant="link"
                          type="button"
                          className="-ml-2"
                          asChild
                        >
                          <Link href="/dashboard/setting/account/change-password">
                            Change Password ? <ChevronRight />
                          </Link>
                        </Button>
                      </FieldDescription>
                    </Field>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!isDirty || isMutating}
                    >
                      {isMutating && <Spinner />}
                      Save
                    </Button>
                  </FieldGroup>
                </FieldSet>
              </form>
            )}
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>
      <BottomNav />
    </>
  );
}
