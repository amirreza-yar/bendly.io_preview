'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { ArrowLeft } from '@/components/uikit/icons'
import { LabeledInput } from '@/components/uikit/input'
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
      <Header title="Edit Full Name" returnHref="/dashboard/account/edit-account" />

      <ContentWrapper className="pt-18">
        <LabeledInput
          label="Full Name"
          defaultValue={userInfo.name}
          placeholder="Enter Full Name"
        />
      </ContentWrapper>

      <Footer>
        <Button className="w-full bg-primary">Save</Button>
      </Footer>
    </>
  )
}
