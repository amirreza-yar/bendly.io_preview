import { Footer } from '@/components/dashboard/footer'
import { Button } from '../uikit/buttons/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../uikit/form'
import z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, LabeledInput } from '../uikit/input'
import { useState } from 'react'

const DetailsFormSchema = z.object({
  code: z
    .string('Required field')
    .nonempty('Required field')
    .regex(/^[a-zA-Z0-9-]+$/, 'Alphanumeric and - only'),
  position: z.string().optional(),
  specifications: z
    .array(
      z.object({
        quantity: z.number(),
        length: z.number(),
      }),
    )
    .nonempty(),
})

type DetailsFormValues = z.infer<typeof DetailsFormSchema>

export default function DetailsComponent() {
  const [specificationsIndex, setSpecificationsIndex] = useState<number>(1)
  const form = useForm<DetailsFormValues>({
    resolver: zodResolver(DetailsFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specifications',
  })

  const onDetailsFormSubmit = (data: DetailsFormValues) => {
    console.log(data)
  }

  return (
    <>
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
                <>
                  {fields.map((field, index) => (
                    <div>
                      <FormItem>
                        <FormControl>
                          <Input placeholder="0" {...field.quantity} />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <Input placeholder="0" {...field.quantity} />
                        </FormControl>
                      </FormItem>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
          <Footer>
            <Button className="w-full">Finilize Entry</Button>
          </Footer>
        </form>
      </Form>
    </>
  )
}
