import Link from 'next/link'
import { ArrowLeft, HomeMenu, Magnifier } from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import { Button } from '../uikit/buttons/button'

type HeaderProps = {
  title: string
  children?: any
  className?: string
  returnHref?: string
  onReturnButtonClick?: (props: any) => void
}

export function Header({
  title,
  children,
  className,
  returnHref,
  onReturnButtonClick,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark md:max-w-[1000px] md:mx-auto md:left-1/2 md:-translate-x-1/2',
        className,
      )}
    >
      <div className="flex items-center justify-between h-full w-full px-4">
        <div className="flex items-center gap-[18px] pr-3">
          {returnHref && (
            <Link href={returnHref}>
              <ArrowLeft />
            </Link>
          )}
          {onReturnButtonClick && (
            <button type="button" className="cursor-pointer" onClick={onReturnButtonClick}>
              <ArrowLeft />
            </button>
          )}
          <h6>{title}</h6>
        </div>

        {children}
      </div>
    </header>
  )
}

export function HeaderWithCenterTitle({
  title,
  className,
  returnHref,
}: Pick<HeaderProps, 'title' | 'className' | 'returnHref'>) {
  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white">
      <div
        className={cn('flex items-center justify-center h-full w-full px-4 relative', className)}
      >
        <div className="flex items-center gap-[18px] pr-3">
          {returnHref && (
            <Link className="absolute left-4" href={returnHref}>
              <ArrowLeft />
            </Link>
          )}
          <h6>{title}</h6>
        </div>
      </div>
    </header>
  )
}
