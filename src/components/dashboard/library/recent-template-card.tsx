import FlashingSVG from "../../utils/flashingSVG";
import { Template } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ComponentProps } from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { compressToEncodedURIComponent } from "lz-string";

export default async function RecentTemplateCard({
  template,
  ...props
}: { template: Template } & ComponentProps<"div">) {
  const compressedFlashing = () => {
    const flash = {
      nodes: template.nodes,
      start_crush_fold: template.start_crush_fold,
      end_crush_fold: template.end_crush_fold,
      color_side_dir: template.color_side_dir,
    };

    return compressToEncodedURIComponent(JSON.stringify(flash));
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="flex flex-col gap-1.5 justify-center rounded-xl p-2 pt-1 border"
          {...props}
        >
          <FlashingSVG
            flashing={{
              nodes: template.nodes,
              startCrushFold: template.start_crush_fold,
              endCrushFold: template.end_crush_fold,
              colorSideDirection: template.color_side_dir,
            }}
            className="h-20 md:h-25 w-full mx-auto px-1 py-1.5"
          />

          <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
            {template.name}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <FlashingSVG
            flashing={{
              nodes: template.nodes,
              startCrushFold: template.start_crush_fold,
              endCrushFold: template.end_crush_fold,
              colorSideDirection: template.color_side_dir,
            }}
            className="h-30 md:h-40 w-full mx-auto px-1 py-1.5 md:px-2 md:py-3 mb-2"
          />

          <p className="w-full text-center caption-small px-2 py-1 border rounded-full truncate">
            {template.name}
          </p>

          <div className="flex justify-center gap-3 pt-4 px-4">
            <Button asChild>
              <a href={`/canvas?flashing=${compressedFlashing()}`}>
                <Plus />
                Add to Order
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
