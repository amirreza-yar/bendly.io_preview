'use client'
import { Button } from '@/components/uikit/buttons/button'
import { Label } from '@/components/dashboard/material&color/label'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from '@/components/dashboard/material&color/radioGroup'
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
import { ColorType, ThicknessType } from '@/types/material&PropsType'
import { db } from '@/lib/db/appDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { FeaturedCheckSmall } from '@/components/uikit/icons'
import { notFound, useParams, useRouter } from 'next/navigation'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import { useEffect, useState } from 'react'

export default function SelectMaterialAndColorPage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const materialsWithProperties = useLiveQuery(() => db.materialsAndProps.toArray(), [])

  const { flashingId }: { flashingId: string } = useParams()

  const savedFlashing = useLiveQuery(() => db.flashings.get({ id: flashingId }), [flashingId], null)

  useEffect(() => {
    console.log(isNavigating)
    if (isNavigating) return // skip while navigating

    if (savedFlashing === undefined) {
      notFound()
    } else if (
      (savedFlashing && savedFlashing.nodes.length > 1) ||
      savedFlashing?.color ||
      savedFlashing?.thickness
    ) {
      notFound()
    }
  }, [savedFlashing, isNavigating])

  // Helper function to get allowed colors for a material:
  function getColorNames(material: string) {
    const mat = materialsWithProperties?.find((m) => m.material === material)
    return mat?.colors?.map((c) => c.name) || []
  }

  // Helper function to get allowed thickness codes for a material:
  function getThicknessCodes(material: string) {
    const mat = materialsWithProperties?.find((m) => m.material === material)
    return mat?.thicknesses?.map((t) => t.code) || []
  }

  // Extract all material names for basic validation:
  const materialNames = materialsWithProperties?.map((m) => m.material)

  const FormSchema = z.object({
    material: z.string().refine((val) => materialNames?.includes(val), {
      message: 'Invalid material',
    }),
    color: z.string().optional(),
    thicknessCode: z.string().optional(),
  })
  // .superRefine(({ material, color, thicknessCode }, ctx) => {
  //   const hasColors = !!materialsWithProperties?.find((m) => m.material === material)?.colors
  //   const hasThicknesses = !!materialsWithProperties?.find((m) => m.material === material)
  //     ?.thicknesses

  //   if (hasColors) {
  //     if (!color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color is required for selected material',
  //       })
  //     } else if (!getColorNames(material).includes(color)) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Invalid color for selected material',
  //       })
  //     }
  //     // Thickness should be empty if colors exist
  //     if (thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness should not be selected for this material',
  //       })
  //     }
  //   } else if (hasThicknesses) {
  //     if (!thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness is required for selected material',
  //       })
  //     } else if (!getThicknessCodes(material).includes(thicknessCode)) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Invalid thickness for selected material',
  //       })
  //     }
  //     // Color should be empty if thicknesses exist
  //     if (color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color should not be selected for this material',
  //       })
  //     }
  //   } else {
  //     // Material has neither colors nor thicknesses (rare case)
  //     if (color) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['color'],
  //         message: 'Color should not be selected for this material',
  //       })
  //     }
  //     if (thicknessCode) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         path: ['thickness'],
  //         message: 'Thickness should not be selected for this material',
  //       })
  //     }
  //   }
  // })

  type FormValues = z.infer<typeof FormSchema>
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })

  const selectedColor = form.watch('color')
  const selectedThickness = form.watch('thicknessCode')
  const selectedMaterial = form.watch('material')

  const onSubmit = (data: FormValues) => {
    if (data.material && (data.color || data.thicknessCode)) {
      if (data.color) {
        const colorCode = materialsWithProperties
          ?.find((obj) => obj.material === data.material)
          ?.colors?.find((obj) => obj.name === data.color)?.code

        upsertPartialFlashing(flashingId, {
          material: data.material,
          color: { name: data.color || '', code: colorCode || '' },
          thickness: undefined,
        })
      } else if (data.thicknessCode) {
        const thickness = materialsWithProperties
          ?.find((obj) => obj.material === data.material)
          ?.thicknesses?.find((obj) => obj.code === data.thicknessCode)?.thickness

        upsertPartialFlashing(flashingId, {
          material: data.material,
          thickness: { code: data.thicknessCode || '', thickness: thickness || 0 },
          color: undefined,
        })
      }
    }

    setIsNavigating(true)

    window.location.assign(`/flashing/${flashingId}/canvas`)
  }

  if (savedFlashing) {
    return (
      <>
        <Header title="Select Material & Properties" returnHref="/dashboard" />

        <ContentWrapper className="bg-white pt-18 pb-22">
          <Tabs
            value={selectedMaterial}
            onValueChange={(value) => {
              form.setValue('material', value)
              form.setValue('color', undefined)
              form.setValue('thicknessCode', undefined)
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
                              {materialsWithProperties?.map((mat, index) => (
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
                {materialsWithProperties?.map((mat, index) => (
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
                                  {mat.colors &&
                                    mat.colors.map((color: ColorType, cIndex: number) => (
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
                          name="thicknessCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup className="grid gap-2" onValueChange={field.onChange}>
                                  {mat.thicknesses &&
                                    mat.thicknesses.map(
                                      (thickness: ThicknessType, tIndex: number) => (
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
                                      ),
                                    )}
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
      </>
    )
  }
}
