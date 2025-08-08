'use client'
import type { Metadata } from 'next'
import { notFound, redirect, RedirectType } from 'next/navigation'
import { ArrowLeft } from '@/components/uikit/icons'
import ShippingForm from '@/components/dashboard/order/ShippingForm'
import FlashingForm from '@/components/dashboard/order/DetailsForm'
import Link from 'next/link'
import { Button } from '@/components/uikit/buttons/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/uikit/radioGroup'
import { Colors, Materials } from './materials-and-color'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default function SelectMaterialAndColorPage({ params: paramsPromise }: Args) {
  // const { slug } = await paramsPromise

  // if (!slug || !/^[a-zA-Z0-9]{6,8}$/.test(slug)) {
  //   notFound() // Redirect to 404 if slug isn’t a valid ID
  // }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center z-10 w-full bg-white gap-6 pl-4 border-b-1 border-border-dark">
        <Link href="/dashboard">
          <ArrowLeft />
        </Link>
        <h6 className="text-heading">Select Material & Color</h6>
      </header>
      <div className="pt-18 pb-16 h-full w-full flex flex-col overflow-scroll px-4 bg-white">
        <h6>Material</h6>
        <Materials />
        <h6 className="pt-8">Colors</h6>
        <Colors />
      </div>

      <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
        <div className="w-full h-full">
          <div className="flex justify-around items-center h-full">
            {/* <Link href={`/${slug}/canvas`} className="w-full"> */}
            <a className="w-full" href="/sample/canvas">
              <Button
                className="w-full"
                // onClick={() => redirect(`/sample/canvas`, RedirectType.replace)}
              >
                Next
              </Button>
            </a>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </>
  )
}

// export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
//   const { slug } = await paramsPromise
//   return {
//     title: `Canva ${slug} - Order`,
//     description: 'Order page for a specific ID',
//   }
// }
