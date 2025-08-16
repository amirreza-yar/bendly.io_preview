import { ArrowLeft, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { RemoveJobRefModal } from './modals'
import { toast } from 'sonner'

interface JobRefHeaderProps {
  jobCode: number | undefined
  onJobRefDelete: (jobRefId: string) => void
}

export default function JobRefHeader({ jobCode, onJobRefDelete }: JobRefHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
      <div className="flex items-center justify-between h-full w-full px-4">
        <div className="flex items-center gap-[18px] pr-3">
          <Link href="/dashboard/j">
            <ArrowLeft />
          </Link>
          <h6>Job Ref: JR-{jobCode}</h6>
        </div>
        <RemoveJobRefModal
          trigger={<Remove className="size-6" />}
          onJobRefDelete={onJobRefDelete}
        />
      </div>
    </header>
  )
}
