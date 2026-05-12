"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Project } from "@/types/api";
import { useState } from "react";
import { Tabs, TabsContent } from "../../ui/custom-tabs";
import { ArrowLeft } from "../../icons";
import Link from "next/link";

const newProjectFormSchema = z.object({
  code: z
    .string("Code is required")
    .nonempty("Project code is required")
    .regex(/^\d+$/, "Code must only contain digits"),
  project_name: z.string().optional(),
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

export default function NewProjectForm({
  onPostNewProject,
}: {
  onPostNewProject: (data: {
    code: string;
    project_name?: string;
    title: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    name: string;
    phone: string;
  }) => Promise<{ ok: boolean; message?: string; data?: Project }>;
}) {
  const newProjectForm = useForm<z.infer<typeof newProjectFormSchema>>({
    resolver: zodResolver(newProjectFormSchema),
    defaultValues: {
      code: "",
      project_name: "",
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

  const returnHref = useSearchParams().get("return");

  const handleNewProjectSubmit = async (
    data: z.infer<typeof newProjectFormSchema>,
  ) => {
    let subData;

    if (data.project_name) {
      subData = {
        code: data.code,
        project_name: data.project_name,
        title: data.title,
        street: data.street,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        name: data.name,
        phone: data.phone,
      };
    } else {
      subData = {
        code: data.code,
        title: data.title,
        street: data.street,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        name: data.name,
        phone: data.phone,
      };
    }

    const res = await onPostNewProject(subData);

    if (res.ok && res?.data?.id) {
      if (returnHref === "cart") {
        toast("Project created");
        router.replace(
          `/cart/fulfill?address_id=${res.data.addresses.find((a) => a.title === subData.title)?.id}&project_id=${res.data.id}`,
        );
      } else {
        toast("Project created");
        router.replace(`/dashboard/project/${res.data.id}`);
      }
    } else {
      if (res.message) {
        toast(res.message);
      } else {
        toast("Couldn't create project");
      }
    }
  };

  const [currentTab, setCurrentTab] = useState("info");

  const handleNext = async () => {
    if (currentTab === "info") {
      const validation = await newProjectForm.trigger(["code", "project_name"]);

      if (validation) {
        setCurrentTab("address");
      }
    } else if (currentTab === "address") {
      const validation = await newProjectForm.trigger();

      console.log(validation);
    }
  };

  const handlePrev = () => {
    setCurrentTab("info");
  };

  return (
    <>
      <div className="fixed flex items-center gap-2 absolute top-2 left-2 text-primary-foreground">
        {currentTab === "info" ? (
          <Button variant="ghost" size="icon-lg" asChild>
            <Link
              href={
                returnHref === "cart" ? `/cart/fulfill` : "/dashboard/project"
              }
            >
              <ArrowLeft />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon-lg" onClick={handlePrev}>
            <ArrowLeft />
          </Button>
        )}

        <h6>{currentTab === "info" ? `Add New Project` : `Add New Address`}</h6>
      </div>
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="relative bg-background rounded-lg pb-0! h-full shadow-md">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="h-full"
          >
            <form
              onSubmit={newProjectForm.handleSubmit(handleNewProjectSubmit)}
              className="h-full"
            >
              <FieldGroup className="h-full">
                <TabsContent className="h-full flex flex-col" value="info">
                  <FieldGroup className="pt-4 pb-25 h-full">
                    <FieldSet className="px-4 md:px-6 shrink-0">
                      <Controller
                        name="code"
                        control={newProjectForm.control}
                        render={({ field, fieldState }) => {
                          const isInvalid = fieldState.invalid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Project Code{" "}
                                <span className="text-destructive">*</span>
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                aria-invalid={isInvalid}
                                autoComplete="off"
                                placeholder="PRJ-3547"
                              />
                              {!isInvalid ? (
                                <FieldDescription>
                                  Unique identifier for this project
                                </FieldDescription>
                              ) : (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          );
                        }}
                      />

                      <Controller
                        name="project_name"
                        control={newProjectForm.control}
                        render={({ field, fieldState }) => {
                          const isInvalid = fieldState.invalid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Project Name (Optional)
                              </FieldLabel>
                              <Input
                                {...field}
                                id={field.name}
                                aria-invalid={isInvalid}
                                autoComplete="off"
                                placeholder="Downtown Office Renovation"
                              />

                              <FieldDescription>
                                Helps you identify this project later
                              </FieldDescription>
                            </Field>
                          );
                        }}
                      />
                    </FieldSet>
                  </FieldGroup>

                  <div className="absolute rounded-b-xl bottom-0 py-4 w-full px-4 md:px-6 bg-background border-t">
                    <Field className="w-full">
                      <Button
                        size="lg"
                        type="button"
                        className="w-full"
                        onClick={handleNext}
                      >
                        Continue
                      </Button>
                    </Field>
                  </div>
                </TabsContent>

                <TabsContent className="h-full" value="address">
                  <div className="fixed flex items-center gap-2 absolute top-2 left-2 text-primary-foreground">
                    <Button variant="ghost" size="icon-lg" onClick={handlePrev}>
                      <ArrowLeft />
                    </Button>

                    <h6>Add New Address</h6>
                  </div>

                  <div className="h-full overflow-hidden">
                    <ScrollArea className="h-full">
                      <FieldGroup className="h-full pt-4 pb-25">
                        <FieldSet className="px-4 md:px-6 shrink-0">
                          <Controller
                            name="street"
                            control={newProjectForm.control}
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
                            control={newProjectForm.control}
                            render={({ field, fieldState }) => {
                              const isInvalid = fieldState.invalid;
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel htmlFor={field.name}>
                                    Suburb{" "}
                                    <span className="text-destructive">*</span>
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
                            control={newProjectForm.control}
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
                                        <SelectItem
                                          key={s.value}
                                          value={s.value}
                                        >
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
                            control={newProjectForm.control}
                            render={({ field, fieldState }) => {
                              const isInvalid = fieldState.invalid;
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel htmlFor={field.name}>
                                    Post code{" "}
                                    <span className="text-destructive">*</span>
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
                            control={newProjectForm.control}
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
                          <FieldLegend className="pb-2">
                            Delivery Contact
                          </FieldLegend>
                          <FieldGroup>
                            <Controller
                              name="name"
                              control={newProjectForm.control}
                              render={({ field, fieldState }) => {
                                const isInvalid = fieldState.invalid;
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                      Recipient Name{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
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
                              control={newProjectForm.control}
                              render={({ field, fieldState }) => {
                                const isInvalid = fieldState.invalid;
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                      Phone Number
                                      <span className="text-destructive">
                                        *
                                      </span>
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

                  <div className="absolute rounded-b-xl bottom-0 py-4 w-full px-4 md:px-6 bg-background border-t">
                    <Field className="w-full">
                      <Button size="lg" type="submit" className="w-full">
                        Add Project
                      </Button>
                    </Field>
                  </div>
                </TabsContent>
              </FieldGroup>
            </form>
          </Tabs>
        </div>
      </div>
    </>
  );
}
