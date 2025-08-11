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
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/uikit/form'
import { cn } from '@/utilities/ui'
import { useNewFlashingContext } from '@/providers/data_providers/flashing_providers/NewFlashingContext'
import {
  ColorType,
  MaterialAndProps,
  StoredMaterialAndProps,
  ThicknessType,
} from '@/types/material&PropsType'
import { db } from '@/lib/db/appDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { FeaturedCheckSmall } from '@/components/uikit/icons'
import { notFound, useParams, useRouter } from 'next/navigation'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { StoredFlashing } from '@/types/flashingTypes'

const MaterialAndPropFormSchema = z.object({
  material: z.string(),
  //   .refine((val) => materialNames?.includes(val), {
  //     message: 'Invalid material',
  //   }),
  color: z.string().optional(),
  thicknessCode: z.string().optional(),
})

export type MaterialAndPropFormValues = z.infer<typeof MaterialAndPropFormSchema>

export default function MaterialAndPropertiesSelector({
  materialsWithProperties,
  onMaterialAndPropsSubmit,
  flashing,
}: {
  materialsWithProperties: StoredMaterialAndProps[] | undefined | null
  onMaterialAndPropsSubmit: (
    data: MaterialAndPropFormValues,
    form: UseFormReturn<MaterialAndPropFormValues>,
  ) => void
  flashing: StoredFlashing
}) {
  //   const materialNames = materialsWithProperties?.map((m) => m.material)

  const form = useForm<MaterialAndPropFormValues>({
    resolver: zodResolver(MaterialAndPropFormSchema),
    defaultValues: {
      material: undefined,
      color: '',
      thicknessCode: '',
    },
  })

  useEffect(() => {
    if (!flashing || materialsWithProperties === undefined) return

    form.reset({
      material: flashing.material ?? '',
      color: flashing.color?.name ?? undefined,
      thicknessCode: flashing.thickness?.code ?? undefined,
    })
  }, [flashing, form, materialsWithProperties])

  const { isDirty } = form.formState

  const selectedColor = form.watch('color')
  const selectedThickness = form.watch('thicknessCode')
  const selectedMaterial = form.watch('material')

  return (
    <Tabs
      value={selectedMaterial}
      onValueChange={(value) => {
        form.setValue('material', value)
        form.setValue('color', undefined)
        form.setValue('thicknessCode', undefined)
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onMaterialAndPropsSubmit(data, form))}
          className="grid gap-8"
        >
          <div className="grid gap-4">
            <h6>Materials</h6>
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TabsList>
                      <RadioGroup className="flex flex-wrap gap-2" onValueChange={field.onChange}>
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
                              mat.thicknesses.map((thickness: ThicknessType, tIndex: number) => (
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
            <Button disabled={!isDirty} className="w-full">
              Next
            </Button>
          </Footer>
        </form>
      </Form>
    </Tabs>
  )
}
