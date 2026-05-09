import FlashingSVG from "../utils/flashingSVG";
import { Template } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default async function RecentTemplateCard({
  template,
  ...props
}: { template: Template } & ComponentProps<"div">) {
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
            <Button>
              <Plus />
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
