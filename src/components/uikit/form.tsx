'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { cn } from '@/utilities/ui'
import { Label, LabelProps } from '@/components/uikit/label'
import { AlertTriangle, Info } from './icons'

// Re-export FormProvider as Form
export const Form = FormProvider

// Contexts for field and item
interface FormFieldContextValue {
  name: string
}
const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

interface FormItemContextValue {
  id: string
}
const FormItemContext = React.createContext<FormItemContextValue | null>(null)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name as string }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })
  const fieldState = fieldContext
    ? getFieldState(fieldContext.name, formState)
    : { invalid: false, isTouched: false, isDirty: false, error: undefined }

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }
  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function FormItem({ className, ...props }: FormItemProps) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

interface FormLabelProps extends LabelProps {}
export function FormLabel(props: FormLabelProps) {
  const { error, formItemId } = useFormField()
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', props.className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {}
export function FormControl({ ...props }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}
export function FormDescription({ className, ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField()
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}
export function FormMessage({ className, children, ...props }: FormMessageProps) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : children
  if (!body) return null

  return (
    <div
      data-slot="form-message"
      id={formMessageId}
      {...props}
      className={`flex items-center gap-1 [&_svg:not([class*='size-'])]:size-[12px] text-2xs/[19px] font-regular ${error ? 'text-attention-default' : 'text-neutral-dark'}`}
    >
      {error?.type === 'data_not_verified' ? <AlertTriangle /> : <Info />}
      <p>{body}</p>
    </div>
  )
}
