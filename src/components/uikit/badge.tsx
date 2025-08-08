import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/utilities/ui'

export const badgeColors = cva('rounded-[900px] px-[10px] py-[2px] text-center label-small', {
  variants: {
    variant: {
      green: 'bg-surface-success-subtle text-success-dark',
      orange: 'bg-surface-alert-subtle text-alert-dark',
      red: 'bg-surface-attention-subtle text-attention-dark',
      blue: 'bg-surface-info-subtle text-info-darkt',
      gray: 'bg-slate-light text-body',
    },
  },
  defaultVariants: {
    variant: 'green',
  },
})

export type BadgeColor = 'green' | 'orange' | 'red' | 'blue' | 'gray'

interface BadgeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof badgeColors> {
  text: string
  asChild?: boolean
  className?: string
  variant?: BadgeColor
}

export function Badge({ text, variant, asChild = false, className, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp data-slot="span" className={cn(badgeColors({ variant }), className)} {...props}>
      {text}
    </Comp>
  )
}
