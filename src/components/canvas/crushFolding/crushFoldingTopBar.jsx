// // TopBar.jsx
"use client";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import { Check, Remove, XIcon } from "@/components/uikit/icons";
import { toast } from "sonner";
import { useCanvasContext } from "@/providers/canvasContextProvider";
import CancelModal from "../cancelModal";

// TopBar.jsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRemovingContext } from "@/providers/hooks_provider/removingProvider ";
import { useCrushFoldContext } from "@/providers/hooks_provider/crushFoldProvider";

// Define animation variants
const topBarVariants = {
  hidden: {
    y: "-100%", // move offscreen upward
    opacity: 0,
    transition: { type: "tween", duration: 0.25 },
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "tween", duration: 0.25 },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { type: "tween", duration: 0.2 },
  },
};

const CrushFoldingTopBar = () => {
  const { applyChanges, resetChanges } = useCrushFoldContext();
  const { isCanvasChanged , objectsZoomScale,} = useCanvasContext();

  return (
    <motion.div
      variants={topBarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 left-0 border-b-[1px] border-neutral-midlight z-50"
    >
      <div className="flex justify-between items-center bg-white h-[56px] px-0.5">
        {isCanvasChanged ? (
          <CancelModal
            onApply={() => {
              applyChanges("Changes where applied");
            }}
            onDiscard={() => {
              resetChanges("Changes where discarded");
            }}
          >
            <IconButton variant="ghost" black className="hover:bg-white">
              <XIcon />
            </IconButton>
          </CancelModal>
        ) : (
          <IconButton
            variant="ghost"
            black
            className="hover:bg-white"
            onClick={() => {
              resetChanges("Nothing was changed");
            }}
          >
            <XIcon />
          </IconButton>
        )}

        <Button
          variant="ghost"
          className="hover:bg-white disabled:border-none disabled:bg-transparent disabled:text-neutral-midlight"
          onClick={() => {
            applyChanges("Changes where applied");
          }}
          disabled={!isCanvasChanged}
        >
          Apply <Check />
        </Button>
      </div>
    </motion.div>
  );
};

export default CrushFoldingTopBar;
