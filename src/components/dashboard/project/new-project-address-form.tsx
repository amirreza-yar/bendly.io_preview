"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../ui/input-group";
import {
  australianStates,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "@/utilities/ui";

const newAddressFormSchema = z.object({
  title: z
    .string("Address Title / Site Name is required")
    .nonempty("Address Title / Site Name is required")
    .max(100, "Address title must be under 100 characters"),

  street: z
    .string("Street Address is required")
    .nonempty("Street Address is required")
    .regex(
      /^[a-zA-Z0-9\s,'\.-]+$/,
      "Street address can only contain letters, numbers, spaces, comma, hyphen, dot, and apostrophe",
    )
    .max(100, "Street address must be under 100 characters"),

  suburb: z
    .string("Suburb is required")
    .nonempty("Suburb is required")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Suburb must contain only letters, spaces, and hyphens",
    )
    .max(50, "Suburb name must be under 50 characters"),

  state: z.string("State is required").nonempty("State is required"),

  postcode: z
    .string("Postcode is required")
    .regex(/^\d{4}$/, "Enter a valid postcode number"),

  name: z
    .string("Full name is required")
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters"),

  phone: z
    .string("Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid phone number"),
});

export default function NewAddressForm({
  projectId,
  onPostNewAddress,
}: {
  projectId: string | number;
  onPostNewAddress: (data: {
    id: string | number;
    title: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    name: string;
    phone: string;
  }) => Promise<{ ok: boolean; message?: string }>;
}) {
  const newAddressForm = useForm<z.infer<typeof newAddressFormSchema>>({
    resolver: zodResolver(newAddressFormSchema),
    defaultValues: {
      title: "",
      street: "",
      suburb: "",
      state: "",
      postcode: "",
      name: "",
      phone: "",
    },
  });

  const router = useRouter();

  if (!projectId) return notFound();

  const handleNewProjectAddressSubmit = async (
    data: z.infer<typeof newAddressFormSchema>,
  ) => {
    const res = await onPostNewAddress({
      id: projectId,
      title: data.title,
      street: data.street,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      name: data.name,
      phone: data.phone,
    });

    if (res.ok) {
      toast("Project updated");
      router.replace(`/dashboard/project/${projectId}`);
    } else {
      if (res.message) {
        toast(res.message);
      } else {
        toast("Couldn't update project");
      }
    }
  };

  return (
    <form
      onSubmit={newAddressForm.handleSubmit(handleNewProjectAddressSubmit)}
      className="h-full"
    >
      <FieldGroup className="relative h-full">
        <div className="h-full overflow-hidden">
          <ScrollArea className="h-full">
            <FieldGroup className="h-full pt-4 pb-25">
              <FieldSet className="px-4 md:px-6 shrink-0">
                <Controller
                  name="street"
                  control={newAddressForm.control}
                  render={({ field, fieldState }) => {
                    const isInvalid = fieldState.invalid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Street Address{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={isInvalid}
                          autoComplete="on"
                          placeholder="Enter street address"
                        />
                        {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="suburb"
                  control={newAddressForm.control}
                  render={({ field, fieldState }) => {
                    const isInvalid = fieldState.invalid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Suburb <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={isInvalid}
                          autoComplete="on"
                          placeholder="Enter suburb"
                        />
                        {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="state"
                  control={newAddressForm.control}
                  render={({ field, fieldState }) => {
                    const isInvalid = fieldState.invalid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          State / Territory{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue placeholder="Select state/territory" />
                          </SelectTrigger>
                          <SelectContent>
                            {australianStates.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
                <Controller
                  name="postcode"
                  control={newAddressForm.control}
                  render={({ field, fieldState }) => {
                    const isInvalid = fieldState.invalid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Post code <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={isInvalid}
                          autoComplete="on"
                          placeholder="Enter post code"
                        />
                        {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="title"
                  control={newAddressForm.control}
                  render={({ field, fieldState }) => {
                    const isInvalid = fieldState.invalid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Site Name / Address Label
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={isInvalid}
                          autoComplete="on"
                          placeholder="Enter site name or label"
                        />
                        {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldSet>

              <FieldSet className="px-4 md:px-6 shrink-0">
                <FieldLegend className="pb-2">Delivery Contact</FieldLegend>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={newAddressForm.control}
                    render={({ field, fieldState }) => {
                      const isInvalid = fieldState.invalid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Recipient Name{" "}
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={isInvalid}
                            autoComplete="on"
                            placeholder="Enter recipient name"
                          />
                          {isInvalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    name="phone"
                    control={newAddressForm.control}
                    render={({ field, fieldState }) => {
                      const isInvalid = fieldState.invalid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Phone Number
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon
                              className={cn(
                                "bg-muted p-0 h-full mx-auto w-10 border-r rounded-l-md",
                                isInvalid && "text-destructive",
                              )}
                            >
                              +61
                            </InputGroupAddon>
                            <InputGroupInput
                              {...field}
                              id={field.name}
                              aria-invalid={isInvalid}
                              autoComplete="on"
                              placeholder="Enter recipient number"
                            />
                          </InputGroup>
                          {isInvalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <ScrollBar className="z-10" />
          </ScrollArea>
        </div>

        <div className="absolute bottom-0 py-4 w-full px-4 md:px-6 bg-background border-t">
          <Field className="w-full">
            <Button size="lg" type="submit" className="w-full">
              Add Address
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
}
