import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import SelectMaterialDialogContent from "./proceed-material";
import { DialogTitle } from "@radix-ui/react-dialog";
import { graphStore } from "@/lib/flashing/store/store";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PreviewDialogContent from "./proceed-preview";
import DetailsDialogContent, { DetailsFormValues } from "./proceed-details";
import { StoredFlashing } from "@/types/flashingTypes";
import { toast } from "sonner";
import api, { fetcher } from "@/lib/axios";
import useSWR from "swr";
import { useGraphStore } from "@/lib/flashing/store/useStore";

export default function ProceedOrderDialog({
  children,
  // openDialog,
  // setOpenDialog,
}: {
  children?: ReactNode;
  // openDialog: boolean;
  // setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [proceedTabs, setProceedTabs] = useState("preview");

  const { data: fetchedMaterials } = useSWR("/a/materials/", fetcher);

  const storedFlashing = graphStore.getState().data;
  const material = useGraphStore((s) => s.material);

  const flashing: Pick<
    StoredFlashing,
    "nodes" | "startCrushFold" | "endCrushFold" | "crushFoldDir"
  > = {
    nodes: [],
    startCrushFold: storedFlashing?.startCrushFold ?? false,
    endCrushFold: storedFlashing?.endCrushFold ?? false,
    crushFoldDir: storedFlashing?.crushFoldDir ?? false,
  };

  storedFlashing?.nodes.forEach((v) =>
    flashing.nodes.push({
      node_id: v.node_id,
      top: v.y,
      left: v.x,
      next_node_id: v.next_node_id,
      prev_node_id: v.prev_node_id,
      next_line_bside_length: v.next_line_bside_length,
    }),
  );

  const onSubmitFlashing = async (data: DetailsFormValues) => {
    if (!material) {
      toast("Material not selected");
      return;
    }

    if (!flashing) {
      toast("Something went wrong");
      return;
    }
    const specs = data.specifications.map((sp) => ({
      quantity: Number(sp.quantity),
      length: Number(sp.length),
    }));

    if (
      !!specs.find(
        (sp) => sp.quantity < 1 || sp.length < 200 || sp.length > 8000,
      )
    ) {
      toast("Invalid specifications, check again");
      return;
    }

    try {
      await api.post("/a/flashing/", {
        material: material.id,
        code: data.code,
        fit_together: data.fitTogether,
        position:
          (data.position?.length ?? 0) > 0 ? data.position : "Not provided",
        specifications: specs,
        start_crush_fold: flashing.startCrushFold,
        end_crush_fold: flashing.endCrushFold,
        color_side_dir: flashing.crushFoldDir,
        tapered: !!flashing.nodes.find((n) => n.next_line_bside_length),
        nodes: flashing.nodes,
      });

      toast("Flashing added to order");

      window.location.assign("/cart");
    } catch {
      toast("Something went wrong");
    }
  };

  return (
    <Dialog
    // open={showProceedDialog}
    // onOpenChange={setShowProceedDialog}
    // modal={true}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <Tabs value={proceedTabs} onValueChange={(val) => setProceedTabs(val)}>
        <DialogContent
          showCloseButton={true}
          className="h-[calc(100%-50px)] w-[calc(100%-2rem)] max-h-200! sm:max-w-200 flex flex-col gap-2 pb-4"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="h-full relative flex flex-col overflow-hidden">
            <DialogTitle />
            <TabsContent
              className="w-full h-full flex flex-col"
              value="preview"
            >
              <PreviewDialogContent
                flashing={flashing}
                setProceedTabsVal={setProceedTabs}
              />
            </TabsContent>
            <TabsContent className="w-full h-full" value="material">
              <SelectMaterialDialogContent
                materials={fetchedMaterials}
                setProceedTabsVal={setProceedTabs}
              />
            </TabsContent>
            <TabsContent
              className="w-full h-full flex flex-col"
              value="details"
            >
              <DetailsDialogContent
                setProceedTabsVal={setProceedTabs}
                onDetailsFormSubmit={onSubmitFlashing}
              />
            </TabsContent>
          </div>
        </DialogContent>
      </Tabs>
    </Dialog>
  );
}
