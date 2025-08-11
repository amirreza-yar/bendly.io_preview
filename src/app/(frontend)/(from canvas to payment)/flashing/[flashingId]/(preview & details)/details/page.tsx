'use client'
import React from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import { ArrowLeft } from '@/components/uikit/icons'
import DetailsForm from '@/components/dashboard/order/DetailsForm'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import DetailsComponent from '@/components/flashing/detailsComponent'

export default function DetailsPage() {
  const { flashingId } = useParams()

  return (
    <>
      <Header title="Details" returnHref={`/flashing/${flashingId}/preview`} />
      <ContentWrapper className="pt-18 bg-white">
        <DetailsComponent />
      </ContentWrapper>
    </>
  )
}
