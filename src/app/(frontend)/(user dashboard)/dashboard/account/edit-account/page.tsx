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
import { useQuery } from '@apollo/client/react'
import { getUserQuery } from '@/lib/api'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'

export default function AccountPage() {
  const userId = useLiveQuery(() => db.userProfile.toCollection().first())?.id

  const { loading, error, data } = useQuery(getUserQuery, { variables: { id: userId } })

  return (
    <>
      <Header title="Account" returnHref="/dashboard/account" />

      <ContentWrapper>
        <div className="grid pt-4">
          <Link href="/dashboard/account/edit-account/edit-fullname">
            <ButtonListItem
              text="Edit Full Name"
              caption={`${data?.user?.fullname}`}
              loading={loading}
            />
            <Separator />
          </Link>
          <Link href="/dashboard/account/edit-account/edit-mobile">
            <ButtonListItem
              text="Mobile Number"
              caption={data?.user?.phone ? `+${data?.user.phone}` : 'Not set'}
              badgeText={'Verified'}
              loading={loading}
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
