import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/utilities/ui";
import { graphStore } from "@/lib/flashing/store/store";
import { useGraphStore } from "@/lib/flashing/store/useStore";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "@/components/icons";
import { Material } from "@/types/api";

export default function SelectMaterialDialogContent({
  setProceedTabsVal,
  materials,
}: {
  setProceedTabsVal: Dispatch<SetStateAction<string>>;
  materials: Material[];
}) {
  const selectedMat = useGraphStore((s) => s.material);

  return (
    <>
      <div>
        <h5 className="text-base pb-3">Select Material & Colour</h5>
        {/* <p>Select your material.</p> */}
      </div>
      <div className="-mx-4 h-full overflow-hidden">
        <Tabs className="h-full" defaultValue={String(selectedMat?.mat_id)}>
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
              <TabsContent key={index} value={String(mat.id)} className="px-1">
                {mat.variant_type === "color" ? (
                  <>
                    <h6 className="pb-4 pl-6">Color</h6>

                    <div className="pb-30 px-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 pb-2">
                      {mat.variants.map((variant) => (
                        <button
                          type="button"
                          key={variant.id}
                          onClick={() => {
                            graphStore.getState().setMaterial({
                              id: variant.id,
                              mat_id: mat.id,
                              mat_name: mat.name,
                              type: mat.variant_type,
                              label: variant.label,
                              value: variant.value,
                            });
                            // const timer = setTimeout(() => setOpenDialog(false), 200);
                            // clearTimeout(timer);
                          }}
                          className={cn(
                            "mx-0.5 rounded-md w-full flex items-center justify-between gap-3 p-1 pl-2 transition border relative",
                            variant.id === selectedMat?.id &&
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
                            graphStore.getState().setMaterial({
                              id: variant.id,
                              mat_id: mat.id,
                              mat_name: mat.name,
                              type: mat.variant_type,
                              label: variant.label,
                              value: variant.value,
                            });
                            // const timer = setTimeout(() => setOpenDialog(false), 200);
                            // clearTimeout(timer);
                          }}
                          className={cn(
                            "rounded-md w-full px-4 py-2 border border-border-default text-xs transition text-center",
                            variant.id === selectedMat?.id && "bg-success/15",
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
        <div className="grid grid-cols-2 gap-2 w-full sm:w-fit sm:justify-end">
          <Button
            size="lg"
            className="text-primary"
            variant="ghost"
            onClick={() => setProceedTabsVal("preview")}
          >
            Go Back
          </Button>

          <Button
            size="lg"
            onClick={() => {
              if (!selectedMat) return;

              setProceedTabsVal("details");
            }}
            disabled={!!!selectedMat}
          >
            Continue
            <ArrowRight />
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
