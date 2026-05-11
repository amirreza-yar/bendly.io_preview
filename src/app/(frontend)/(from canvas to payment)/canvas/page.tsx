import { Node } from "@/lib/flashing/types/types";
import MainGraphPageComponent from "@/components/canvas/main-page";
import { decompressFromEncodedURIComponent } from "lz-string";
import { Flashing } from "@/types/api";

export default async function GraphPage({
  searchParams,
}: {
  searchParams: Promise<{ flashing: string }>;
}) {
  const codedFlashing = (await searchParams).flashing;

  const decodedFlashing: Flashing | undefined = codedFlashing
    ? JSON.parse(decompressFromEncodedURIComponent(codedFlashing)!)
    : undefined;

  const flashing:
    | {
        nodes: Node[];
        start_crush_fold: boolean;
        end_crush_fold: boolean;
        color_side_dir: boolean;
      }
    | undefined = decodedFlashing
    ? {
        nodes: decodedFlashing.nodes.map((n) => ({
          node_id: n.node_id,
          x: n.left,
          y: n.top,
          prev_node_id: n.prev_node_id,
          next_node_id: n.next_node_id,
          next_line_bside_length: n.next_line_bside_length,
        })),
        start_crush_fold: decodedFlashing.start_crush_fold,
        end_crush_fold: decodedFlashing.end_crush_fold,
        color_side_dir: decodedFlashing.color_side_dir,
      }
    : undefined;

  return <MainGraphPageComponent flashing={flashing} />;
}
