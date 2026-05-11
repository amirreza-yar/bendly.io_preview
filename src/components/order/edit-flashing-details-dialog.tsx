"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/utilities/ui";
import { graphStore } from "@/lib/flashing/store/store";
import { useGraphStore } from "@/lib/flashing/store/useStore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight, Edit } from "@/components/icons";
import { Material, Specification } from "@/types/api";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus, XIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const SpecSchema = z.object({
  quantity: z
    .string("Required field")
    // .regex(/^\d+$/)
    .nonempty("Required field")
    .refine((v) => !isNaN(Number(v)), {
      message: "Must be a number",
    }),

  length: z
    .string("Required field")
    .nonempty("Required field")
    .refine((v) => !isNaN(Number(v)), {
      message: "Must be a number",
    })
    .refine((v) => Number(v) >= 200, {
      message: "Must be at least 200 mm",
    })
    .refine((v) => Number(v) <= 8000, {
      message: "Must be at most 8000 mm",
    }),
});

const DetailsFormSchema = z.object({
  code: z
    .string("Required field")
    .nonempty("Required field")
    .regex(/^[a-zA-Z0-9-]+$/, "Alphanumeric and - only"),
  position: z.string().optional(),
  specifications: z
    .array(SpecSchema)
    .nonempty("At least one specification is required")
    .refine(
      (arr) => arr.every((s) => Number(s.quantity) > 0 && Number(s.length) > 0),
      { message: "Each specification must have quantity and length" },
    ),

  fitTogether: z.enum(["right-to-left", "left-to-right"]).nonoptional(),
});

export type DetailsFormValues = z.infer<typeof DetailsFormSchema>;

export default function EditFlashingDetailsDialog({
  //   setProceedTabsVal,
  flashingId,
  details,
}: {
  //   setProceedTabsVal: Dispatch<SetStateAction<string>>;
  flashingId: string | number;
  details: { code: string; position: string; specifications: Specification[] };
}) {
  const [detailsPatchModalOpen, setDetailsPatchModalOpen] =
    useState<boolean>(false);

  const stringifiedSpecs = details.specifications.map((sp) => ({
    quantity: String(sp.quantity),
    length: String(sp.length),
  }));

  const flashingDetailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: {
      code: details.code,
      position: details.position,
      fitTogether: "right-to-left",
      specifications: stringifiedSpecs,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: flashingDetailsForm.control,
    name: "specifications",
  });

  const specifications = useWatch({
    control: flashingDetailsForm.control,
    name: "specifications",
  });

  const router = useRouter();

  const onPatchFlashingDetails = async (data: DetailsFormValues) => {
    const specs = data.specifications.map((sp) => ({
      quantity: Number(sp.quantity),
      length: Number(sp.length),
    }));

    try {
      await api.patch(`/a/flashing/${flashingId}/`, {
        code: data.code,
        position:
          (data.position?.length ?? 0) > 0 ? data.position : "Not provided",
        specifications: specs,
      });
      toast("Flashing details updated");

      setDetailsPatchModalOpen(false);
    } catch {
      toast("Counldn't update flashing details");
    }
    router.refresh();
  };

  return (
    <>
      <Dialog open={detailsPatchModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-1 top-1"
            onClick={() => setDetailsPatchModalOpen(true)}
          >
            <Edit className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="h-[calc(100%-50px)] w-[calc(100%-2rem)] max-h-200! sm:max-w-200 flex flex-col gap-2 pb-4"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Button
            variant="ghost"
            className="absolute top-4 right-4"
            size="icon-sm"
            onClick={() => setDetailsPatchModalOpen(false)}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>

          <DialogTitle />
          <div className="h-full relative flex flex-col overflow-hidden">
            <div>
              <h5 className="text-base pb-3">Add Details</h5>
            </div>
            <div className="h-full overflow-hidden">
              <ScrollArea className="h-full">
                <form
                  onSubmit={flashingDetailsForm.handleSubmit(
                    onPatchFlashingDetails,
                  )}
                  className="flex flex-col gap-6 pt-2"
                  id="specifications-form"
                >
                  <FieldSet>
                    <FieldGroup className="gap-0">
                      <FieldLegend className="font-semibold">
                        Identification
                      </FieldLegend>
                      <div className="grid grid-cols-2 gap-2 pb-2 px-1">
                        <Controller
                          name="code"
                          control={flashingDetailsForm.control}
                          render={({ field, fieldState }) => {
                            const isInvalid = fieldState.invalid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Code
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={field.name}
                                  aria-invalid={isInvalid}
                                  autoComplete="on"
                                  placeholder="Enter code"
                                />
                                {/* {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )} */}
                              </Field>
                            );
                          }}
                        />
                        <Controller
                          name="position"
                          control={flashingDetailsForm.control}
                          render={({ field, fieldState }) => {
                            const isInvalid = fieldState.invalid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                  Position (Optional)
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={field.name}
                                  aria-invalid={isInvalid}
                                  autoComplete="on"
                                  placeholder="e.g. Lvl7 North"
                                />
                                {/* {isInvalid && (
                          <FieldError errors={[fieldState.error]} />
                        )} */}
                              </Field>
                            );
                          }}
                        />
                      </div>
                      <FieldDescription>
                        Alphanumeric characters and hyphens only
                      </FieldDescription>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldGroup className="gap-0">
                      <FieldLegend className="font-semibold pb-2">
                        Fit together
                      </FieldLegend>
                      <Controller
                        name="fitTogether"
                        control={flashingDetailsForm.control}
                        render={({ field, fieldState }) => {
                          const isInvalid = fieldState.invalid;
                          return (
                            <FieldSet data-invalid={isInvalid}>
                              <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={isInvalid}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="right-to-left"
                                    id="right-to-left"
                                  />
                                  <FieldLabel htmlFor="right-to-left">
                                    Right to Left
                                  </FieldLabel>
                                </div>

                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="left-to-right"
                                    id="left-to-right"
                                  />
                                  <FieldLabel htmlFor="left-to-right">
                                    Left to Right
                                  </FieldLabel>
                                </div>
                              </RadioGroup>
                              {isInvalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </FieldSet>
                          );
                        }}
                      />
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet className="pt-2">
                    <FieldGroup className="gap-1">
                      <FieldLegend className="font-semibold mb-0">
                        Specifications
                      </FieldLegend>
                      <FieldDescription>
                        The length range is from 200 mm to 8000 mm
                      </FieldDescription>

                      <FieldSet className="pt-3">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex gap-4 items-end pr-1"
                          >
                            <div className="grid grid-cols-5 gap-4 px-1">
                              <div className="col-start-1 col-end-3">
                                {/* Quantity */}
                                <Controller
                                  control={flashingDetailsForm.control}
                                  name={`specifications.${index}.quantity`}
                                  render={({ field, fieldState }) => (
                                    <Field
                                      data-invalid={fieldState.invalid}
                                      className="gap-2"
                                    >
                                      <FieldLabel htmlFor={field.name}>
                                        Quantity
                                      </FieldLabel>
                                      <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        placeholder=""
                                      />
                                    </Field>
                                  )}
                                />
                              </div>
                              <div className="col-start-3 col-end-6">
                                <Controller
                                  control={flashingDetailsForm.control}
                                  name={`specifications.${index}.length`}
                                  render={({ field, fieldState }) => (
                                    <Field
                                      data-invalid={fieldState.invalid}
                                      className="gap-2"
                                    >
                                      <FieldLabel htmlFor={field.name}>
                                        Length
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupAddon align="inline-end">
                                          mm
                                        </InputGroupAddon>
                                        <InputGroupInput
                                          {...field}
                                          id={field.name}
                                          aria-invalid={fieldState.invalid}
                                          autoComplete="off"
                                          placeholder=""
                                        />
                                      </InputGroup>
                                    </Field>
                                  )}
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => remove(index)}
                              size="icon-lg"
                              className="rounded-lg"
                              disabled={specifications.length === 1}
                            >
                              <Minus />
                            </Button>
                          </div>
                        ))}
                      </FieldSet>
                    </FieldGroup>
                  </FieldSet>

                  <FieldGroup className="gap-1 pb-18 pr-1">
                    <div className="flex gap-4 items-end">
                      <div className="grid grid-cols-5 gap-4">
                        <div className="col-start-1 col-end-3">
                          <FieldSet className="gap-2">
                            <FieldLabel className="text-muted-foreground">
                              Quantity
                            </FieldLabel>
                            <Input autoComplete="off" placeholder="" disabled />
                          </FieldSet>
                        </div>
                        <div className="col-start-3 col-end-6">
                          <FieldSet className="gap-2">
                            <FieldLabel className="text-muted-foreground">
                              Length
                            </FieldLabel>
                            <InputGroup className="opacity-50">
                              <InputGroupAddon align="inline-end">
                                mm
                              </InputGroupAddon>
                              <InputGroupInput
                                autoComplete="off"
                                placeholder=""
                                disabled
                              />
                            </InputGroup>
                          </FieldSet>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            quantity: "" as any,
                            length: "" as any,
                          })
                        }
                        size="icon-lg"
                        className="rounded-lg"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              </ScrollArea>
            </div>
            <DialogFooter className="bg-background border-t pt-4 absolute bottom-0 w-full">
              <div className="flex w-full sm:w-fit sm:justify-end">
                {/* <DialogClose asChild> */}
                <Button
                  form="specifications-form"
                  type="submit"
                  size="lg"
                  className="w-full sm:w-fit"
                >
                  Update Flashing Details
                </Button>
                {/* </DialogClose> */}
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
