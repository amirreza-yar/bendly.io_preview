"use client";
import { Button } from "@/components/uikit/buttons/button";
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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/uikit/form";
import { cn } from "@/utilities/ui";
import { notFound, useRouter } from "next/navigation";
import { upsertPartialFlashing } from "@/lib/db/helpers/flashingHelpers";
import { use, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/appDB";

export default function SelectMaterialAndColorPage({
  searchParams,
}: {
  searchParams: Promise<{
    flashingId: string | undefined;
    next: string | undefined;
  }>;
}) {
  const router = useRouter();

  const { flashingId, next } = use(searchParams);

  const dexieFlashing = useLiveQuery(
    () => (flashingId ? undefined : db.flashings.get({ id: "1" })),
    [flashingId],
    null
  );

  const [tabValue, setTabValue] = useState<string>("");

  const nextUrl = use(searchParams).next;

  const { data: materials } = useSWR("/a/materials/", fetcher, {
    onError: notFound,
  });

  const FormSchema = z.object({
    material: z.number().nonoptional(),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const selectMaterialForm = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const { data: swrFlashing } = useSWR(
    flashingId ? `/a/flashing/${flashingId}/` : null,
    fetcher
  );

  const flashing = useMemo(() => {
    if (flashingId) {
      return swrFlashing ?? null;
    }
    return dexieFlashing ?? null;
  }, [flashingId, swrFlashing, dexieFlashing]);

  useEffect(() => {
    if (!flashing) return;
    selectMaterialForm.reset({
      material: flashing?.material_data?.id ?? flashing?.material,
    });
    setTabValue((prev) => flashing?.material_data?.name ?? "");
  }, [flashing, selectMaterialForm]);

  const selectedMaterial = useWatch({
    control: selectMaterialForm.control,
    name: "material",
  });

  const onSelectMaterialSubmit = async (data: FormValues) => {
    if (flashingId && flashing) {
      await api.patch(`/a/flashing/${flashingId}/`, {
        material: data.material,
      });

      toast("Material updated");
      router.replace("/cart");
    } else {
      const variantData = (() => {
        for (const m of materials) {
          const v = m.variants.find((v: any) => v.id === data.material);
          if (v) return { ...v, name: m.name, variant_type: m.variant_type };
        }
        return null;
      })();

      await upsertPartialFlashing("1", {
        material: String(data.material),
        material_data: variantData,
      });
      if (nextUrl === "preview") {
        toast("Material updated");
        router.push("/f/preview");
      } else {
        toast("Material selected");
        router.push("/f/canvas");
      }
    }
  };

  return (
    <>
      <Header
        title="Select Material & Properties"
        returnHref={
          next === "preview"
            ? "/f/preview"
            : flashingId
            ? "/cart"
            : "/dashboard"
        }
      />

      <ContentWrapper className="bg-white pt-18 pb-22">
        <Form {...selectMaterialForm}>
          <form
            onSubmit={selectMaterialForm.handleSubmit(onSelectMaterialSubmit)}
            className="grid gap-8"
          >
            <Tabs
              // defaultValue={tabValue}
              value={tabValue}
              onValueChange={(v) => {
                selectMaterialForm.setValue("material", null);
                setTabValue(v);
              }}
            >
              <div className="grid gap-4 pb-6">
                <h6>Materials</h6>

                <TabsList>
                  <div className="flex flex-wrap gap-2">
                    {materials?.map((mat: any) => (
                      <TabsTrigger key={mat.id} value={mat.name}>
                        {mat.name}
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </div>
              {materials?.map((mat: any, index: number) => (
                <TabsContent key={index} value={mat.name}>
                  {mat.variant_type === "color" ? (
                    <>
                      <h6 className="pb-4">Color</h6>

                      <div className="grid grid-cols-3 gap-2">
                        {mat.variants.map((variant: any) => (
                          <button
                            type="button"
                            key={variant.id}
                            onClick={() => {
                              selectMaterialForm.setValue(
                                "material",
                                variant.id
                              );
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
                            type="button"
                            key={variant.id}
                            onClick={() => {
                              selectMaterialForm.setValue(
                                "material",
                                variant.id
                              );
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
                <Button
                  type="submit"
                  disabled={!selectedMaterial}
                  className="w-full"
                >
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
