'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Pencil, RightArrow } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import BottomNav from '@/components/dashboard/bottomNav'
import { apiGetProfile } from '@/utilities/api/auth'
// import { apiGetProfile } from '@/utilities/api/user_auth/auth'

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>()

  const getUserInfo = async () => {
    const res = await apiGetProfile()

    if (res?.ok && res?.apiCode === '100700') {
      const user = res?.user
      setUserInfo({
        name: user.fullName,
        email: user.email,
      })
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <h6>Profile</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full flex flex-col items-center self-stretch flex-grow pt-14 pb-20 px-4">
        <div className="flex flex-col w-full py-4 gap-6">
          <Link
            href="/dashboard/account"
            className="flex items-center justify-between rounded-md border-2 border-border-default px-4 py-[10px]"
          >
            <div className="grid gap-2">
              <p className="label-regular text-body">{userInfo?.name}</p>
              <p className="caption-small text-subtitle">{userInfo?.email}</p>
            </div>
            <Pencil className="size-6 text-icon-body" />
          </Link>

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
        </div>
      </div>
      <BottomNav />
    </>
  )
}
