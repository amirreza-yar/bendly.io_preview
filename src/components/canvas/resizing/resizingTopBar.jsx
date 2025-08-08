// // TopBar.jsx
"use client";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import { Check, XIcon } from "@/components/uikit/icons";
import { ArrowRight } from "@/components/uikit/icons";
import { useResizingContext } from "@/providers/hooks_provider/resizingProvider";
import { toast } from "sonner";
import { useCanvasContext } from "@/providers/canvasContextProvider";

// TopBar.jsx
import { motion} from "framer-motion";

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

const ResizingTopBar = () => {
  const { setIsResizingDrawerOpen } = useResizingContext();
  const { setIsResizing , objectsZoomScale,} = useCanvasContext();

  const handleClose = () => {
    setIsResizingDrawerOpen(false);
    setIsResizing(false);
    toast("Nothing was changed");
  };

  return (
    <motion.div
      variants={topBarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 left-0 border-b-[1px] border-neutral-midlight z-50"
    >
      <div className="flex justify-between items-center bg-white h-[56px] px-0.5">
        <IconButton
          variant="ghost"
          black
          className="hover:bg-white"
          onClick={handleClose}
        >
          <XIcon />
        </IconButton>

        <IconButton
          variant="ghost"
          black
          className="hover:bg-white"
          onClick={handleClose}
        >
          <Check />
        </IconButton>
      </div>
    </motion.div>
  );
};

export default ResizingTopBar;
