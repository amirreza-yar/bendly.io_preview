'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/uikit/form'
import { Button } from '@/components/uikit/buttons/button'
import { Mail, PasswordField, ProfileNav } from '@/components/uikit/icons'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/uikit/inputOTP'
import z from 'zod'
import { LabeledInput, LabeledInputWithCode } from '@/components/uikit/input'
import { useEffect } from 'react'
import { Select } from '@/components/uikit/select'
import { Checkbox } from '@/components/uikit/checkbox'
import Link from 'next/link'

const VerifyEmailOTPSchema = z.object({
  emailOTP: z.string().min(5, {
    message: 'Please enter the code',
  }),
})

export type VerifyEmailOTPValue = z.infer<typeof VerifyEmailOTPSchema>

export const VerifyEmailOTPForm = ({
  onSubmitVerifyEmail,
  errorText,
}: {
  onSubmitVerifyEmail: (data: VerifyEmailOTPValue) => void
  errorText?: string
}) => {
  const form = useForm<VerifyEmailOTPValue>({
    resolver: zodResolver(VerifyEmailOTPSchema),
  })

  useEffect(() => {
    if (errorText) {
      form.setError('emailOTP', { type: 'manual', message: errorText })
    }
  }, [errorText, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitVerifyEmail)} className="grid gap-6 pt-2">
        <FormField
          control={form.control}
          name="emailOTP"
          render={({ field }) => (
            <div className="flex items-center justify-center">
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={5} {...field}>
                    <InputOTPGroup className="w-fit flex justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </Form>
  )
}

const EmailInputSchema = z.object({
  email: z
    .string('Please enter a valid email address.')
    .trim()
    .email('Please enter a valid email address.'),
})

export type EmailInputValue = z.infer<typeof EmailInputSchema>

export const AuthEmailForm = ({
  onSubmitEmail,
  defaultEmail,
}: {
  onSubmitEmail: (data: EmailInputValue) => void
  defaultEmail: string | null | undefined
}) => {
  const form = useForm<EmailInputValue>({
    resolver: zodResolver(EmailInputSchema),
    defaultValues: {
      email: defaultEmail ?? '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitEmail)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <LabeledInput
                  icon={Mail}
                  placeholder="Enter your email"
                  {...field}
                  value={field.value ?? ''}
                  error={Boolean(form.getFieldState('email').error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  )
}

const LoginFormSchema = z.object({
  password: z.string('Please enter your password.').nonempty('Password is required'),
})

export type LoginFormValue = z.infer<typeof LoginFormSchema>

export const LoginForm = ({
  onSubmitLogin,
  errorText,
}: {
  onSubmitLogin: (data: LoginFormValue) => void
  errorText: string
}) => {
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (errorText) {
      form.setError('password', { type: 'data_not_verified', message: errorText })
    }
  }, [errorText, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitLogin)} className="grid gap-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">Password</FormLabel>
              <FormControl>
                <LabeledInput
                  icon={PasswordField}
                  placeholder="Your Password"
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
              <Link href="" className="text-primary label-regular justify-self-end">
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  )
}

const CreateAccountFormSchema = z.object({
  fullName: z
    .string()
    .nonempty('Full name is required')
    .regex(/^[a-zA-Z ]+$/, 'Full name must contain letters only')
    .max(50, 'Full name is 50 characters max'),

  phone: z
    .string()
    .nonempty('Mobile number is required')
    .regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  password: z
    .string()
    .nonempty('Password is required')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'Use 8+ characters with letters, numbers, and symbols',
    ),
  terms: z.boolean('Terms & Conditions must be accepted').refine((val) => val === true, {
    message: 'Terms & Conditions must be accepted',
  }),
})

export type CreateAccountFormValues = z.infer<typeof CreateAccountFormSchema>

export const CreateAccountForm = ({
  onCreateAccountSubmit,
}: {
  onCreateAccountSubmit: (data: CreateAccountFormValues) => void
}) => {
  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
  })

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(onCreateAccountSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Full Name
                <span className="text-[#E50000]">*</span>
              </FormLabel>
              <FormControl>
                <LabeledInput
                  icon={ProfileNav}
                  type="text"
                  placeholder="Enter your full name"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Mobile Number
                <span className="text-[#E50000]">*</span>
              </FormLabel>
              <FormControl>
                <LabeledInputWithCode
                  type="number"
                  placeholder="e.g., 400123456"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-2 label-regular">
                Password
                <span className="text-[#E50000]">*</span>
              </FormLabel>
              <FormControl>
                <LabeledInput
                  icon={PasswordField}
                  placeholder="Your Password"
                  type="password"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage>Use 8+ characters with letters, numbers, and symbols</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <div className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <div className="grid">
                  <FormLabel className="flex gap-2 label-regular">
                    I agree to the
                    <Link href="" className="text-primary underline">
                      Terms & Conditions
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Create Account</Button>
      </form>
    </Form>
  )
}

const VerifyPhoneOTPSchema = z.object({
  phoneOTP: z.string().min(5, {
    message: 'Please enter the code',
  }),
})

export type VerifyPhoneOTPValue = z.infer<typeof VerifyPhoneOTPSchema>

export const VerifyPhoneOTPForm = ({
  onSubmitVerifyPhone,
  errorText,
}: {
  onSubmitVerifyPhone: (data: VerifyPhoneOTPValue) => void
  errorText?: string
}) => {
  const form = useForm<VerifyPhoneOTPValue>({
    resolver: zodResolver(VerifyPhoneOTPSchema),
  })

  useEffect(() => {
    if (errorText) {
      form.setError('phoneOTP', { type: 'manual', message: errorText })
    }
  }, [errorText, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitVerifyPhone)} className="grid gap-6 pt-2">
        <FormField
          control={form.control}
          name="phoneOTP"
          render={({ field }) => (
            <div className="flex items-center justify-center">
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={5} {...field}>
                    <InputOTPGroup className="w-fit flex justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </Form>
  )
}
