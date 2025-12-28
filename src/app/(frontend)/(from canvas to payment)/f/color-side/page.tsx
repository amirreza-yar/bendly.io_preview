"use client";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import { Button } from "@/components/uikit/buttons/button";
import { IconButton } from "@/components/uikit/buttons/iconButton";
import { Canvas } from "fabric";
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  loadFlashing,
  centerDrawingGroup,
  addColorSideFlashing,
  drawingBounds,
} from "@/hooks/canvas/useFlashingLoader";
import {
  ArrowLeft,
  CircleQuestion,
  TransferVerticaly,
} from "@/components/uikit/icons";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/appDB";
import { upsertPartialFlashing } from "@/lib/db/helpers/flashingHelpers";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";

export default function ColorSidePage({
  searchParams,
}: {
  searchParams: Promise<{
    flashingId: string | undefined;
  }>;
}) {
  const router = useRouter();

  const { flashingId } = use(searchParams);

  const dexieFlashing = useLiveQuery(
    () => (flashingId ? undefined : db.flashings.get({ id: "1" })),
    [flashingId],
    null
  );

  const { data: swrFlashing } = useSWR(
    flashingId ? `/a/flashing/${flashingId}/` : null,
    fetcher
  );

  const flashing = useMemo(() => {
    if (flashingId) {
      return swrFlashing ?? null;
    }
    return dexieFlashing ?? null;
  }, [flashingId, swrFlashing, dexieFlashing]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<Canvas>(null);

  const [flashingDir, setFlashingDir] = useState<boolean>();
  const [colorSideObjsState, setColorSideObjsState] = useState([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: "#F5F5F5",
      selection: false,
    });

    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight - 220);

    canvasInstance.current = canvas;

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
        canvasInstance.current = null;
      }
    };
  }, [canvasInstance, canvasRef]);

  useEffect(() => {
    if (!flashing) return;

    if (flashingId) {
      console.log("swr flashing dir: ", flashing.color_side_dir);
      setFlashingDir(flashing.color_side_dir);
    } else {
      console.log(
        "dexie flashing dir: ",
        flashing.crushFoldDir,
        flashing.colorSideDirection,
        flashing
      );
      setFlashingDir(flashing.colorSideDirection);
    }
  }, [flashing, flashingId]);

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    if (flashing) {
      canvas.clear();

      console.log("flashing dir: ", flashingDir);

      loadFlashing(canvas, flashing);
      const { groupHeight } = drawingBounds(canvas);

      const { colorSideObjects, toggleButtonPosition } = addColorSideFlashing(
        canvas,
        flashingDir,
        flashing.startCrushFold,
        flashing.endCrushFold,
        0.8 * Math.sqrt(groupHeight),
        8 * Math.sqrt(groupHeight)
      );

      setColorSideObjsState(colorSideObjects);

      centerDrawingGroup(canvas);
    }
  }, [flashingDir, flashing]);

  const confirmColorSide = async (colorSideDir: boolean) => {
    if (flashingId && flashing) {
      console.log("colorSideDir: ", colorSideDir);
      await api.patch(`/a/flashing/${flashingId}/`, {
        color_side_dir: colorSideDir,
      });

      toast("Flashing updated");
      router.replace("/cart");
    } else {
      console.log("colorSideDir  dexie: ", colorSideDir);
      await upsertPartialFlashing("1", {
        crushFoldDir: colorSideDir,
        colorSideDirection: colorSideDir,
      });
      router.replace("/f/preview");
    }
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh]">
        <Header
          title="Color Side"
          returnHref={
            flashingId ? `/f/canvas?flashingId=${flashingId}` : "/f/canvas"
          }
        />

        <ContentWrapper className="pt-18 bg-[#f5f5f5] px-0">
          <div className="flex items-center gap-2 bg-[#D9E2FF] rounded-md px-3 py-[10.5px] mx-4">
            <h3 className="grow font-roboto text-xs/[22.5px] text-primary-dark">
              <span className="font-bold">Color side.</span> To determine the
              color side, click the toggle button
            </h3>
            <IconButton className black size="medium">
              <CircleQuestion />
            </IconButton>
          </div>
          <canvas ref={canvasRef} />
        </ContentWrapper>
        <IconButton
          black
          size="large"
          className="fixed bottom-24 left-4"
          onClick={() => setFlashingDir(!flashingDir)}
        >
          <TransferVerticaly />
        </IconButton>
        <Footer className="border-t-0 bg-[#F5F5F5]">
          <Button
            onClick={() => confirmColorSide(flashingDir)}
            className="w-full"
          >
            Finish and Continue
          </Button>
        </Footer>
      </div>
    </>
  );
}
