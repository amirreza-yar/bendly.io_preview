import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from '@/components/uikit/icons'
import ShippingForm from '@/components/dashboard/order/ShippingForm'
import FlashingForm from '@/components/dashboard/order/DetailsForm'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function OrderPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  if (!slug || !/^[a-zA-Z0-9]{6,8}$/.test(slug)) {
    notFound() // Redirect to 404 if slug isn’t a valid ID
  }

  // Mock data for preview
  const orderData = {
    id: slug,
    flashings: [
      { id: '20UM', length: [690, 1000, 8000], material: 'Steel', thickness: 1, color: 'Steel' },
      { id: '20UM', length: [690, 1000, 8000], material: 'Steel', thickness: 1, color: 'Steel' },
      { id: '20UM', length: [690, 1000, 8000], material: 'Steel', thickness: 1, color: 'Steel' },
    ],
  }

  const hasFlashings = orderData.flashings.length > 0

  return (
    <div className="flex flex-col justify-start items-center overflow-hidden gap-4 bg-[#eee]">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-4 bg-white border-t-0 border-r-0 border-b border-l-0 border-[#999]">
            <div className="flex justify-start items-center flex-grow relative gap-6">
              <ArrowLeft />
              <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-neutral-900">
                Shipping &amp; Delivery
              </p>
            </div>
          </div>
        </div>
        <FlashingForm />
      </div>
      <div className="flex flex-col justify-end items-center flex-grow-0 flex-shrink-0 gap-2 p-4 bg-white border-t border-r-0 border-b-0 border-l-0 border-[#999]">
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2">
          <div className="flex justify-start items-center flex-grow relative gap-2">
            <p className="flex-grow-0 flex-shrink-0 text-lg font-semibold text-left text-neutral-800">
              $6600.00
            </p>
          </div>
          <div className="flex justify-center items-center flex-grow gap-2 px-4 py-3 rounded-xl bg-[#35f]">
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-5 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-center text-white">
                Schedule &amp; Pay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return {
    title: `Canva ${slug} - Order`,
    description: 'Order page for a specific ID',
  }
}
