import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
import FlashingSVG from "@/components/utils/flashingSVG";
import { Node, StoredFlashing } from "@/types/flashingTypes";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function getTotalGirth(nodes: Node[]) {
  if (!Array.isArray(nodes)) return;
  if (nodes.length === 0) return 0;

  const nodeMap = nodes.reduce((acc, n) => {
    // @ts-expect-error its ok
    acc[n.node_id] = n;
    return acc;
  }, {});

  let current = nodes.find((n) => !n.prev_node_id);
  if (!current) return 0;

  let total = 0;
  const visited = new Set();

  while (current && current.next_node_id && !visited.has(current.node_id)) {
    visited.add(current.node_id);

    // @ts-expect-error its ok
    const next = nodeMap[current.next_node_id];
    if (!next) break;

    const dx = next.left - current.left;
    const dy = next.top - current.top;
    total += Math.hypot(dx, dy); // cleaner Euclidean distance

    current = next;
  }

  return Math.round(total);
}

const saveTemplateFormSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(29, "Name must be at most 30 characters"),
});

export default function PreviewDialogContent({
  setProceedTabsVal,
  flashing,
}: {
  setProceedTabsVal: Dispatch<SetStateAction<string>>;
  flashing: Pick<
    StoredFlashing,
    "nodes" | "startCrushFold" | "endCrushFold" | "crushFoldDir"
  >;
}) {
  const [viewMode, setViewMode] = useState("3D");

  const saveTemplateForm = useForm<z.infer<typeof saveTemplateFormSchema>>({
    resolver: zodResolver(saveTemplateFormSchema),
    defaultValues: { name: "" },
  });

  const handleSaveTemplate = async (
    data: z.infer<typeof saveTemplateFormSchema>,
  ) => {
    try {
      await api.post("/a/template/", {
        name: data.name,
        start_crush_fold: flashing?.startCrushFold,
        end_crush_fold: flashing?.endCrushFold,
        color_side_dir: flashing?.crushFoldDir,
        tapered: !!flashing.nodes.find((n) => n.next_line_bside_length),
        nodes: flashing?.nodes,
      });
      toast("Template saved");
    } catch {
      toast("Couldn't save template");
    }
  };

  const foldReversedFlashing = {
    nodes: flashing.nodes,
    startCrushFold: flashing.startCrushFold,
    endCrushFold: flashing.endCrushFold,
    crushFoldDir: !flashing.crushFoldDir,
  };

  return (
    <>
      <div className="absoulte top-0 left-0 flex items-center gap-2">
        View
        <div className="rounded-lg border p-0.5 flex items-center">
          <Button
            className="rounded-md"
            size="xs"
            variant={viewMode === "2D" ? "ghost" : "default"}
            onClick={() => setViewMode("3D")}
          >
            3D
          </Button>
          <Button
            className="rounded-md"
            size="xs"
            variant={viewMode === "2D" ? "default" : "ghost"}
            onClick={() => setViewMode("2D")}
          >
            2D
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full h-full pb-18">
        <div className="px-6 max-h-100 max-w-120 mx-auto grow py-4 flex items-center justify-center">
          <FlashingSVG
            path3DOffsetCoeff={viewMode === "2D" ? 0 : 1.5}
            // @ts-expect-error incompatible flashing accross comps
            flashing={foldReversedFlashing}
            className="w-full self-center"
          />
        </div>
        <p className="rounded-xl border px-4 py-2">
          Crush Fold:{" "}
          {flashing.startCrushFold || flashing.endCrushFold ? "Yes" : "No"}
        </p>
        <p className="rounded-xl border px-4 py-2">
          Tapered:{" "}
          {flashing.nodes.find((n) => n.next_line_bside_length) ? "Yes" : "No"}
        </p>
        <p className="rounded-xl border px-4 py-2">
          Total Girth: {getTotalGirth(flashing.nodes)} mm
        </p>
      </div>

      <DialogFooter className="bg-background border-t pt-4 absolute bottom-0 w-full">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-fit sm:justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary"
                onClick={() => setProceedTabsVal("preview")}
              >
                Save as template
              </Button>
            </DialogTrigger>
            <DialogContent className="z-100">
              <DialogTitle className="text-base">
                Enter template name
              </DialogTitle>
              <form
                onSubmit={saveTemplateForm.handleSubmit(handleSaveTemplate)}
              >
                <Controller
                  control={saveTemplateForm.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="text-center text-sm rounded-full"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <DialogFooter className="pt-6">
                  <Button type="submit" asChild>
                    <DialogClose>Save</DialogClose>
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            size="lg"
            onClick={() => {
              setProceedTabsVal("material");
            }}
          >
            Continue
            <ArrowRight />
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
