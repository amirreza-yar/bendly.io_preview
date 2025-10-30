'use client'
import { useState } from 'react'
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
import { Input } from '@/components/uikit/input'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { Minus, Plus } from '@/components/uikit/icons'
import { toast } from 'sonner'

const SpecSchema = z.object({
  name: z.string('Required field').min(1, '??'),
  code: z.string('Req'),
})

const DetailsFormSchema = z.object({
  colors: z
    .array(SpecSchema)
    .nonempty('At least one color is required')
    .refine((arr) => arr.every((s) => typeof s.name === 'string' && typeof s.code === 'string'), {
      message: 'Each specification must have name and code',
    }),
})

export type NewVairantFormValues = z.infer<typeof DetailsFormSchema>

export default function AddNewMaterialVarForm({
  onNewVariantFormSubmit,
}: {
  onNewVariantFormSubmit: (data: NewVairantFormValues) => void
}) {
  const form = useForm<NewVairantFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: { colors: [{ name: undefined, code: undefined }] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'colors',
  })

  const colors = form.watch('colors') || []

  return (
    <>
      <Form {...form}>
        <form id="new-variant-form" onSubmit={form.handleSubmit(onNewVariantFormSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2 pt-2">
              <h6>Colors</h6>
              <p className="subtitle-regular">
                Use name and pick a color for each color variant you want to add.
              </p>
            </div>
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
        </form>
      </Form>
    </>
  )
}
