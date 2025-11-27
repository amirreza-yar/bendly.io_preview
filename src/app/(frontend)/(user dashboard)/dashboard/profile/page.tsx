'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Pencil, RightArrow } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import BottomNav from '@/components/dashboard/bottomNav'
import { apiGetProfile } from '@/utilities/api/auth'
import { db } from '@/lib/db/appDB'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import useSWR from 'swr'
import { fetcher } from '@/lib/axios'
import { Skeleton } from '@/components/uikit/skeleton'
// import { apiGetProfile } from '@/utilities/api/user_auth/auth'

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR('/d/profile/', fetcher)

  return (
    <>
      <Header title="Profile" />

      <ContentWrapper>
        <div className="flex flex-col w-full gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-16" />
            </>
          ) : (
            <Link
              href="/dashboard/account"
              className="flex items-center justify-between rounded-md border-2 border-border-default px-4 py-[10px]"
            >
              <div className="grid gap-2">
                <p className="label-regular text-body">
                  {data?.first_name} {data?.last_name}
                </p>
                <p className="caption-small text-subtitle">{data?.email}</p>
              </div>
              <Pencil className="size-6 text-icon-body" />
            </Link>
          )}

          <div className="grid rounded-md border-2 border-border-default px-4 py-[10px] gap-4">
            <Link href="/dashboard/orders" className="flex items-center justify-between">
              <span className="label-regular">Orders</span>
              <ChevronRight className="size-6" />
            </Link>
            <Separator />
            <Link href="/dashboard/j" className="flex items-center justify-between">
              <span className="label-regular">Job Refrences</span>
              <ChevronRight className="size-6" />
            </Link>
          </div>

          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </ContentWrapper>

      <div className="hidden md:block md:max-w-[1000px] md:mx-auto">
        <BottomNav />
      </div>
    </>
  )
}
