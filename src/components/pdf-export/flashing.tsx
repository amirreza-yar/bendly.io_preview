import { Image, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Node } from "@/types/api";

import { Canvg } from "canvg";
import { useEffect, useRef, useState } from "react";

export async function svgToPngDataUrl(
  svgElement: SVGSVGElement,
  scale = 1,
  maxSize = 2000,
) {
  const svgData = new XMLSerializer().serializeToString(svgElement);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  const viewBox = svgElement.viewBox.baseVal;

  let width = viewBox.width * scale;
  let height = viewBox.height * scale;

  // Clamp large exports
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);

    width *= ratio;
    height *= ratio;

    scale *= ratio;
  }

  canvas.width = Math.round(width);
  canvas.height = Math.round(height);

  ctx.scale(scale, scale);

  const v = await Canvg.from(ctx, svgData);

  await v.render();

  return canvas.toDataURL("image/png");
}

const getSVG2PNGURL = async (id: string | number) => {
  const svgEl = document.getElementById(`flashing-svg-${flash.id}`);
  // ) as SVGSVGElement;

  const png = await svgToPngDataUrl(svgEl);
};

export default function InvoiceFlashingPDF({
  flash,
}: {
  flash: {
    id: string | number;
    code: string;
    material: string;
    total_girth: string;
    details: {
      quantity: number;
      length: number;
      cost: number;
    }[];
    nodes: (
      | {
          node_id: string;
          left: number;
          top: number;
          next_node_id: string;
        }
      | {
          node_id: string;
          left: number;
          top: number;
          prev_node_id: string;
          next_node_id: string;
        }
      | {
          node_id: string;
          left: number;
          top: number;
          prev_node_id: string;
        }
      | Node
    )[];
    start_crush_fold: boolean;
    end_crush_fold: boolean;
    color_side_dir: boolean;
    tapered: boolean;
  };
}) {
  const [png, setPng] = useState<string>();

  useEffect(() => {
    async function generatePng() {
      const svgEl = document.getElementById(
        `flashing-svg-${flash.id}`,
      ) as SVGSVGElement | null;

      if (!svgEl) return;

      const pngData = await svgToPngDataUrl(svgEl);

      setPng(pngData);
    }

    generatePng();
  }, [flash]);

  console.log(png)

  return (
    <View
      style={[
        styles.radiusL,
        styles.bgWhite,
        styles.flexRow,
        styles.borderDark,
        { padding: "12 15", minHeight: 190 },
      ]}
    >
      <View
        style={[
          styles.flexCol,
          { gap: 12, paddingTop: 5, paddingLeft: 4, width: "60%" },
        ]}
      >
        <Text style={[styles.textMD, { paddingLeft: "13px" }]}>
          {flash.code}
        </Text>

        <View style={[styles.flexRow, styles.alignStart]}>
          <View
            style={[
              styles.flexCol,
              styles.justifyCenter,
              styles.alignCenter,
              { gap: 6 },
            ]}
          >
            <Text
              style={[
                styles.textXS,
                styles.textSubtle,
                styles.bgSlate,
                { padding: "4 16", borderTopLeftRadius: 8 },
              ]}
            >
              Quantity
            </Text>
            {flash.details.map((spec, index) => (
              <Text key={index} style={[styles.textSM, { padding: "0 2" }]}>
                {spec.quantity} pcs
              </Text>
            ))}
          </View>
          <View
            style={[
              styles.flexCol,
              styles.justifyCenter,
              styles.alignCenter,
              { gap: 6 },
            ]}
          >
            <Text
              style={[
                styles.textXS,
                styles.textSubtle,
                styles.bgSlate,
                { padding: "4 20" },
              ]}
            >
              Length
            </Text>
            {flash.details.map((spec, index) => (
              <Text key={index} style={[styles.textSM, { padding: "0 2" }]}>
                {spec.length.toFixed(0)} mm
              </Text>
            ))}
          </View>

          <View style={[styles.flexCol, styles.alignCenter, { gap: 6 }]}>
            <Text
              style={[
                styles.textXS,
                styles.textSubtle,
                styles.bgSlate,
                { padding: "4 24" },
              ]}
            >
              Material
            </Text>
            <Text
              style={[
                styles.textSM,
                { padding: "0 4", maxWidth: "80px", textAlign: "center" },
              ]}
            >
              {flash.material}
            </Text>
          </View>

          <View
            style={[
              styles.flexCol,
              styles.alignCenter,
              { gap: 6, maxWidth: "100px" },
            ]}
          >
            <Text
              style={[
                styles.textXS,
                styles.textSubtle,
                styles.bgSlate,
                { padding: "4 24" },
              ]}
            >
              Total Girth
            </Text>
            <Text style={[styles.textSM, { padding: "0 4" }]}>
              {flash.total_girth} mm
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          {
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Image
          src={png}
          style={{
            width: "100%",
            paddingHorizontal: 10,
          }}
        />
      </View>
    </View>
  );
}
