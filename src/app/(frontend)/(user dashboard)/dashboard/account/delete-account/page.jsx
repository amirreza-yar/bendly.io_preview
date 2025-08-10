'use client'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { AlertTriangle } from '@/components/uikit/icons'
import Link from 'next/link'

export default function deleteAccountPage() {
  return (
    <>
      <Header title="Delete Account" returnHref="/dashboard/profile" />
      <ContentWrapper classname="grid content-between text-center">
        <div className="gird gap-2 pt-4 px-4">
          <h5 className="text-center">Are You Sure You Want to Delete Your Account?</h5>
          <p className="subtitle-regular text-center pt-4">This action cannot be undone</p>
        </div>
        <div className="flex gap-3 rounded-md border-border-default border-1 text-regular p-3 mt-6">
          <AlertTriangle className="size-5 mt-1" />
          <div className="pb-2">
            <p className="body-small pb-4 pt-1">
              Deleting your account is 
              <span className="font-bold">permanent and cannot be undone. </span>
            </p>
            <p> This will remove all your data, including:</p>
            <ul className="list-disc pl-7">
              <li> Profile information and settings</li>
              <li>All orders history</li>
              <li>All job references</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 text-center justify-center h-11 px-4 mt-6">
          <Link
            href=""
            className="flex items-center justify-center border-border-primary border-2 bg-primary rounded-md px-4 py-2 button-medium text-white w-full"
          >
            Cancel
          </Link>
          <Link
            href=""
            className="flex items-center justify-center border-border-attention border-2 rounded-md px-4 py-2 button-medium text-attention-default w-full"
          >
            Continue to Delete
          </Link>
        </div>
      </ContentWrapper>
    </>
  )
}
