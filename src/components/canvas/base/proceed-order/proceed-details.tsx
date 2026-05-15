"use client";
import { DialogFooter } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Minus, Plus } from "lucide-react";
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

  fitTogether: z.enum(["rtl", "ltr"]).nonoptional(),
});

export type DetailsFormValues = z.infer<typeof DetailsFormSchema>;

export default function DetailsDialogContent({
  setProceedTabsVal,
  onDetailsFormSubmit,
}: {
  setProceedTabsVal: Dispatch<SetStateAction<string>>;
  onDetailsFormSubmit: (data: DetailsFormValues) => Promise<void>;
}) {
  const flashingDetailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: {
      code: "",
      position: "",
      fitTogether: "rtl",
      specifications: [{ quantity: "", length: "" }],
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

  return (
    <>
      <div>
        <h5 className="text-base pb-3">Add Details</h5>
      </div>
      <div className="h-full overflow-hidden">
        <ScrollArea className="h-full">
          <form
            onSubmit={flashingDetailsForm.handleSubmit(onDetailsFormSubmit)}
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
                          <FieldLabel htmlFor={field.name}>Code</FieldLabel>
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
                              value="rtl"
                              id="rtl"
                            />
                            <FieldLabel htmlFor="rtl">
                              Right to Left
                            </FieldLabel>
                          </div>

                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value="ltr"
                              id="ltr"
                            />
                            <FieldLabel htmlFor="ltr">
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
                    <div key={field.id} className="flex gap-4 items-end pr-1">
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
                        <InputGroupAddon align="inline-end">mm</InputGroupAddon>
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
        <div className="grid grid-cols-2 gap-2 w-full sm:w-fit sm:justify-end p-1">
          <Button
            size="lg"
            variant="ghost"
            className="text-primary"
            onClick={() => setProceedTabsVal("material")}
          >
            Go Back
          </Button>

          <Button size="lg" form="specifications-form" onClick={() => {}}>
            Save and Continue
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
