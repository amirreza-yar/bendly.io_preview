'use client'
import { useState } from 'react'
import Link from 'next/link'

import {
  AlertTriangle,
  ArrowLeft,
  Logout,
  Mail,
  PasswordField,
  RightArrow,
  User,
} from '@/components/uikit/icons'
import BottomNav from '@/components/dashboard/bottomNav'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { AlertModal } from '@/components/uikit/alertModal'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'

export default function AccountPage() {
  const [userInfo] = useState({
    name: 'Davod Osanlo',
    email: 'davod.osanlo@gmail.com',
    phone: '+1 234 567 8900',
  })
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  return (
    <>
      <Header title="Account" returnHref="/dashboard/profile" />
      {/* The main content of page starts here */}
      <>
        <ContentWrapper className="grid content-between">
          <div className="pt-4 grid divide-y divide-border-seprator">
            <Link href="/dashboard/account/edit-account">
              <ButtonListItem
                text="Edit Account Information"
                caption="Full name, Mobile number"
                icon={User}
              />
            </Link>
            <Link href="/dashboard/account/change-email">
              <ButtonListItem text="Change Email" badgeText="Verified" icon={Mail} />
            </Link>
            <Link href="/dashboard/account/change-password">
              <ButtonListItem text="Change Password" icon={PasswordField} />
            </Link>

            <ButtonListItem text="Logout" icon={Logout} onClick={() => setIsModalOpen(true)} />
          </div>
          <div className="flex gap-3 rounded-md border-border-attention border-1 text-attention-default p-3">
            <AlertTriangle className="size-5 mt-1" />
            <div className="pb-2">
              <p className="body-small pb-4">
                Permanently delete your account and all associated data.
              </p>
              <Link
                href=""
                className="border-border-attention border-2 rounded-md px-4 py-2 button-medium text-attention-default"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </ContentWrapper>
      </>
      {/* The main content of page ends here */}

      <BottomNav />

      <AlertModal
        title="Sure About Signing Out?"
        description="Are you sure you want to sign out? You'll need to log in again to access your account"
        cancelButtonText="Cencel"
        actionButtonText="Yes, Logout"
        open={isModalOpen}
        onAction={() => {
          setIsModalOpen(false)
        }}
        onCancle={() => {
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
