'use client'
import { ArrowLeft, Edit, MapMarker, Plus, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import JobRefHeader from '@/components/dashboard/jobReference/header'
import { JobRefInfoCard } from '@/components/dashboard/jobReference/cards'
import { JobRefAddressCard } from '@/components/dashboard/jobReference/cards'
import JobRefFooter from '@/components/dashboard/jobReference/footer'
import {
  deleteJobRefAddressByIds,
  deleteJobRefById,
  getJobRefAddressByIds,
  getJobRefById,
} from '@/lib/db/helpers/jobRefHelpers'
import { toast } from 'sonner'
import { useState } from 'react'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { RemoveJobRefModal } from '@/components/dashboard/jobReference/modals'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { getOrderById, upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'
import { StoredAddress } from '@/types/jobReferenceTypes'

export default function jobReferencePage() {
  const { jobId, orderId } = useParams<{ jobId: string; orderId: string }>()

  const returnHref = useSearchParams().get('return')

  const router = useRouter()

  const jobReference = getJobRefById(jobId)
  const order = getOrderById(Number(orderId))
  if (jobReference === undefined || order === undefined) {
    notFound()
  }

  const onSelectOrderJobAddress = async (addressId: string) => {
    const address: StoredAddress | undefined = jobReference?.addresses?.find(
      (addr) => addr.id === addressId,
    )
    console.log(address)

    await upsertPartialOrder(Number(orderId), {
      jobRefrence: {
        id: jobReference?.id ?? '',
        code: jobReference?.code ?? 0,
        projectName: jobReference?.projectName,
      },
      address: {
        title: address?.title ?? '',
        streetAddress: address?.streetAddress,
        suburb: address?.suburb,
        state: address?.state,
        postcode: address?.postcode,
      },
      recipientInfo: {
        recipientName: address?.recipientName ?? '',
        recipientMobile: address?.recipientMobile ?? 0,
      },
    })

    router.push(`/o/${orderId}/delivery-ship`)
  }

  return (
    <>
      <Header
        title="Select Delivery Address"
        returnHref={returnHref ? `/o/${orderId}/delivery-ship` : `/o/${orderId}/delivery-ship/j`}
      />
      <ContentWrapper>
        <div className="grid gap-4">
          {(jobReference?.addresses?.length ?? 0) > 0 ? (
            <>
              {jobReference?.addresses?.map((address, index) => (
                <div
                  key={index}
                  data-slot="card"
                  className="rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
                >
                  <div className="grid gap-2">
                    <div className="grid gap-2" onClick={() => onSelectOrderJobAddress(address.id)}>
                      <div className="flex gap-2">
                        <MapMarker className="size-5" />
                        <div className="grid gap-1">
                          <p className="label-regular truncate">{address.title}</p>
                          <p className="body-small truncate">
                            {address.streetAddress}, {address.suburb}, {address.state}{' '}
                            {address.postcode}{' '}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ProfileNav className="size-5 mt-[2px]" />
                        <div className="grid gap-1">
                          <p className="body-small truncate">
                            {address.recipientName} {address.recipientMobile}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end items-center [&_svg]:size-5 gap-6">
                      <Link href={`/o/${orderId}/delivery-ship/j/${jobId}/${address.id}`}>
                        <Edit />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="h-[50vh]">
              <div className="h-full grid items-center justify-center opacity-40">
                <h6>No addresses for JR-{jobReference?.code}</h6>
              </div>
            </div>
          )}
        </div>
      </ContentWrapper>
      <Footer>
        <Link
          className="w-full"
          href={`/o/${orderId}/delivery-ship/j/${jobId}/new-address-details`}
        >
          <Button className="w-full">
            <Plus />
            Add New Address
          </Button>
        </Link>
      </Footer>
    </>
  )
}
