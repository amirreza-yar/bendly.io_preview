import { ColorType, ThicknessType } from "./material&PropsType";

export type Node = {
  node_id: string;
  left: number;
  top: number;
  next_node_id?: string;
  prev_node_id?: string;
  next_line_bside_length?: number;
};

interface BaseFlashing {
  id: string;
  nodes: Node[];
  startCrushFold: boolean;
  endCrushFold: boolean;
  crushFoldDir: boolean;
  material: string;
  material_data: {
    name: string;
    variant_type: "color" | "thickness";
    id: number;
    label: string;
    variant: string;
  };
  createdAt: number;
  updatedAt: number;
  isDraft: boolean;
  colorSideDirection: boolean;
}

interface FlashingWithColor extends BaseFlashing {
  color: ColorType;
  thickness?: never;
}

interface FlashingWithThickness extends BaseFlashing {
  thickness: ThicknessType;
  color?: never;
}

export type Flashing = FlashingWithColor | FlashingWithThickness;

export type StoredFlashing = BaseFlashing & {
  color?: ColorType;
  thickness?: ThicknessType;
  crushFold: boolean;
  tapered: boolean;
  totalGirth: number;
  orderIdToBeSaved?: string;
};
