export type CirclePosition = {
  x1: number
  y1: number
}

type ObjectType = 'circle' | 'line'

interface Object {
  type: ObjectType
}

export type LinePosition = {
  x1: number // Each end of Line should be relevant to ints node Circle position
  y1: number // Each end of Line should be relevant to ints node Circle position
  x2: number // Each end of Line should be relevant to ints node Circle position
  y2: number // Each end of Line should be relevant to ints node Circle position
}

export interface Circle extends Object {
  position: CirclePosition // Position of the Circle on page
  line1?: Line // A Circle must have at least one line
  line2?: Line // A Circle must have at least one line
  hasCrushFold: boolean // Is this node crush folded or not
}

export interface Line {
  position: LinePosition // Position of the Line on page
  circle1: Circle // A Line must have circle on both ends
  circle2: Circle // A Line must have circle on both ends
  bSideLineLength?: number // Is this Line tapered or not
}

export interface Canvas {
  objects: Circle[] & Line[] // A Canvas contains objects and those could be Circle and Line
  crushFoldDirection: boolean // Canvas represet the crush fold direction as a boolean field
  colorSideDirection: boolean // Canvas represet the color sie direction as a boolean field
}
