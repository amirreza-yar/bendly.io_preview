import React, { useState, InputHTMLAttributes, ReactElement, forwardRef } from 'react'
import { cn } from '@/utilities/ui'
import { EyeClosed, EyeOpen, Info } from '@/components/uikit/icons'

interface InputProp extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProp>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        // {...(value !== undefined ? { value } : {})}
        // {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...props}
        data-slot="input"
        className={cn(
          'px-4 py-3 font-roboto text-neutral-dark placeholder:text-neutral-midlight selection:bg-primary-light border-[2px] border-neutral-light h-11 w-full min-w-0 rounded-md bg-transparent shadow-xs transition-[color,border] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-light',
          'focus-visible:border-primary',
          'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium ',
          'aria-invalid:ring-destructive/20 aria-invalid:text-destructive aria-invalid:placeholder:text-destructive/80 aria-invalid:border-destructive',
          className,
        )}
      />
    )
  },
)

Input.displayName = 'Input'

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  icon?: (props: React.SVGProps<SVGSVGElement>) => ReactElement
  badge?: string
  helpText?: string
  className?: string
  error?: boolean
}

export function LabeledInput({
  label,
  required = false,
  icon: Icon,
  badge,
  helpText,
  type = 'text',
  placeholder,
  className,
  disabled = false,
  error = false,
  ...props
}: LabeledInputProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-2 font-roboto', className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1">
          <p className="text-xs/[16.5px] font-medium text-neutral-dark">{label}</p>
          {required && (
            <p className="text-sm font-medium text-attention-default-default text-red-500">*</p>
          )}
        </div>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon inside input */}
        {Icon && (
          <div className="absolute inset-y-0 start-0 flex items-center pl-4 pointer-events-none [&_svg:not([class*='size-'])]:size-[20px]">
            <Icon className="text-neutral-dark" />
          </div>
        )}

        {/* Badge inside input */}
        {badge && (
          <div
            className={cn(
              'absolute inset-y-0 end-0 flex items-center',
              isPassword ? 'pr-11' : 'pr-4',
            )}
          >
            <span
              className={cn(
                'px-1 py-[1px] rounded text-sm font-medium',
                disabled
                  ? 'text-neutral-midlight bg-transparent cursor-not-allowed'
                  : 'text-primary-dark bg-primary-lightest',
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Password toggle inside input */}
        {isPassword && (
          <button
            disabled={disabled}
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 end-0 flex items-center text-neutral-midlight pr-4 [&_svg:not([class*='size-'])]:size-[20px]"
          >
            {visible ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}

        {/* Actual Input */}
        <Input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`${Icon ? 'pl-11' : 'pl-3'} ${error ? 'border-attention-default focus-visible:border-attention' : ''}`}
          {...props}
        />
      </div>

      {/* Help text */}
      {helpText && (
        <div
          className={`flex items-center gap-1 [&_svg:not([class*='size-'])]:size-[12px] text-2xs/[19px] font-regular ${error ? 'text-attention-default' : 'text-neutral-dark'}`}
        >
          <Info />
          <p>{helpText}</p>
        </div>
      )}
    </div>
  )
}

interface LabeledInputWithCodeProps extends LabeledInputProps {
  code?: string
}

export function LabeledInputWithCode({
  label,
  required = false,
  icon: Icon,
  badge,
  code = '+61',
  helpText,
  type = 'text',
  placeholder,
  className,
  disabled = false,
  error = false,
  ...props
}: LabeledInputWithCodeProps) {
  const [visible, setVisible] = React.useState(false)
  const isPassword = type === 'password'
  // console.log("is password: " + isPassword);
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  // Calculate padding to accommodate icons/badge
  const leftPadding = Icon ? 'pl-11' : 'pl-3'
  const rightPadding = isPassword ? (badge ? 'pr-30' : 'pr-10') : badge ? 'pr-1' : 'pr-3'

  return (
    <div className={cn('flex flex-col gap-2 font-roboto', className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1">
          <p className="text-xs/[16.5px] font-medium text-neutral-dark">{label}</p>
          {required && <p className="text-sm font-medium text-attention-default">*</p>}
        </div>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon inside input */}
        {Icon && (
          <div className="absolute inset-y-0 start-0 flex items-center pl-4 pointer-events-none [&_svg:not([class*='size-'])]:size-[20px]">
            <Icon className="text-neutral-dark" />
          </div>
        )}

        {/* Badge inside input */}
        {badge && (
          <div
            className={cn(
              'absolute inset-y-0 end-0 flex items-center',
              isPassword ? 'pr-11' : 'pr-4',
            )}
          >
            <span
              className={cn(
                'px-1 py-[1px] rounded text-sm font-medium',
                disabled
                  ? 'text-neutral-midlight bg-transparent cursor-not-allowed'
                  : 'text-primary-dark bg-primary-lightest',
              )}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Password toggle inside input */}
        {isPassword && (
          <button
            disabled={disabled}
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 end-0 flex items-center text-neutral-midlight pr-4 [&_svg:not([class*='size-'])]:size-[20px]"
          >
            {visible ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}

        {/* Actual Input */}
        <div className="flex">
          <Input
            className="w-14 flex-none bg-gray-200 border border-gray-300 rounded-none rounded-l-md text-center border-r-0"
            placeholder={code}
            value={code}
            readOnly
          />
          <Input
            disabled={disabled}
            type={inputType}
            placeholder={placeholder}
            className={`${Icon ? 'pl-11' : 'pl-3'} ${error ? 'border-attention-default focus-visible:border-attention' : ''} flex-1 rounded-none rounded-r-md`}
            {...props}
          />
        </div>
      </div>

      {/* Help text */}
      {helpText && (
        <div
          className={`flex items-center gap-1 [&_svg:not([class*='size-'])]:size-[12px] text-2xs/[19px] font-regular ${error ? 'text-attention-default' : 'text-neutral-dark'}`}
        >
          <Info />
          <p>{helpText}</p>
        </div>
      )}
    </div>
  )
}
