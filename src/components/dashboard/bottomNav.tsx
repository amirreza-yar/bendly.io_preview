'use client'
import { useEffect, useState } from 'react'
import {
  HomeNav,
  HomeNavBold,
  LibraryNav,
  LibraryNavBold,
  ProfileNav,
  ProfileNavBold,
} from '../uikit/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  const [navIndex, setNavIndex] = useState(-1)

  useEffect(() => {
    if (pathname.startsWith('/dashboard/library')) {
      setNavIndex(1)
    } else if (
      pathname.startsWith('/dashboard/profile') ||
      pathname.startsWith('/dashboard/account')
    ) {
      setNavIndex(2)
    } else {
      // Matches /dashboard, /dashboard/menu, or fallback
      setNavIndex(0)
    }
  }, [pathname])

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 z-50 bg-white border-t-1 border-border-dark flex justify-center">
      <div className="w-full h-full max-w-120">
        <div className="flex justify-around items-center h-full">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 ${navIndex === 0 ? 'text-primary' : 'text-body'}`}
            // onClick={() => setNavIndex(0)}
          >
            {navIndex === 0 ? <HomeNavBold /> : <HomeNav />}
            <span className="label-small">Home</span>
          </Link>
          <Link
            href="/dashboard/library"
            className={`flex flex-col items-center justify-center gap-1 ${navIndex === 1 ? 'text-primary' : 'text-body'}`}
            // onClick={() => setNavIndex(1)}
          >
            {navIndex === 1 ? <LibraryNavBold /> : <LibraryNav />}
            <span className="label-small">Library</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex flex-col items-center justify-center gap-1 ${navIndex === 2 ? 'text-primary' : 'text-body'}`}
            // onClick={() => setNavIndex(2)}
          >
            {navIndex === 2 ? <ProfileNavBold /> : <ProfileNav />}
            <span className="label-small">Account</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
