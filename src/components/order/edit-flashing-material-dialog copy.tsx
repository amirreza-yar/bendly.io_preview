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
import { Material } from "@/types/api";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditFlashingMaterialDialog({
  //   setProceedTabsVal,
  flashingId,
  materials,
  selectedMat,
}: {
  //   setProceedTabsVal: Dispatch<SetStateAction<string>>;
  flashingId: string | number;
  materials: Material[];
  selectedMat: {
    label: string;
    name: string;
    type: string;
    value: string | number;
  };
}) {
  const selectedMaterialData = materials.find(
    (m) => m.name === selectedMat.name,
  );
  const selectedVariantData = selectedMaterialData?.variants.find(
    (v) => v.label === selectedMat.label,
  );

  const router = useRouter();

  const [scratchMaterial, setScratchMaterial] = useState({
    id: selectedVariantData?.id,
    mat_id: selectedMaterialData?.id,
    mat_name: selectedMaterialData?.name,
    type: selectedMaterialData?.variant_type,
    label: selectedVariantData?.label,
    value: selectedVariantData?.value,
  });

  const onPatchFlashingMaterial = async () => {
    try {
      await api.patch(`/a/flashing/${flashingId}/`, {
        material: scratchMaterial.id,
      });
      toast("Material updated");
    } catch {
      toast("Counldn't update material");
    }
    router.refresh();
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Edit className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton={true}
          className="h-[calc(100%-50px)] w-[calc(100%-2rem)] max-h-200! sm:max-w-200 flex flex-col gap-2 pb-4"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle />
          <div className="h-full relative flex flex-col overflow-hidden">
            <div>
              <h5 className="text-base pb-3">Update Material & Colour</h5>
              {/* <p>Select your material.</p> */}
            </div>
            <div className="-mx-4 h-full overflow-hidden">
              <Tabs
                className="h-full"
                defaultValue={String(scratchMaterial?.mat_id)}
              >
                <ScrollArea className="h-full">
                  <TabsPrimitive.List className="bg-background z-20 pb-4 px-4">
                    <h6 className="pl-2">Materials</h6>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {materials?.map((mat) => (
                        <TabsPrimitive.Trigger
                          className={cn(
                            "gap-1.5 rounded-md border px-2 py-2 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                            "data-active:bg-success/10 dark:data-active:text-success dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-success",
                            "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5",
                          )}
                          key={mat.id}
                          value={String(mat.id)}
                        >
                          {mat.name}
                        </TabsPrimitive.Trigger>
                      ))}
                    </div>
                  </TabsPrimitive.List>

                  {materials?.map((mat, index: number) => (
                    <TabsContent
                      key={index}
                      value={String(mat.id)}
                      className="px-1"
                    >
                      {mat.variant_type === "color" ? (
                        <>
                          <h6 className="pb-4 pl-6">Color</h6>

                          <div className="pb-30 px-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 pb-2">
                            {mat.variants.map((variant) => (
                              <button
                                type="button"
                                key={variant.id}
                                onClick={() => {
                                  setScratchMaterial({
                                    id: variant.id,
                                    mat_id: mat.id,
                                    mat_name: mat.name,
                                    type: mat.variant_type,
                                    label: variant.label,
                                    value: variant.value,
                                  });
                                }}
                                className={cn(
                                  "mx-0.5 rounded-md w-full flex items-center justify-between gap-3 p-1 pl-2 transition border relative",
                                  variant.id === scratchMaterial?.id &&
                                    "ring-2 ring-success dark:bg-success/10",
                                )}
                              >
                                <p className="w-full text-start text-xs">
                                  {variant.label}
                                </p>
                                <div
                                  className="min-w-8 h-8 rounded-md border"
                                  style={{
                                    background: `${variant.value}`,
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h6 className="pb-4 pl-6">Thickness</h6>
                          <div className="pb-30 px-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {mat.variants.map((variant) => (
                              <button
                                type="button"
                                key={variant.id}
                                onClick={() => {
                                  setScratchMaterial({
                                    id: variant.id,
                                    mat_id: mat.id,
                                    mat_name: mat.name,
                                    type: mat.variant_type,
                                    label: variant.label,
                                    value: variant.value,
                                  });
                                }}
                                className={cn(
                                  "rounded-md w-full px-4 py-2 border border-border-default text-xs transition text-center",
                                  variant.id === scratchMaterial?.id &&
                                    "bg-success/15",
                                )}
                              >
                                {variant.label} - {variant.value}mm
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </TabsContent>
                  ))}
                  <ScrollBar />
                </ScrollArea>
              </Tabs>
            </div>
            <DialogFooter className="bg-background border-t pt-4 absolute bottom-0 w-full">
              <div className="flex w-full sm:w-fit sm:justify-end">
                <DialogClose asChild>
                  <Button
                    size="lg"
                    className="w-full sm:w-fit"
                    onClick={async () => {
                      if (!scratchMaterial) return;

                      await onPatchFlashingMaterial();
                    }}
                    disabled={!!!scratchMaterial}
                  >
                    Update Material
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
