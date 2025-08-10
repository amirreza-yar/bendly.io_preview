// // TopBar.jsx
"use client";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import { Check, XIcon } from "@/components/uikit/icons";
import { toast } from "sonner";
import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider";
import CancelModal from "../cancelModal";

// TopBar.jsx
import { motion } from "framer-motion";
import { useMovingContext } from "@/providers/canvas_providers/movingProvider";
import { Button } from "@/components/ui/button";

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

const MovingTopBar = () => {
  const { applyChanges, resetChanges } = useMovingContext();
  const { setIsMoving, isCanvasChanged , objectsZoomScale,} = useCanvasContext();

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
              applyChanges();
              setIsMoving(false);
              toast("Changes where applied");
            }}
            onDiscard={() => {
              resetChanges();
              setIsMoving(false);
              toast("Changes where discarded");
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
              setIsMoving(false);
              toast("Nothing was changed");
            }}
          >
            <XIcon />
          </IconButton>
        )}

        <Button
          variant="ghost"
          className="hover:bg-white disabled:border-none disabled:bg-transparent disabled:text-neutral-midlight"
          onClick={() => {
            applyChanges();
            toast("Changes where applied");
            setIsMoving(false);
          }}
          disabled={!isCanvasChanged}
        >
          Apply <Check />
        </Button>
      </div>
    </motion.div>
  );
};

export default MovingTopBar;
