import { ArrowLeft, Plus, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { RemoveJobRefModal } from './modals'
import { Button } from '@/components/uikit/buttons/button'

interface JobRefFooterProps {
  jobCode: number | undefined
}

export default function JobRefFooter({ jobCode }: JobRefFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
      <div className="w-full h-full">
        <div className="flex justify-around items-center h-full">
          <Link className="w-full" href={`/dashboard/j/${jobCode}/new-address-details`}>
            <Button className="w-full">
              <Plus />
              Add New Address
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  )
}
