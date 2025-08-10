export const materialsWithProperties = [
  // Materials that can be colorized (have colors, no thickness)
  {
    material: 'Pre-painted steel',
    colors: [
      { name: 'Monument', code: '#504A4B' },
      { name: 'Surfmist', code: '#ECE7E1' },
      { name: 'Shale Grey', code: '#7D7D7D' },
      { name: 'Woodland Grey', code: '#5C6A6A' },
      { name: 'Manor Red', code: '#8B3A3A' },
      { name: 'Paperbark', code: '#D2C6B6' },
      { name: 'Basalt', code: '#2F353B' },
      { name: 'Bluegum', code: '#1B4D6A' },
      { name: 'Cottage Green', code: '#596E57' },
      { name: 'Deep Ocean', code: '#002E4D' },
    ],
  },
  {
    material: 'Aluminium',
    colors: [
      { name: 'Matte Black', code: '#1C1C1C' },
      { name: 'White', code: '#F5F5F5' },
      { name: 'Silver Metallic', code: '#C0C0C0' },
      { name: 'Bronze', code: '#CD7F32' },
      { name: 'Champagne', code: '#F7E7CE' },
      { name: 'Copper', code: '#B87333' },
      { name: 'Charcoal', code: '#36454F' },
      { name: 'Heritage Red', code: '#7C0A02' },
      { name: 'Cream', code: '#FFFDD0' },
      { name: 'Bluegum', code: '#1B4D6A' },
    ],
  },
  {
    material: 'PVC-coated steel',
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#F5F5F5' },
      { name: 'Dark Brown', code: '#4B3621' },
      { name: 'Light Grey', code: '#D3D3D3' },
      { name: 'Green', code: '#008000' },
    ],
  },
  {
    material: 'Anodised aluminium',
    colors: [
      { name: 'Natural Silver', code: '#C0C0C0' },
      { name: 'Champagne', code: '#F7E7CE' },
      { name: 'Bronze', code: '#CD7F32' },
      { name: 'Gold', code: '#FFD700' },
      { name: 'Black', code: '#000000' },
    ],
  },
  {
    material: 'Copper',
    colors: [
      { name: 'Natural Copper', code: '#B87333' },
      { name: 'Brown Patina', code: '#5C4033' },
      { name: 'Green Patina', code: '#56806F' },
      { name: 'Anthra', code: '#3B3B3B' },
    ],
  },
  {
    material: 'Zinc',
    colors: [
      { name: 'Natural Grey', code: '#7D7D7D' },
      { name: 'Quartz-Zinc', code: '#A9A9A9' },
      { name: 'Anthra-Zinc', code: '#3B3B3B' },
    ],
  },

  // Materials that have thickness options but no colors
  {
    material: 'Stainless steel',
    thicknesses: [
      { code: 'SS304-05', thickness: 0.5 },
      { code: 'SS304-08', thickness: 0.8 },
      { code: 'SS304-10', thickness: 1.0 },
      { code: 'SS316L-05', thickness: 0.5 },
      { code: 'SS316L-10', thickness: 1.0 },
      { code: 'SS316L-15', thickness: 1.5 },
    ],
  },
  {
    material: 'Galvanised steel',
    thicknesses: [
      { code: 'GS-04', thickness: 0.4 },
      { code: 'GS-05', thickness: 0.5 },
      { code: 'GS-06', thickness: 0.6 },
    ],
  },
  {
    material: 'Aluminium (unpainted)',
    thicknesses: [
      { code: 'AL-10', thickness: 1.0 },
      { code: 'AL-15', thickness: 1.5 },
      { code: 'AL-20', thickness: 2.0 },
    ],
  },
]
