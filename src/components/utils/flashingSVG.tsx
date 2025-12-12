"use client";
import { StoredFlashing } from "@/types/flashingTypes";
import { StoredOrderFlashing } from "@/types/orderTypes";

const PATH3DCOEFF = 0.35;

function calculateLines(nodes: StoredFlashing["nodes"]) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.node_id, n]));
  const lines = [];
  const visited = new Set();

  for (const node of nodes) {
    if (node.next_node_id) {
      const a = node.node_id;
      const b = node.next_node_id;
      const key = [a, b].sort().join("-"); // prevent duplicates

      if (!visited.has(key)) {
        visited.add(key);

        const n1 = nodeMap[a];
        const n2 = nodeMap[b];

        const dx = n2.left - n1.left;
        const dy = n2.top - n1.top;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // degrees

        lines.push({ from: a, to: b, length, angle });
      }
    }
  }

  // Find the longest line
  const longestLine = lines.reduce(
    (max, l) => (l.length > max.length ? l : max),
    lines[0]
  );

  return { lines, longestLine };
}

function createPathD(nodes: StoredFlashing["nodes"]) {
  // Create a lookup table for fast access
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.node_id, n]));

  // Find the starting node (the one with no prev_node_id)
  const startNode = nodes.find((n) => !n.prev_node_id);
  if (!startNode) {
    console.error("No starting node found (missing prev_node_id).");
    return "";
  }

  // Traverse the linked nodes and build path commands
  let d = `M ${startNode.left} ${startNode.top}`;
  let current = startNode;

  while (current.next_node_id) {
    const next = nodeMap[current.next_node_id];
    if (!next) break;
    d += ` L ${next.left} ${next.top}`;
    current = next;
  }

  return d;
}

function generate3DPaths(
  nodes: StoredFlashing["nodes"],
  offset = 200,
  coeff = PATH3DCOEFF
): { from: string; to: string; d: string }[] {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.node_id, n]));
  const visited = new Set<string>();
  const paths: { from: string; to: string; d: string }[] = [];

  for (const node of nodes) {
    if (!node.next_node_id) continue;
    const a = node;
    const b = nodeMap[node.next_node_id];
    if (!b) continue;

    // Prevent duplicates
    const key = [a.node_id, b.node_id].sort().join("-");
    if (visited.has(key)) continue;
    visited.add(key);

    // Calculate offset points
    const aOffsetX = a.left + offset;
    const aOffsetY = a.top - offset * coeff;
    const bOffsetX = b.left + offset;
    const bOffsetY = b.top - offset * coeff;

    // Construct path string
    const d = `M ${a.left} ${a.top} L ${aOffsetX} ${aOffsetY} L ${bOffsetX} ${bOffsetY} L ${b.left} ${b.top} Z`;

    paths.push({
      from: a.node_id,
      to: b.node_id,
      d,
    });
  }

  return paths;
}

function getNodeBounds(
  nodes: StoredFlashing["nodes"],
  offset: number,
  path3DOffset: number
) {
  if (!nodes.length) {
    throw new Error("Node list is empty.");
  }

  const lefts = nodes.map((n) => n.left);
  const tops = nodes.map((n) => n.top);

  const minLeft = Math.min(...lefts);
  const maxLeft = Math.max(...lefts);
  const minTop = Math.min(...tops);
  const maxTop = Math.max(...tops);
  // console.log('max top/left: ', maxTop, maxLeft)

  return `${Math.round(minLeft - offset / 2)} ${Math.round(
    minTop - offset / 2 - path3DOffset * PATH3DCOEFF
  )} ${Math.round(maxLeft - minLeft + offset + path3DOffset)} ${Math.round(
    maxTop - minTop + offset + path3DOffset * PATH3DCOEFF
  )}`;
}

function genStartCrushFoldCoor(
  nodes: StoredFlashing["nodes"],
  crushFoldOffset: number,
  crushFoldDir: boolean
) {
  const { lines } = calculateLines(nodes);

  const M = {
    top: nodes[0].top,
    left: nodes[0].left,
  };

  const A1 = {
    left: M.left - crushFoldOffset * Math.cos((lines[0].angle * Math.PI) / 180),
    top: M.top - crushFoldOffset * Math.sin((lines[0].angle * Math.PI) / 180),
  };

  const A2 = {
    left:
      A1.left +
      crushFoldOffset *
        Math.cos(
          ((lines[0].angle + 90 * (crushFoldDir ? 1 : -1)) * Math.PI) / 180
        ),
    top:
      A1.top +
      crushFoldOffset *
        Math.sin(
          ((lines[0].angle + 90 * (crushFoldDir ? 1 : -1)) * Math.PI) / 180
        ),
  };

  const A3 = {
    left:
      M.left +
      crushFoldOffset *
        Math.cos(
          ((lines[0].angle + 90 * (crushFoldDir ? 1 : -1)) * Math.PI) / 180
        ),
    top:
      M.top +
      crushFoldOffset *
        Math.sin(
          ((lines[0].angle + 90 * (crushFoldDir ? 1 : -1)) * Math.PI) / 180
        ),
  };

  const A4 = {
    left:
      A3.left +
      (crushFoldOffset / 2) * Math.cos((lines[0].angle * Math.PI) / 180),
    top:
      A3.top +
      (crushFoldOffset / 2) * Math.sin((lines[0].angle * Math.PI) / 180),
  };

  return `M ${M.left} ${M.top} C ${A1.left} ${A1.top} ${A2.left} ${A2.top} ${A3.left} ${A3.top} L ${A4.left} ${A4.top}`;
}

function genEndCrushFoldCoor(
  nodes: StoredFlashing["nodes"],
  crushFoldOffset: number,
  crushFoldDir: boolean
) {
  const { lines } = calculateLines(nodes);

  const M = {
    top: nodes[nodes.length - 1].top,
    left: nodes[nodes.length - 1].left,
  };

  const A1 = {
    left:
      M.left +
      crushFoldOffset *
        Math.cos((lines[lines.length - 1].angle * Math.PI) / 180),
    top:
      M.top +
      crushFoldOffset *
        Math.sin((lines[lines.length - 1].angle * Math.PI) / 180),
  };

  const A2 = {
    left:
      A1.left +
      crushFoldOffset *
        Math.cos(
          ((lines[lines.length - 1].angle + 90 * (crushFoldDir ? 1 : -1)) *
            Math.PI) /
            180
        ),
    top:
      A1.top +
      crushFoldOffset *
        Math.sin(
          ((lines[lines.length - 1].angle + 90 * (crushFoldDir ? 1 : -1)) *
            Math.PI) /
            180
        ),
  };

  const A3 = {
    left:
      M.left +
      crushFoldOffset *
        Math.cos(
          ((lines[lines.length - 1].angle + 90 * (crushFoldDir ? 1 : -1)) *
            Math.PI) /
            180
        ),
    top:
      M.top +
      crushFoldOffset *
        Math.sin(
          ((lines[lines.length - 1].angle + 90 * (crushFoldDir ? 1 : -1)) *
            Math.PI) /
            180
        ),
  };

  const A4 = {
    left:
      A3.left -
      (crushFoldOffset / 2) *
        Math.cos((lines[lines.length - 1].angle * Math.PI) / 180),
    top:
      A3.top -
      (crushFoldOffset / 2) *
        Math.sin((lines[lines.length - 1].angle * Math.PI) / 180),
  };

  return `M ${M.left} ${M.top} C ${A1.left} ${A1.top} ${A2.left} ${A2.top} ${A3.left} ${A3.top} L ${A4.left} ${A4.top}`;
}

export default function FlashingSVG({
  flashing,
  className,
  strokeWidthCoeff = 40,
  crushFoldOffsetCoeff = 1,
  path3DOffsetCoeff = 1.2,
}: {
  flashing: StoredFlashing;
  className?: string;
  strokeWidthCoeff?: number;
  crushFoldOffsetCoeff?: number;
  path3DOffsetCoeff?: number;
}) {
  // console.log(flashing.nodes)

  const { lines, longestLine } = calculateLines(flashing.nodes);
  const path3DOffset = longestLine.length * path3DOffsetCoeff;
  const svgOffset = longestLine.length / 15;

  const strokeWidth = Math.round(longestLine.length / strokeWidthCoeff);

  const crushFoldOffset = svgOffset * crushFoldOffsetCoeff;

  return (
    <>
      <svg
        viewBox={getNodeBounds(flashing.nodes, svgOffset, path3DOffset)}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {generate3DPaths(flashing.nodes, path3DOffset).map((path, index) => (
          <path
            id={`3Dpath-${index}`}
            key={`3Dpath-${index}`}
            d={path.d}
            strokeWidth={strokeWidth / 2}
            strokeLinecap="round"
            fill="rgba(200, 200, 200, 0.18)"
            strokeLinejoin="round"
            stroke="#cbd5df"
          />
        ))}

        <path
          d={createPathD(flashing.nodes)}
          stroke="#262626ee"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {(flashing.startCrushFold || flashing.start_crush_fold) && (
          <path
            d={genStartCrushFoldCoor(
              flashing.nodes,
              crushFoldOffset,
              flashing.crushFoldDir
            )}
            stroke="#262626"
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {(flashing.endCrushFold || flashing.end_crush_fold) && (
          <path
            d={genEndCrushFoldCoor(
              flashing.nodes,
              crushFoldOffset,
              flashing.crushFoldDir
            )}
            stroke="#262626"
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </>
  );
}
