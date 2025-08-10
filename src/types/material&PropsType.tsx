export interface Material {
  material: string
}

export interface ColorType {
  name: string
  code: string
}

export interface ThicknessType {
  code: string
  thickness: number
}

interface MaterialAndColor extends Material {
  colors: ColorType[]
  thicknesses?: never
}

interface MaterialAndThickness extends Material {
  thicknesses: ThicknessType[]
  color?: never
}

export type MaterialAndProps = MaterialAndColor | MaterialAndThickness

export type StoredMaterialAndProps = Material & {
  colors?: ColorType[]
  thicknesses?: ThicknessType[]
}
