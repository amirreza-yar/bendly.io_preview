'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { Info, ArrowLeft } from '@/components/uikit/icons'
import { LabeledInputWithCode } from '@/components/uikit/input'
import { XIcon } from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { toast } from 'sonner'

function AlertDialogContent({ ...props }) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-md',
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[90%] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg p-6 shadow-lg duration-200 sm:max-w-lg shadow-md',
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  )
}

export default function AccountPage() {
  const [userInfo] = useState({
    name: 'Davod Osanlo',
    email: 'davod.osanlo@gmail.com',
    phone: '+1 234 567 8900',
  })

    const handleVerify = () => {
    router.push('/dashboard/account/edit-current-mobile-number') 
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href="/dashboard/account">
              <ArrowLeft />
            </Link>
            <h6>Edit Mobile Number</h6>
          </div>
        </div>
      </header>

      <div className="overflow-scroll grid pt-18 pb-20 px-4">
        <LabeledInputWithCode label="Mobile Number" placeholder="e.g. 9876541230" />
        <div className="mt-6 border-gray-300 rounded-lg flex gap-3 ">
          <Info className="size-6" />
          <p className="text-sm text-gray-800">
            To change your mobile number, you must first verify your current number again
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t border-border-dark px-4">
        <div className="w-full h-full">
          <div className="flex justify-around items-center h-full">
            <AlertDialogPrimitive.Root data-slot="alert-dialog">
              <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
                <Button className="w-full bg-primary">Send Verify Code</Button>
              </AlertDialogPrimitive.Trigger>
              <AlertDialogContent>
                <div data-slot="alert-dialog-header" className="pb-4">
                  <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
                    <XIcon className="text-neutral-dark" />
                  </AlertDialogPrimitive.Cancel>
                  <AlertDialogPrimitive.Title data-slot="alert-dialog-title">
                    <span className="text-smd/[19px] font-semibold">Verify Your Identity</span>
                  </AlertDialogPrimitive.Title>
                  <AlertDialogPrimitive.Description
                    data-slot="alert-dialog-description"
                    className="body-small py-4"
                  >
                    To change your Mobile number, you first need to confirm your current one.
                  </AlertDialogPrimitive.Description>
                </div>
                <div data-slot="alert-dialog-footer" className="grid gap-4">
                  <AlertDialogPrimitive.Action asChild>
                    <Button >Send Verify Code</Button>
                  </AlertDialogPrimitive.Action>

                  <AlertDialogPrimitive.Cancel asChild>
                    <Button variant="secondary">Cancel</Button>
                  </AlertDialogPrimitive.Cancel>
                </div>
              </AlertDialogContent>
            </AlertDialogPrimitive.Root>
          </div>
        </div>
      </div>
    </>
  )
}