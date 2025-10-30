'use client'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, LabeledInput } from '@/components/uikit/input'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { Minus, Plus } from '@/components/uikit/icons'
import { toast } from 'sonner'

const SpecSchema = z.object({
  name: z.string('Required field').min(1, '??'),
  code: z.string('Req'),
})

const DetailsFormSchema = z.object({
  material: z.string().nonempty('Required field'),
  baseCost: z.number('Required field 2'),
  costPerFold: z.number('Required field'),
  squishCost: z.number('Required field').min(0, 'Negetive number? Seriously?'),
  costPer100Girth: z.number('Required field').min(0, 'Negetive number? Seriously?'),
  costPer1Length: z.number('Required field').min(0, 'Negetive number? Seriously?'),
  colors: z
    .array(SpecSchema)
    .nonempty('At least one color is required')
    .refine((arr) => arr.every((s) => typeof s.name === 'string' && typeof s.code === 'string'), {
      message: 'Each Variant must have name and code',
    }),
})

export type EditMaterialFormValues = z.infer<typeof DetailsFormSchema>

export default function EditMaterialForm({
  onEditMaterialFormSubmit,
  materialDetails,
}: {
  onEditMaterialFormSubmit: (data: EditMaterialFormValues) => void
  materialDetails: any
}) {
  const form = useForm<EditMaterialFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: { colors: [{ name: undefined, code: undefined }] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'colors',
  })

  useEffect(() => {
    if (materialDetails?.baseCost) {
      form.reset({
        material: materialDetails.material,
        baseCost: materialDetails.baseCost,
        costPerFold: materialDetails.costPerFold,
        squishCost: materialDetails.squishCost,
        costPer100Girth: materialDetails.costPer100Girth,
        costPer1Length: materialDetails.costPer1Length,
        colors: materialDetails.colors,
      })
    }
  }, [materialDetails, form])

  const { isDirty } = form.formState

  const colors = form.watch('colors') || []

  return (
    <>
      <Form {...form}>
        <form id="edit-material-form" onSubmit={form.handleSubmit(onEditMaterialFormSubmit)}>
          <div className="flex justify-between gap-6">
            <div className="flex flex-col">
              <h6>Properties and cost</h6>
              <p className="subtitle-regular py-2">Edit material name or cost.</p>
              <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Name"
                          required
                          placeholder="Material name"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="baseCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Base Cost"
                          placeholder="8.00 $"
                          type="number"
                          required
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                          badge="$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPerFold"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Cost per fold"
                          placeholder="3.00 $"
                          type="number"
                          required
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                          badge="$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="squishCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Cost per squish fold"
                          placeholder="6.00 $"
                          type="number"
                          required
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                          badge="$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPer100Girth"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Cost per 100mm gir"
                          placeholder="8.00 $"
                          type="number"
                          required
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                          badge="$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costPer1Length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LabeledInput
                          label="Cost per 1m len"
                          placeholder="30.00 $"
                          type="number"
                          required
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                          badge="$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <h6>Variants</h6>
              <p className="subtitle-regular truncate">
                Use name and pick a color for each color variant you want to add.
              </p>

              <FormField
                control={form.control}
                name="colors"
                render={() => (
                  <div className="grid gap-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4">
                        <div className="flex w-full gap-4">
                          <div className="grow">
                            {/* name */}
                            <FormField
                              control={form.control}
                              name={`colors.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Name
                                    <span className="text-[#E50000]">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="Maron"
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => {
                                        const v = e.target.value
                                        field.onChange(v === '' ? undefined : v)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-start-3 col-end-6">
                            {/* Length */}
                            <FormField
                              control={form.control}
                              name={`colors.${index}.code`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Color
                                    <span className="text-[#E50000]">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <input
                                      type="color"
                                      className="h-11 w-11 rounded-md border-2 border-border-dark p-2 cursor-pointer hover:border-gray-600 transition-all"
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => {
                                        const v = e.target.value
                                        field.onChange(v === '' ? undefined : v)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Remove button */}
                        <IconButton
                          type="button"
                          variant="secondary"
                          onClick={() => remove(index)}
                          className="mt-[24px]"
                          disabled={colors.length === 1}
                        >
                          <Minus />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              />
              <div className="flex gap-4">
                <div className="grow flex gap-4">
                  <div className="grow opacity-40">
                    <div className="flex gap-2 pb-1 label-regular">
                      Name<span className="text-[#E50000]">*</span>
                    </div>
                    <div className="grow">
                      <Input
                        className="disabled:bg-transparent border-border-dark"
                        placeholder="0"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-start-3 col-end-6 opacity-40">
                    <div className="flex gap-2 pb-1 label-regular">
                      Color<span className="text-[#E50000]">*</span>
                    </div>
                    <div className="flex items-center justify-center h-11 w-11 rounded-md border-2 border-gray-400 p-2">
                      <div className="w-6 h-6 border rounded-full bg-red-400" />
                    </div>
                  </div>
                </div>
                <IconButton
                  type="button"
                  variant="secondary"
                  onClick={() => append({ name: undefined as any, code: undefined as any })}
                  className="mt-[20px]"
                  disabled={false}
                >
                  <Plus />
                </IconButton>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
