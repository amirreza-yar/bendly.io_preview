'use client'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/uikit/form'
import { RadioGroup, RadioGroupItem } from '@/components/uikit/radioGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { AmericanExpressSVG, MasterCardSVG, PayPalSVG, VISASVG } from './svgs'

const paymentMethodFormSchema = z.object({
  method: z.enum(['credit-card', 'paypal'], '').nonoptional(''),
})

export type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>

export const PaymentMethodForm = ({
  onSubmitPay,
}: {
  onSubmitPay: (data: PaymentMethodFormValues) => void
}) => {
  const paymentMethodForm = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      method: 'credit-card',
    },
  })

  return (
    <Form {...paymentMethodForm}>
      <form id="payment-method-form" onSubmit={paymentMethodForm.handleSubmit(onSubmitPay)}>
        <FormField
          control={paymentMethodForm.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="credit-card"
                  className="grid gap-4"
                >
                  <FormItem className="rounded-md p-4 border border-border-default">
                    <div className="flex gap-2">
                      <FormControl>
                        <RadioGroupItem value="credit-card" />
                      </FormControl>

                      <FormLabel className="flex items-center justify-between w-full">
                        <p>Credit Card</p>

                        <div className="flex gap-2 items-center justify-center">
                          <VISASVG />
                          <MasterCardSVG />
                          <AmericanExpressSVG />
                        </div>
                      </FormLabel>
                    </div>
                    {field.value === 'credit-card' && (
                      <div className="grid gap-3 text-center pt-2">
                        <p className="label-regular">Pay with Credit Card</p>
                        <p className="caption-small">
                          You will be redirected to PayPal to complete your payment securely
                        </p>
                      </div>
                    )}
                  </FormItem>
                  <FormItem className="rounded-md p-4 border border-border-default">
                    <div className="flex gap-2">
                      <FormControl>
                        <RadioGroupItem value="paypal" />
                      </FormControl>
                      <FormLabel className="flex items-center justify-between w-full">
                        <p>PayPal</p>
                        <PayPalSVG />
                      </FormLabel>
                    </div>
                    {field.value === 'paypal' && (
                      <div className="grid gap-3 text-center pt-2">
                        <p className="label-regular">Pay with PayPal</p>
                        <p className="caption-small">
                          You will be redirected to PayPal to complete your payment securely
                        </p>
                      </div>
                    )}
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
