'use client'
import { Footer } from '@/components/dashboard/footer'
import { Button } from '../../uikit/buttons/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../uikit/form'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, LabeledInput } from '../../uikit/input'
import { useEffect, useState } from 'react'
import { IconButton } from '../../uikit/buttons/iconButton'
import { ArrowLeft, Minus, Plus } from '../../uikit/icons'
import { StoredOrder } from '@/types/orderTypes'
import { Header } from '../../dashboard/header'
import { ContentWrapper } from '../../dashboard/contentWrapper'
import { UnsavedChangesOnDetailsModal } from './modals'

const SpecSchema = z.object({
  quantity: z.number('Required field').min(1, '??'),
  length: z
    .number('Required field')
    .min(200, 'Must be at least 200 mm')
    .max(8000, 'Must be at most 8000 mm'),
})

const DetailsFormSchema = z.object({
  code: z
    .string('Required field')
    .nonempty('Required field')
    .regex(/^[a-zA-Z0-9-]+$/, 'Alphanumeric and - only'),
  position: z.string().optional(),
  specifications: z
    .array(SpecSchema)
    .nonempty('At least one specification is required')
    .refine(
      (arr) => arr.every((s) => typeof s.quantity === 'number' && typeof s.length === 'number'),
      { message: 'Each specification must have quantity and length' },
    ),
})

type SpecDraft = { quantity?: number; length?: number }
export type DetailsFormValues = z.infer<typeof DetailsFormSchema>

export default function DetailsComponent({
  onDetailsFormSubmit,
  order,
  flashingId,
  onModalDiscardChanges,
  title,
}: {
  onDetailsFormSubmit: (data: DetailsFormValues) => void
  order?: StoredOrder | null
  flashingId: string
  onModalDiscardChanges: () => void
  title: string
}) {
  const form = useForm<DetailsFormValues>({
    resolver: zodResolver(DetailsFormSchema),
    defaultValues: { specifications: [{ quantity: undefined, length: undefined }] },
  })

  useEffect(() => {
    if (order?.flashings?.length) {
      const lastFlashing = order.flashings.find((flash) => flash.id === flashingId)
      form.reset({
        code: lastFlashing.code,
        position: lastFlashing.position,
        specifications: lastFlashing.specifications,
      })
    }
  }, [order, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specifications',
  })

  const specifications = form.watch('specifications') || []

  const { isDirty } = form.formState

  return (
    <>
      {order && isDirty ? (
        <UnsavedChangesOnDetailsModal
          onDiscardChanges={onModalDiscardChanges}
          onSaveChanges={() => form.handleSubmit(onDetailsFormSubmit)()}
        >
          <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
            <div className="flex items-center justify-between h-full w-full px-4">
              <div className="flex items-center gap-[18px] pr-3">
                <ArrowLeft />
                <h6>{title}</h6>
              </div>
            </div>
          </header>
        </UnsavedChangesOnDetailsModal>
      ) : order ? (
        <Header title={title} returnHref={`/o/${order.id}/review`} />
      ) : (
        <Header title={title} returnHref={`/f/${flashingId}/preview`} />
      )}

      <ContentWrapper className="pt-18 bg-white pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDetailsFormSubmit)}>
            <div className="grid gap-4">
              <h6>Identification</h6>
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code <span className="text-[#E50000]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Code" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage>Alphanumeric and – only</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Position" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2 pt-2">
                <h6>Specifications</h6>
                <p className="subtitle-regular">The length range is from 200 mm to 8000 mm</p>
              </div>
              <FormField
                control={form.control}
                name="specifications"
                render={() => (
                  <div className="grid gap-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4">
                        <div className="grid grid-cols-5 gap-4">
                          <div className="col-start-1 col-end-3">
                            {/* Quantity */}
                            <FormField
                              control={form.control}
                              name={`specifications.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Quantity
                                    <span className="text-[#E50000]">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => {
                                        const v = e.target.value
                                        field.onChange(v === '' ? undefined : Number(v))
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
                              name={`specifications.${index}.length`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Length
                                    <span className="text-[#E50000]">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => {
                                        const v = e.target.value
                                        field.onChange(v === '' ? undefined : Number(v))
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
                          disabled={specifications.length === 1}
                        >
                          <Minus />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              />

              <div className="flex gap-4">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-start-1 col-end-3 opacity-40">
                    <div className="flex gap-2 pb-1">
                      Quantity<span className="text-[#E50000]">*</span>
                    </div>
                    <div className="col-start-1 col-end-3">
                      <Input
                        className="disabled:bg-transparent border-border-dark"
                        placeholder="0"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-start-3 col-end-6 opacity-40">
                    <div className="flex gap-2 pb-1">
                      Length<span className="text-[#E50000]">*</span>
                    </div>
                    <div className=" relative flex items-center">
                      <Input
                        className="disabled:bg-transparent border-border-dark"
                        placeholder="0"
                        disabled
                      />
                      <div className="absolute right-4 bg-surface-info-subtle rounded-2xs px-1 text-primary">
                        mm
                      </div>
                    </div>
                  </div>
                </div>
                <IconButton
                  type="button"
                  variant="secondary"
                  onClick={() => append({ quantity: undefined as any, length: undefined as any })}
                  className="mt-[27px]"
                  disabled={false}
                >
                  <Plus />
                </IconButton>
              </div>
            </div>
            <Footer>
              <Button disabled={!isDirty} className="w-full">
                Finilize Entry
              </Button>
            </Footer>
          </form>
        </Form>
      </ContentWrapper>
    </>
  )
}
