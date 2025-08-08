'use client'

import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/uikit/buttons/button'
import { FeaturedSuccess } from '@/components/uikit/icons'
import { useReplacementRequest } from '@/providers/data_providers/order_providers/ReplacementRequestContext'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function ReplacementRequestSubmitPage() {
  const { replacementRequest } = useReplacementRequest()

  //   if (
  //     !replacementRequest.requestPieces ||
  //     !replacementRequest.issue ||
  //     !replacementRequest.order ||
  //     !replacementRequest.photos
  //   ) {
  //     redirect(`/dashboard/orders/${replacementRequest.order?.orderId}/replacement-request`)
  //   }

  return (
    <ContentWrapper>
      <div className="h-[85%] w-full flex items-center justify-center text-body">
        <div className="grid text-center gap-2">
          <FeaturedSuccess className="w-full" />
          <h5>Request Submitted</h5>
          <p className="subtitle-regular">
            Your replacement request has been submitted. Our team will review it and get back to you
            shortly
          </p>
          <div className="grid gap-3 border border-border-default rounded-md p-3 mt-6">
            <div className="flex items-center justify-between">
              <p className="label-small text-subtitle">Request ID</p>
              <p className="label-small text-heading">REQ-65842343</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="label-small text-subtitle">Estimated Response</p>
              <p className="label-small text-heading">1 - 2 Business days</p>
            </div>
          </div>
          <Link
            className="w-full pt-4 pb-2"
            href={`/dashboard/orders/${replacementRequest.order?.orderId}`}
          >
            <Button variant="secondary" className="w-full">
              Back to Order Details
            </Button>
          </Link>
          <Link className="w-full" href="">
            <Button variant="secondary" className="w-full">
              Track Request
            </Button>
          </Link>
        </div>
      </div>
    </ContentWrapper>
  )
}
