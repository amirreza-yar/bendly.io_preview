import { ReactNode, Suspense } from 'react'
import { cn } from '@/utilities/ui' // Replace with your actual utility
import { ChevronRight } from '@/components/uikit/icons'
import { Badge } from '@/components/uikit/badge' // Adjust the path if needed
import { Skeleton } from '../skeleton'

type BadgeColor = 'green' | 'orange' | 'red' | 'blue' | 'gray'

interface ButtonListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  icon?: React.ComponentType<{ className?: string }>
  badgeText?: string
  badgeColor?: BadgeColor
  caption?: string
  loading?: boolean
}

export function ButtonListItem({
  text,
  icon: Icon,
  badgeText,
  badgeColor = 'green',
  caption,
  loading = false,
  ...props
}: ButtonListItemProps) {
  return (
    <div
      className={cn('flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0')}
      {...props}
    >
      <div className="[&_svg]:size-6 flex justify-start items-center flex-grow relative gap-4 pr-4 py-3 label-regular">
        {Icon && <Icon />}
        <div className="grid gap-2">
          <div className="flex gap-2">
            <span>{text}</span>

            {badgeText &&
              (loading ? (
                <Skeleton className="h-[14px] w-[50px]" />
              ) : (
                <Badge text={badgeText!} variant={badgeColor} />
              ))}
          </div>
          {caption &&
            (loading ? (
              <Skeleton className="h-[14px] w-[90px]" />
            ) : (
              <span className="caption-small text-subtitle truncate">{caption}</span>
            ))}
        </div>
      </div>
      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-6">
        <ChevronRight />
      </div>
    </div>
  )
}
