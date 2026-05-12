"use client";
import { useEffect, useRef, useState } from "react";
import { Engine } from "@/lib/flashing/engine/engine";
import { DrawMode } from "@/lib/flashing/engine/modes/draw";
import { graphStore } from "@/lib/flashing/store/store";
import { useGraphStore } from "@/lib/flashing/store/useStore";
import { Node } from "@/lib/flashing/types/types";
import ModeComponent from "@/lib/flashing/components/mode";
import { PolygonAlertDialog } from "@/components/canvas/base/polygon-alert";
import CanvasLoader from "@/components/canvas/base/canvas-loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";

const demoData: Node[] = [
  {
    node_id: "gwomd9",
    x: 100,
    y: 350,
    next_node_id: "9rnao4",
  },
  {
    node_id: "9rnao4",
    x: 50,
    y: 500,
    prev_node_id: "gwomd9",
    next_node_id: "jeq3bi",
    next_line_bside_length: 300,
  },
  {
    node_id: "jeq3bi",
    x: 150,
    y: 500,
    prev_node_id: "9rnao4",
    next_node_id: "6jagob",
  },
  {
    node_id: "6jagob",
    x: 200,
    y: 400,
    prev_node_id: "jeq3bi",
    next_node_id: "b7lk16",
  },
  {
    node_id: "b7lk16",
    x: 150,
    y: 350,
    prev_node_id: "6jagob",
  },
];

export default function MainGraphPageComponent({
  flashing,
}: {
  flashing:
    | {
        nodes: Node[];
        start_crush_fold: boolean;
        end_crush_fold: boolean;
        color_side_dir: boolean;
      }
    | undefined;
}) {
  const returnPage = useSearchParams().get("return");

  const containerRef = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine>(null);

  const engineReady = useGraphStore((s) => s.engineReady);
  const openPolygonAlert = useGraphStore((s) => s.openPolygonAlert);

  useEffect(() => {
    // console.log("Loading canvas...");

    const prevent = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);
    document.addEventListener("gestureend", prevent);

    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
      // console.log("Canvas destroyed....");
    };
  }, []);

  useEffect(() => {
    // console.log("Loading canvas engine....");

    if (!containerRef.current) return;

    const eng = new Engine(containerRef.current);
    const drawMode = new DrawMode();

    eng.setMode(drawMode);
    // eng.setMode('color-side');

    engine.current = eng;

    // initialize some data
    graphStore.setState({
      data: {
        nodes: flashing
          ? new Map<string, Node>(
              flashing.nodes.map((n: Node) => [n.node_id, n]),
            )
          : new Map(),
        // nodes: new Map(),
        startCrushFold: flashing?.start_crush_fold ?? false,
        endCrushFold: flashing?.end_crush_fold ?? false,
        crushFoldDir: flashing?.color_side_dir ?? false,
      },
    });

    return () => {
      eng.destroy();
      // console.log("Canvas engine destroyed....");
    };
  }, [flashing]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => {
      setShowModal(true);

      history.pushState(null, "", location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!engineReady ? (
        <CanvasLoader />
      ) : (
        <>
          <ModeComponent engine={engine} />
          <PolygonAlertDialog openPolygonAlert={openPolygonAlert} />
        </>
      )}

      {/* <WelcomeDialog /> */}

      <div
        ref={containerRef}
        className="canvas-root bg-secondary/30"
        style={{ width: "100vw", height: "100vh", zIndex: "auto" }}
      />

      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              The modifications have not been applied. If you discard, these
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <a href={returnPage === "cart" ? "/cart" : "/dashboard"}>
                Discard Changes
              </a>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowModal(false)}>
              Stay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
