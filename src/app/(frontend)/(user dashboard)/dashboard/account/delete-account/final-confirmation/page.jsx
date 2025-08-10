'use client'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import {DropdownMenu} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export default function finalConfirmPage() {
  return (
    <>
      <Header title="Final Confirmation" returnHref="/dashboard/profile" />
      <ContentWrapper classname="grid content-between text-center">
        <div className="gird gap-2 pt-4 px-4">
          <h5 className="text-center">Final Confirmation: Delete Your Account</h5>
          <p className="subtitle-regular text-center pt-4">
            This action is permanent and will delete all your data. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 rounded-md border-border-default border-1 text-regular p-3 mt-6">
          <input type="checkbox" className="w-5 h-5 mt-1" />
          <div className="pb-2">
            <p className="body-small pt-1">
              I understand that deleting my account is permanent and cannot be undone. All my data
              will be permanently removed from the system.
            </p>
          </div>
        </div>

        <div>
            <DropdownMenu className="bg-dark"/>
        </div>
        <div className="flex gap-2 text-center justify-center h-11 px-4 mt-6">
          <Link
            href="/dashboard/account"
            className="flex items-center justify-center border-border-primary border-2 bg-primary rounded-md px-4 py-2 button-medium text-white w-full"
          >
            Cancel
          </Link>
          <Link
            href=""
            className="flex items-center justify-center border-border-attention border-2 rounded-md px-4 py-2 button-medium text-attention-default w-full"
          >
         Delete Account
          </Link>
        </div>
      </ContentWrapper>
    </>
  )
}
