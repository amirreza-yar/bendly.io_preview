"use client";
import { Button } from "@/components/uikit/buttons/button";
import { Label } from "@/components/dashboard/material&color/label";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from "@/components/dashboard/material&color/radioGroup";
import { Header } from "@/components/dashboard/header";
import { Footer } from "@/components/dashboard/footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/material&color/tabs";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/uikit/form";
import { cn } from "@/utilities/ui";
import { useNewFlashingContext } from "@/providers/data_providers/flashing_providers/NewFlashingContext";
import { ColorType, ThicknessType } from "@/types/material&PropsType";
import { db } from "@/lib/db/appDB";
import { useLiveQuery } from "dexie-react-hooks";
import { FeaturedCheckSmall } from "@/components/uikit/icons";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { upsertPartialFlashing } from "@/lib/db/helpers/flashingHelpers";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";

export default function SelectMaterialAndColorPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // const { flashingId }: { flashingId: string } = useParams();

  const orderId = useSearchParams().get("orderId");

  // const savedFlashing = useLiveQuery(
  //   () => db.flashings.get({ id: flashingId }),
  //   [flashingId],
  //   null
  // );

  // let materialsWithProperties: any = null;

  const {
    data: materialsWithProperties,
    error,
    isLoading,
  } = useSWR("/d/materials/", fetcher, {
    // onSuccess: (data) => {
    //   materialsWithProperties = data.results;
    // },
  });

  console.log(materialsWithProperties);

  // useEffect(() => {
  //   console.log(isNavigating);
  //   if (isNavigating) return; // skip while navigating

  //   if (savedFlashing === undefined) {
  //     notFound();
  //   } else if (
  //     (savedFlashing && savedFlashing.nodes.length > 1) ||
  //     savedFlashing?.color ||
  //     savedFlashing?.thickness
  //   ) {
  //     notFound();
  //   }
  // }, [savedFlashing, isNavigating]);

  const materialNames = materialsWithProperties?.results?.map(
    (m) => m.material
  );

  const FormSchema = z.object({
    material: z.number().nonoptional(),
  });
  // .superRefine(({ material, color, thicknessCode }, ctx) => {
  //   const hasColors = !!materialsWithProperties?.find((m) => m.material === material)?.colors
  //   const hasThicknesses = !!materialsWithProperties?.find((m) => m.material === material)
  //     ?.thicknesses

  //   if (hasColors) {
  //     if (!color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color is required for selected material',
  //       })
  //     } else if (!getColorNames(material).includes(color)) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Invalid color for selected material',
  //       })
  //     }
  //     // Thickness should be empty if colors exist
  //     if (thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness should not be selected for this material',
  //       })
  //     }
  //   } else if (hasThicknesses) {
  //     if (!thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness is required for selected material',
  //       })
  //     } else if (!getThicknessCodes(material).includes(thicknessCode)) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Invalid thickness for selected material',
  //       })
  //     }
  //     // Color should be empty if thicknesses exist
  //     if (color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color should not be selected for this material',
  //       })
  //     }
  //   } else {
  //     // Material has neither colors nor thicknesses (rare case)
  //     if (color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color should not be selected for this material',
  //       })
  //     }
  //     if (thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness should not be selected for this material',
  //       })
  //     }
  //   }
  // })

  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const selectedMaterial = form.watch("material");

  // useEffect(() => {
  //   console.log(form.formState.errors, selectedMaterial);
  // }, [form, selectedMaterial]);

  // const onSubmit = (data: FormValues) => {
  //   if (data.material && (data.color || data.thicknessCode)) {
  //     if (data.color) {
  //       const colorCode = materialsWithProperties
  //         ?.find((obj) => obj.material === data.material)
  //         ?.colors?.find((obj) => obj.name === data.color)?.code;

  //       upsertPartialFlashing(flashingId, {
  //         material: data.material,
  //         color: { name: data.color || "", code: colorCode || "" },
  //         thickness: undefined,
  //       });
  //     } else if (data.thicknessCode) {
  //       const thickness = materialsWithProperties
  //         ?.find((obj) => obj.material === data.material)
  //         ?.thicknesses?.find(
  //           (obj) => obj.code === data.thicknessCode
  //         )?.thickness;

  //       upsertPartialFlashing(flashingId, {
  //         material: data.material,
  //         thickness: {
  //           code: data.thicknessCode || "",
  //           thickness: thickness || 0,
  //         },
  //         color: undefined,
  //       });
  //     }
  //   }

  //   setIsNavigating(true);

  //   window.location.assign(`/f/${flashingId}/canvas?orderId=${orderId}`);
  // };

  // if (savedFlashing) {
  return (
    <>
      <Header title="Select Material & Properties" returnHref="/dashboard" />

      <ContentWrapper className="bg-white pt-18 pb-22">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
            })}
            className="grid gap-8"
          >
            <Tabs onValueChange={() => form.setValue("material", null)}>
              <div className="grid gap-4 pb-6">
                <h6>Materials</h6>

                <TabsList>
                  <div className="flex flex-wrap gap-2">
                    {materialsWithProperties?.results?.map((mat: any) => (
                      <TabsTrigger key={mat.id} value={mat.name}>
                        {mat.name}
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </div>
              {materialsWithProperties?.results?.map((mat, index) => (
                <TabsContent key={index} value={mat.name}>
                  {mat.variant_type === "color" ? (
                    <>
                      <h6 className="pb-4">Color</h6>

                      <div className="grid grid-cols-3 gap-2">
                        {mat.variants.map((variant: any) => (
                          <button
                            key={variant.id}
                            onClick={() => {
                              form.setValue("material", variant.id);
                            }}
                            className="rounded-md flex flex-col items-center justify-between relative"
                          >
                            <div
                              className={cn(
                                "h-29 rounded-md w-full grid p-1",
                                variant.id === selectedMaterial
                                  ? "border-2 border-border-success"
                                  : "border border-border-default"
                              )}
                            >
                              <div
                                className="w-full h-15 rounded-md"
                                style={{
                                  background: `${variant.value}`,
                                }}
                              ></div>
                              <p className="w-full text-center caption-regular">
                                {variant.label}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h6 className="pb-4">Thickness</h6>
                      <div className="grid gap-2">
                        {mat.variants.map((variant: any) => (
                          <button
                            key={variant.id}
                            onClick={() => {
                              form.setValue("material", variant.id);
                            }}
                            className="rounded-md flex flex-col items-center justify-between relative"
                          >
                            <div
                              className={cn(
                                "rounded-md w-full px-4 py-2.5 border border-border-default flex items-center justify-between",
                                variant.id === selectedMaterial &&
                                  "bg-surface-comp-active"
                              )}
                            >
                              <p className="w-full label-regular">
                                {variant.label} - {variant.value}mm
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>
              ))}
              <Footer>
                <Button disabled={!selectedMaterial} className="w-full">
                  Next
                </Button>
              </Footer>
            </Tabs>
          </form>
        </Form>
      </ContentWrapper>
    </>
  );
  // }
}
