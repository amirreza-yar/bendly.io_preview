'use client'

import Link from 'next/link'

import { Logout, Mail, PasswordField, RightArrow, User } from '@/components/uikit/icons'
import BottomNav from '@/components/dashboard/bottomNav'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { LogoutModal } from '@/components/dashboard/auth/modals'
import { apiLogout } from '@/utilities/api/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser } from '@/providers/main_providers/UserContext'
import api from '@/lib/axios'

export default function AccountPage() {
  const { user } = useUser()

  const router = useRouter()

  const onLogoutHandler = async () => {
    try {
      const res = await api.post('/auth/logout/')
      toast('Signed out successfully')
      router.push('/auth')
    } catch (error: any) {
      toast('Something went wrong')
    }
  }

  return (
    <>
      <Header title="Account" returnHref="/dashboard/profile" />

      <>
        <ContentWrapper className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4 grid content-between">
          <div className="grid divide-y divide-border-seprator">
            <Link href="/dashboard/account/edit">
              <ButtonListItem
                text="Edit Account Information"
                caption="Full name, Mobile number"
                icon={User}
              />
            </Link>
            <Link href="#" className="opacity-40">
              <ButtonListItem text="Change Email" badgeText="Verified" icon={Mail} />
            </Link>
            <Link href="#" className="opacity-40">
              <ButtonListItem text="Change Password" icon={PasswordField} />
            </Link>

            <LogoutModal onLogoutHandler={onLogoutHandler}>
              <ButtonListItem text="Logout" icon={Logout} />
            </LogoutModal>
          </div>
        </ContentWrapper>
      </>

      <BottomNav />
    </>
  )
}
