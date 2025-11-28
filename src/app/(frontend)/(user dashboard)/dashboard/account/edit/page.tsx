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
import useSWR from 'swr'
import { fetcher } from '@/lib/axios'

export default function AccountPage() {
  const userId = useLiveQuery(() => db.userProfile.toCollection().first())?.id

  const { isLoading, error, data } = useSWR('/d/profile/', fetcher)

  console.log(data)

  return (
    <>
      <Header title="Account" returnHref="/dashboard/account" />

      <ContentWrapper className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4">
        <div className="grid">
          <Link href="/dashboard/account/edit/name">
            <ButtonListItem
              text="Edit Full Name"
              caption={`${data?.first_name} ${data?.last_name}`}
              loading={isLoading}
            />
            <Separator />
          </Link>
          <Link href="#" className="opacity-40">
            <ButtonListItem
              text="Mobile Number"
              caption={data?.phone ? `+${data?.phone}` : 'Not set'}
              badgeText={data?.phone ? 'Verified' : 'Not Set'}
              badgeColor={data?.phone ? 'green' : 'red'}
              loading={isLoading}
            />
          </Link>
        </div>
      </ContentWrapper>

      <Footer>
        <Button className="w-full bg-primary md:max-w-[700px]">Save</Button>
      </Footer>
    </>
  )
}
