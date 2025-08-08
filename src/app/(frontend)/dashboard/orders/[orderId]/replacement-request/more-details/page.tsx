'use client'

import { useReplacementRequest } from '@/providers/data_providers/order_providers/ReplacementRequestContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/uikit/buttons/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { Input } from '@/components/uikit/input'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'

import { Textarea } from '@/components/uikit/textarea'
import { Label } from '@/components/uikit/label'
import { Camera, Remove } from '@/components/uikit/icons'
import { redirect, useRouter } from 'next/navigation'

export const FormSchema = z.object({
  photos: z
    .array(z.instanceof(File))
    .min(1, 'Please upload at least one photo.')
    .max(6, 'You can upload up to 6 photos.'),
  desc: z.string().max(300, 'Caption must be at most 300 characters.').optional(),
})

type FormValues = z.infer<typeof FormSchema>

export default function ReplacementRequestMoreDetailsPage() {
  const router = useRouter()
  const { replacementRequest, setReplacementRequest } = useReplacementRequest()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      photos: [],
    },
  })

  if (!replacementRequest.requestPieces || !replacementRequest.issue || !replacementRequest.order) {
    redirect(`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request`)
  }

  const photos = form.watch('photos')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const combined = [...photos, ...newFiles].slice(0, 6)
    form.setValue('photos', combined, { shouldValidate: true })
  }

  const removePhoto = (index: number) => {
    const updated = [...photos]
    updated.splice(index, 1)
    form.setValue('photos', updated, { shouldValidate: true })
    toast('Photo removed')
  }

  function onSubmit(data: FormValues) {
    setReplacementRequest({
      photos: [
        ...new Map(
          data.photos.map((photo) => [photo.name, { photoId: photo.name, src: photo.name }]),
        ).values(),
      ],
      description: data.desc,
    })

    router.push(`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request/submit`)
  }

  return (
    <>
      <Header
        title="Tell use more"
        returnHref={`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request/issue`}
      />
      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel className="label-regular">Description (if needed)</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Textarea
                        placeholder="Add a caption..."
                        className="px-4 py-3 resize-none min-h-21"
                        maxLength={300}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <div className="flex justify-end caption-small">
                    {field.value?.length || 0}/300
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-1">
                      <h6>Photos</h6>
                      <p className="subtitle-regular">
                        Upload up to 5 photos to help us understand the issue{' '}
                      </p>
                      <div className="w-full grid grid-cols-3 gap-4 pt-4">
                        {photos.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`upload-${index}`}
                              className="h-24 w-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-black/35 text-black rounded-xs p-1 text-xs"
                            >
                              <Remove className="size-4 text-white opacity-100" />
                            </button>
                          </div>
                        ))}

                        {photos.length < 5 && (
                          <Label className="h-24 w-24 border border-border-dark rounded-md flex-col items-center justify-center text-xs/[17px] font-semibold text-body cursor-pointer">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Camera className="size-6" />
                            <p>Add Photo</p>
                          </Label>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
              <div className="w-full h-full">
                <div className="flex justify-around items-center h-full">
                  <Button type="submit" disabled={photos.length === 0} className="w-full">
                    Submit Request
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
