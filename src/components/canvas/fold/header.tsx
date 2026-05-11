import { CrushFold } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { Check, X } from "lucide-react";
import { CancelAlertDialog } from "@/components/canvas/base/cancel-alert";
import { FoldModeComponentProps } from ".";
import BaseTipModal from "../base/tip-modal";

export default function FoldModeHeader({
  componentProps,
  onSave,
  onCancel,
}: {
  componentProps: FoldModeComponentProps;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <header className="z-5 fixed top-0 w-full flex flex-col">
      <div className="relative flex items-center justify-between w-full bg-background border-b-2 py-2 px-2">
        <div className="flex items-center gap-2">
          {componentProps.canApply ? (
            <CancelAlertDialog onAction={onSave} onCancel={onCancel}>
              <Button variant="ghost" size="icon-lg">
                <X />
              </Button>
            </CancelAlertDialog>
          ) : (
            <Button variant="ghost" size="icon-lg" onClick={onCancel}>
              <X />
            </Button>
          )}
          <p className="text-md font-semibold">Crush Fold</p>
        </div>

        <Button
          variant="ghost"
          size="lg"
          disabled={!componentProps.canApply}
          onClick={onSave}
        >
          Apply Crush Fold
          <Check />
        </Button>
      </div>
      <div className="px-4 pt-2 max-w-100 mx-auto">
        <Item className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md">
          <ItemContent>
            <p>Select the start or end point to apply a crush fold.</p>
          </ItemContent>
          <ItemActions>
            <BaseTipModal
              Icon={CrushFold}
              title="Crush Fold"
              description="To add a Fold to the shape you’ve drawn, select the circles at the start or end of the shape. Use the Toggle button to change the Fold’s direction"
              videoSrc="/videos/tips/fold.mp4"
            />
          </ItemActions>
        </Item>
      </div>
    </header>
  );
}
