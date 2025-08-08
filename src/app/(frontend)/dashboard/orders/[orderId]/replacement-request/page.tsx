'use client'

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useReplacementRequest } from '@/providers/data_providers/order_providers/ReplacementRequestContext'
import { Checkbox } from '@/components/uikit/checkbox'
import { Button } from '@/components/uikit/buttons/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/uikit/form'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Label } from '@/components/ui/label'
import { Info } from '@/components/uikit/icons'
import { RequestPiece } from '@/types/orders/requestType'
import { useRouter } from 'next/navigation'

// 1) Schema: require at least one pieceId
const FormSchema = z.object({
  selectedSpecs: z
    .array(z.string())
    .min(1, 'You must select at least one item to request replacement'),
})

type FormValues = z.infer<typeof FormSchema>

export default function ReplacementRequestForm() {
  const router = useRouter()

  const { replacementRequest, setReplacementRequest } = useReplacementRequest()
  const flashings = replacementRequest.order?.flashings ?? []

  const pieceIds = [...new Set(replacementRequest.requestPieces?.map((piece) => piece.pieceId))]

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { selectedSpecs: pieceIds },
  })

  const selectedSpecs = form.watch('selectedSpecs')

  function onSubmit(data: FormValues) {
    const pieceIds = data.selectedSpecs

    const requestPieces: RequestPiece[] = pieceIds.flatMap((pieceId) =>
      flashings
        .flatMap((flash) =>
          flash.sepcifications.map((spec) => ({
            ...spec,
            flashingId: flash.flashingId,
            material: flash.material,
            color: flash.color,
            thickness: flash.thickness,
            totalGirth: flash.totalGirth,
          })),
        )
        .filter((spec) => spec.pieceId === pieceId),
    )
    setReplacementRequest({
      requestPieces: requestPieces,
    })

    console.log(requestPieces)

    router.push(`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request/issue`)
  }

  return (
    <>
      <Header
        title="Select Items"
        returnHref={`/dashboard/orders/${replacementRequest.order?.orderId}`}
      />
      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="selectedSpecs"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2">
                    <h6>Which item has a problem?</h6>
                  </div>

                  <div className="grid space-y-4 divide-y divide-border-default">
                    {flashings.map((flash) => (
                      <div key={flash.flashingId} className="pb-4">
                        <div className="flex gap-3 pb-4">
                          <span className="w-16 h-16 rounded-md border border-border-default" />
                          <div className="flex-col flex items-start justify-center gap-2">
                            <p className="label-regular">
                              {flash.material} / {flash.color}
                            </p>
                            <p className="caption-small">
                              Quantity:{' '}
                              {flash.sepcifications.reduce(
                                (sum: number, spec: any) => sum + spec.quantity,
                                0,
                              )}{' '}
                              pcs
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-6">
                          {flash.sepcifications.map((spec) => {
                            const checked = field.value.includes(spec.pieceId)
                            return (
                              <FormField
                                key={spec.pieceId}
                                control={form.control}
                                name="selectedSpecs"
                                render={() => (
                                  <FormItem className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={checked}
                                          onCheckedChange={(val) => {
                                            if (val) {
                                              field.onChange([...field.value, spec.pieceId])
                                            } else {
                                              field.onChange(
                                                field.value.filter(
                                                  (id: string) => id !== spec.pieceId,
                                                ),
                                              )
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel>
                                        <p className="caption-small">
                                          {spec.quantity} pcs × {spec.length}mm
                                        </p>
                                      </FormLabel>
                                    </div>
                                    <FormLabel className="pr-4">
                                      <p className="caption-small text-success">
                                        ${spec.cost.toFixed(2)}
                                      </p>
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <FormMessage className="caption-small"></FormMessage>
                </FormItem>
              )}
            />

            <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
              <div className="w-full h-full">
                <div className="flex justify-around items-center h-full">
                  <Button type="submit" disabled={selectedSpecs.length === 0} className="w-full">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </ContentWrapper>
    </>
  )
}
