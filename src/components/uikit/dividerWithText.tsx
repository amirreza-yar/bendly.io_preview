import { cn } from '@/utilities/ui'
import { Separator } from '../ui/separator'

interface TextType {
  text: string
  className: string
}

export default function DividerWithText({ text, className, ...props }: TextType) {
  return (
    <div className={cn('flex justify-center items-center gap-3 w-full', className)}>
      <div className="w-full">
        <Separator className="" />
      </div>
      <p className="label-small">{text}</p>
      <div className="w-full">
        <Separator className="" />
      </div>
    </div>
  )
}
