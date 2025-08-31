'use client'

import { Header } from '@/components/dashboard/header'
import { useReplacementRequest } from '@/providers/data_providers/order_providers/ReplacementRequestContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/uikit/buttons/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { RadioGroup, RadioGroupItem } from '@/components/uikit/radioGroup'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Issue, issueValues } from '@/types/orders/requestType'
import { notFound, redirect, useRouter } from 'next/navigation'

const contentList = [
  {
    value: 'wrong-size',
    title: 'Wrong size or dimensions',
    desc: "The delivered item doesn't match the specified measurements",
  },
  {
    value: 'wrong-shape',
    title: 'Wrong flashing profile or shape',
    desc: 'The shape or model delivered is incorrect',
  },
  {
    value: 'damaged',
    title: 'Damaged during delivery',
    desc: 'The item is dented, bent, or scratched upon arrival',
  },
  {
    value: 'wrong-material',
    title: 'Incorrect material or color',
    desc: 'The delivered material or coating doesn’t match the order',
  },
  {
    value: 'missing-parts',
    title: 'Missing items or parts',
    desc: 'One or more pieces from the order were not delivered',
  },
  {
    value: 'other',
    title: 'Other',
    desc: 'For any other issue not covered above',
  },
]

const FormSchema = z.object({
  issue: z.enum(issueValues),
})

export default function ReplacementRequestIssuePage() {
  const router = useRouter()
  const { replacementRequest, setReplacementRequest } = useReplacementRequest()

  if (!replacementRequest.requestPieces) {
    redirect(`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request`)
  }

  const defaultIssueValue = replacementRequest.issue?.value ?? undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      issue: defaultIssueValue,
    },
  })

  const isItemSelected = form.watch('issue') === undefined

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const found = contentList.find((con) => con.value === data.issue) as
      | (typeof contentList)[number]
      | undefined

    if (!found) {
      notFound()
    }

    setReplacementRequest({
      issue: {
        title: found.title,
        desc: found.desc,
        value: found.value,
      },
    })

    router.push(
      `/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request/more-details`,
    )
  }

  return (
    <>
      <Header
        title="Issue?"
        returnHref={`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request`}
      />

      <ContentWrapper className="pt-18">
        <h6 className="pb-6">What is the issue?</h6>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-4 divide-y-[0.5px] divide-[#E4E4E4]"
                    >
                      {contentList.map((item, index) => (
                        <FormItem key={index} className="flex items-start gap-3 pb-3">
                          <FormControl>
                            <RadioGroupItem value={item.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="grid gap-1">
                              <p className="label-regular">{item.title}</p>
                              <p className="caption-small text-subtitle">{item.desc}</p>
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
              <div className="w-full h-full">
                <div className="flex justify-around items-center h-full">
                  <Button type="submit" disabled={isItemSelected} className="w-full">
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
