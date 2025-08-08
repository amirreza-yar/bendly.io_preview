import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Button } from '@/components/uikit/buttons/button'
import { ArrowRight } from '@/components/uikit/icons'
import PreviewCard from '@/components/dashboard/order/PreviewCard'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function PreviewPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  if (!slug || !/^[a-zA-Z0-9]{6,8}$/.test(slug)) {
    notFound() // Redirect to 404 if slug isn’t a valid ID
  }

  // Mock data for preview (logic or props)
  const previewData = {
    id: slug,
    flashings: [
      { id: '20UM', length: [690, 1000, 8000], material: 'Steel', thickness: 1, color: 'Steel' },
    ],
  }

  const hasFlashings = previewData.flashings.length > 0

  // preview UI
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div className="bg-surface-card p-4 border-b-1 border-b-border-dark flex items-center gap-xl">
        <h6 className="text-smd text-heading font-semibold">Preview</h6>
      </div>

      {hasFlashings ? (
        <>
          {/* Flashings present */}
          <div className="grow overflow-y-auto h-0 px-4 pt-m pb-3xl space-y-4">
            {previewData.flashings.map((flashing, idx) => (
              <PreviewCard key={idx} data={flashing} />
            ))}
          </div>
          {/* Action Buttons */}
          <div className="p-4 border-t-1 border-t-border-dark bg-surface-card sticky bottom-0">
            <div className="flex justify-between gap-4">
              <Button variant="ghost" size="sm" className="">
                Save as Template
              </Button>
              <Button variant="default" size="sm" className="" asChild>
                <Link href={`/${previewData.id}/details`}>
                  Continue <ArrowRight />{' '}
                </Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return {
    title: `Canva ${slug} - Preview`,
    description: 'Preview page for a specific ID',
  }
}
