import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import { ArrowLeft } from '@/components/uikit/icons'
import DetailsForm from '@/components/dashboard/order/DetailsForm'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function DetailsPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  // if (!slug || !/^[a-zA-Z0-9]{6,8}$/.test(slug)) {
  //   notFound() // Redirect to 404 if slug isn’t a valid ID
  // }

  // Mock data for preview (logic or props)
  const detailsData = {
    id: slug,
    data: `{"content":{"id": ${slug}, "content": "This is a test content for preview."}}`,
  }
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <div className="bg-surface-card p-4 border-b-1 border-b-border-dark flex items-center gap-xl">
        <Link href={`/${detailsData.id}/preview`}>
          <ArrowLeft />
        </Link>
        <h6 className="text-smd text-heading font-semibold">Details</h6>
      </div>

      <div className="bg-card grow overflow-y-auto px-4 pt-m pb-3xl space-y-4">
        <p className="font-regular text-xs-r">Add details for the flashing component</p>

        <DetailsForm />
      </div>

      {/* Bottom buttons (sticky) */}
      <div className="p-4 border-t-1 border-t-border-dark bg-surface-card sticky bottom-0">
        <Button className="w-full" variant="default" size="lg" asChild>
          <Link href={`/${detailsData.id}/review`}>Finalize Entry</Link>
        </Button>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return {
    title: `Canva ${slug} - Details`,
    description: 'Details page for a specific ID',
  }
}
