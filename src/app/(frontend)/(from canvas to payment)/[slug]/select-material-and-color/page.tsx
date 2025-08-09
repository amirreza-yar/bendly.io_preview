'use client'
import type { Metadata } from 'next'
import { notFound, redirect, RedirectType } from 'next/navigation'
import { ArrowLeft, FeaturedCheckSmall, FeaturedSuccess } from '@/components/uikit/icons'
import ShippingForm from '@/components/dashboard/order/ShippingForm'
import FlashingForm from '@/components/dashboard/order/DetailsForm'
import Link from 'next/link'
import { Button } from '@/components/uikit/buttons/button'
import { Label } from '@/components/dashboard/material&color/label'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from '@/components/dashboard/material&color/radioGroup'
import { Colors, Materials } from './materials-and-color'
import { Header } from '@/components/dashboard/header'
import { Footer } from '@/components/dashboard/footer'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/dashboard/material&color/tabs'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/uikit/form'
import { cn } from '@/utilities/ui'
import { useNewFlashingContext } from '@/providers/data_providers/flashing_providers/NewFlashingContext'

const materialsWithProperties = [
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

// Extract all material names for basic validation:
const materialNames = materialsWithProperties.map((m) => m.material)

// Helper function to get allowed colors for a material:
function getColorNames(material: string) {
  const mat = materialsWithProperties.find((m) => m.material === material)
  return mat?.colors?.map((c) => c.name) || []
}

// Helper function to get allowed thickness codes for a material:
function getThicknessCodes(material: string) {
  const mat = materialsWithProperties.find((m) => m.material === material)
  return mat?.thicknesses?.map((t) => t.code) || []
}

const FormSchema = z
  .object({
    material: z.string().refine((val) => materialNames.includes(val), {
      message: 'Invalid material',
    }),
    color: z.string().optional(),
    thickness: z.string().optional(),
  })
  .superRefine(({ material, color, thickness }, ctx) => {
    const hasColors = !!materialsWithProperties.find((m) => m.material === material)?.colors
    const hasThicknesses = !!materialsWithProperties.find((m) => m.material === material)
      ?.thicknesses

    if (hasColors) {
      if (!color) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['color'],
          message: 'Color is required for selected material',
        })
      } else if (!getColorNames(material).includes(color)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['color'],
          message: 'Invalid color for selected material',
        })
      }
      // Thickness should be empty if colors exist
      if (thickness) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['thickness'],
          message: 'Thickness should not be selected for this material',
        })
      }
    } else if (hasThicknesses) {
      if (!thickness) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['thickness'],
          message: 'Thickness is required for selected material',
        })
      } else if (!getThicknessCodes(material).includes(thickness)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['thickness'],
          message: 'Invalid thickness for selected material',
        })
      }
      // Color should be empty if thicknesses exist
      if (color) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['color'],
          message: 'Color should not be selected for this material',
        })
      }
    } else {
      // Material has neither colors nor thicknesses (rare case)
      if (color) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['color'],
          message: 'Color should not be selected for this material',
        })
      }
      if (thickness) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['thickness'],
          message: 'Thickness should not be selected for this material',
        })
      }
    }
  })

type FormValues = z.infer<typeof FormSchema>

export default function SelectMaterialAndColorPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })

  const { newFlashing, setNewFlashing } = useNewFlashingContext()

  console.log(newFlashing.flashingId)

  const selectedColor = form.watch('color')
  const selectedThickness = form.watch('thickness')
  const selectedMaterial = form.watch('material')

  const onSubmit = (data: FormValues) => {
    if (data.material && (data.color || data.thickness)) {
      setNewFlashing({
        materialAndProps: {
          material: data.material,
          color: data.color,
          thickness: data.thickness,
        },
      })
    }

    window.location.assign(`/${newFlashing.flashingId}/canvas`)
  }

  return (
    <>
      <Header title="Select Material & Properties" returnHref="/dashboard" />

      <ContentWrapper className="bg-white pt-18 pb-22">
        <Tabs
          value={selectedMaterial}
          onValueChange={(value) => {
            form.setValue('material', value)
            form.setValue('color', undefined)
            form.setValue('thickness', undefined)
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
              <div className="grid gap-4">
                <h6>Materials</h6>
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TabsList>
                          <RadioGroup
                            className="flex flex-wrap gap-2"
                            onValueChange={field.onChange}
                          >
                            {materialsWithProperties.map((mat, index) => (
                              <Label key={index} htmlFor={mat.material}>
                                <TabsTrigger value={mat.material}>{mat.material}</TabsTrigger>
                                <RadioGroupItem id={mat.material} value={mat.material} />
                              </Label>
                            ))}
                          </RadioGroup>
                        </TabsList>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {materialsWithProperties.map((mat, index) => (
                <TabsContent key={index} value={mat.material}>
                  {mat.colors ? (
                    <>
                      <h6 className="pb-4">Color</h6>
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="grid grid-cols-3 gap-2"
                              >
                                {mat.colors.map((color, cIndex) => (
                                  <div
                                    key={cIndex}
                                    className="rounded-md flex flex-col items-center justify-between relative"
                                  >
                                    <Label
                                      htmlFor={`${mat.material} - ${color.name}`}
                                      className={cn(
                                        'h-29 rounded-md w-full grid p-1',
                                        color.name === selectedColor
                                          ? 'border-2 border-border-success'
                                          : 'border border-border-default',
                                      )}
                                    >
                                      <div
                                        className="w-full h-15 rounded-md"
                                        style={{ background: `${color.code}` }}
                                      ></div>
                                      <p className="w-full text-center caption-regular">
                                        {color.name}
                                      </p>
                                    </Label>
                                    <RadioGroupItem
                                      value={color.name}
                                      id={`${mat.material} - ${color.name}`}
                                      className=""
                                    >
                                      <RadioGroupIndicator className="top-[6px] right-[6px] [&_svg]:size-7" />
                                    </RadioGroupItem>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <h6 className="pb-4">Thickness</h6>
                      <FormField
                        control={form.control}
                        name="thickness"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup className="grid gap-2" onValueChange={field.onChange}>
                                {mat.thicknesses.map((thickness, tIndex) => (
                                  <div
                                    key={tIndex}
                                    className="rounded-md flex flex-col items-center justify-between relative"
                                  >
                                    <Label
                                      htmlFor={`${mat.material} - ${thickness.code}`}
                                      className={cn(
                                        'rounded-md w-full px-4 py-2.5 border border-border-default flex items-center justify-between',
                                        thickness.code === selectedThickness &&
                                          'bg-surface-comp-active',
                                      )}
                                    >
                                      <p className="w-full label-regular">
                                        {thickness.code} - {thickness.thickness}mm
                                      </p>
                                      <RadioGroupItem
                                        value={thickness.code}
                                        id={`${mat.material} - ${thickness.code}`}
                                      >
                                        <RadioGroupIndicator className="">
                                          <FeaturedCheckSmall />
                                        </RadioGroupIndicator>
                                      </RadioGroupItem>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </TabsContent>
              ))}
              <Footer>
                <Button disabled={!(selectedColor || selectedThickness)} className="w-full">
                  Next
                </Button>
              </Footer>
            </form>
          </Form>
        </Tabs>
      </ContentWrapper>

      {/* <Footer><a className="w-full" href="/sample/canvas"></a></Footer> */}
    </>
  )
}
