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

export default function AccountPage() {
  const [userInfo] = useState({
    name: 'Davod Osanlo',
    email: 'davod.osanlo@gmail.com',
    phone: '+1 234 567 8900',
  })

  return (
    <>
      <Header title="Account" returnHref="/dashboard/account" />

      <ContentWrapper>
        <div className="grid pt-4">
          <Link href="/dashboard/account/edit-account/edit-fullname">
            <ButtonListItem text="Edit Full Name" caption="Amirreza Yarahmadi" />
            <Separator className />
          </Link>
          <Link href="/dashboard/account/edit-mobile">
            <ButtonListItem text="Mobile Number" caption="+619876541230" badgeText="Verified" />
          </Link>
        </div>
      </ContentWrapper>

      <Footer>
        <Button className="w-full bg-primary">Save</Button>
      </Footer>
    </>
  )
}
