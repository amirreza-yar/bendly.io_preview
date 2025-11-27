'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PencilIcon, FeaturedSuccess } from '@/components/uikit/icons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'
import { useUser } from '@/providers/main_providers/UserContext'

export default function VerifiedMobilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {user} = useUser()
  const mobile = user.mobile

  const defaultPhone = '+61-0401234567'
  const newPhone = searchParams?.get('mobile') || defaultPhone

  const handleEditMobile = () => {
    router.push('/dashboard/account/edit-mobile')
  }

  const handleSendCode = async () => {
    try {
      // Placeholder for API call
      console.log('Sending verification code to:', newPhone)
      router.push('/dashboard/account/edit-mobile/verify-new-mobile')
    } catch (error) {
      console.error('Failed to send code', error)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4 p-4  ">
        <div className="flex items-center mb-6 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center mr-5.5">
            <h6 className="text-sm md:text-md font-bold">Logo</h6>
          </div>
        </div>

        <div className="text-center mb-10 pt-5.5">
          <div className="flex justify-center mb-4">
            <FeaturedSuccess className="w-10 h-10" />
          </div>
          <h5 className="text-md font-bold pb-4 text-success">
            Your current mobile number has been verified
          </h5>
          <p className="text-gray-600 text-sm pt-1.5 mb-10">
            To finalize the mobile number change, your new mobile number must be verified
          </p>
          <div className="text-sm text-gray-600 mt-2 flex justify-center flex-col items-center gap-2">
            <p>We've sent it to your new mobile number:</p>
            <div className="relative w-[173px] h-[40px] rounded-[40px] border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-black pr-8">{mobile}</span>
              <button
                className="absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                onClick={handleEditMobile}
              >
                <PencilIcon className="size-4 text-black" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex mt-10">
          <Button
            variant="default"
            size="md"
            className="w-full h-11"
            onClick={handleSendCode}
          >
            Send Code
          </Button>
        </div>
      </div>
    </div>
  )
}
