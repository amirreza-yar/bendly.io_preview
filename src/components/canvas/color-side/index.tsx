"use client";
import { motion } from "framer-motion";
import { ReactNode, RefObject, useEffect, useState } from "react";
import { Engine } from "@/lib/flashing/engine/engine";
import { Button } from "@/components/ui/button";
import { graphStore } from "@/lib/flashing/store/store";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { ArrowLeft, ArrowLeftToLine, ArrowUpDown } from "lucide-react";
import BaseTipModal from "../base/tip-modal";
import ProceedOrderDialog from "../base/proceed-order/proceed-dialog-base";
import { useSearchParams } from "next/navigation";
import { StoredFlashing } from "@/types/flashingTypes";
import { toast } from "sonner";
import api from "@/lib/axios";

export type ColorSideModeComponentProps = {
  onToggleColorDir: () => void;
};

export default function ColorSideModeUI({
  engine,
}: {
  engine: RefObject<Engine>;
}): ReactNode {
  const [modeProps, setModeProps] = useState<ColorSideModeComponentProps>({
    onToggleColorDir: () => {},
  });

  const next = useSearchParams().get("next");
  const flashingId = useSearchParams().get("flashingId");

  useEffect(() => {
    engine.current?.activeMode?.onUIReady?.(setModeProps);
    engine.current.renderer.centerRenderedContentAnimated();
  }, [engine]);

  const onPatchFlashing = async () => {
    const storedFlashing = graphStore.getState().data;

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

    if (!flashing || !flashingId) {
      toast("Something went wrong");
      window.location.assign("/cart");
      return;
    }

    try {
      await api.patch(`/a/flashing/${flashingId}/`, {
        start_crush_fold: flashing.startCrushFold,
        end_crush_fold: flashing.endCrushFold,
        color_side_dir: flashing.crushFoldDir,
        tapered: !!flashing.nodes.find((n) => n.next_line_bside_length),
        nodes: flashing.nodes,
      });

      toast("Flashing updated");

      window.location.assign("/cart");
    } catch {
      toast("Couldn't update flashing");
      window.location.assign("/cart");
    }
  };

  return (
    <>
      <motion.header
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { y: -12, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -12, opacity: 0 },
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <header className="z-5 fixed top-0 w-full flex flex-col">
          <div className="relative flex items-center justify-between w-full bg-background border-b-2 py-2 px-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => engine.current?.setMode("draw")}
              >
                <ArrowLeft />
              </Button>
              <p className="text-md font-semibold">Colour Side</p>
            </div>
          </div>
          <div className="px-4 pt-2 max-w-100 mx-auto">
            <Item className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md">
              <ItemContent>
                <p>
                  <span className="font-semibold">Select the colour side.</span>{" "}
                  Use the toggle to choose which side will be coloured.
                </p>
              </ItemContent>
              <ItemActions>
                <BaseTipModal
                  Icon={ArrowLeftToLine}
                  title="Color Side"
                  description="By default, the Color side is set to the outer side of the shape. Use the Toggle button to change the direction of the Color side"
                  videoSrc="/videos/tips/colorside.mp4"
                />
              </ItemActions>
            </Item>
          </div>
        </header>
      </motion.header>

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { x: -12, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -12, opacity: 0 },
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="fixed z-5 left-6 bottom-20 flex flex-col gap-3 items-center"
      >
        <Button
          className="shadow-md bg-background"
          variant="ghost"
          size="icon-lg"
          onClick={modeProps.onToggleColorDir}
        >
          <ArrowUpDown />
        </Button>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { x: -12, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -12, opacity: 0 },
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="fixed z-5 right-10 bottom-20 origin-top-left"
      >
        <div className="relative text-white rotate-90 rounded-md text-xs origin-bottom-right shadow-md">
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border-2 rounded-full border-destructive z-0"></div>

          <p className="relative px-4 mx-4 bg-destructive z-10 rounded-md">
            Color Side
          </p>
        </div>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { x: 12, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 12, opacity: 0 },
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="fixed z-5 w-full right-0 bottom-0 p-3 flex justify-center"
      >
        {next === "cart" ? (
          <Button
            size="lg"
            className="w-full max-w-100"
            onClick={onPatchFlashing}
          >
            Continue
          </Button>
        ) : (
          <ProceedOrderDialog>
            <Button size="lg" className="w-full max-w-100">
              Continue
            </Button>
          </ProceedOrderDialog>
        )}
      </motion.div>
    </>
  );
}
