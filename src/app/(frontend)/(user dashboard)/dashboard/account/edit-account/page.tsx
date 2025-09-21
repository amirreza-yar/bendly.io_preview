'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { RightArrow, ArrowLeft } from '@/components/uikit/icons'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { useUser } from '@/providers/main_providers/UserContext'

export default function AccountPage() {
  const {user} = useUser()

  return (
    <>
      <Header title="Account" returnHref="/dashboard/account" />

      <ContentWrapper>
        <div className="grid pt-4">
          <Link href="/dashboard/account/edit-account/edit-fullname">
            <ButtonListItem text="Edit Full Name" caption={user?.fullname || 'Not set'} />
            <Separator className />
          </Link>
          <Link href="/dashboard/account/edit-account/edit-mobile">
            <ButtonListItem 
              text="Mobile Number" 
              caption={user?.mobile ? `+${user.mobile}` : 'Not set'} 
              badgeText={user?.mobile ? "Verified" : undefined} 
            />
          </Link>
        </div>
      </ContentWrapper>

      <Footer>
        <Button className="w-full bg-primary">Save</Button>
      </Footer>
    </>
  )
}
