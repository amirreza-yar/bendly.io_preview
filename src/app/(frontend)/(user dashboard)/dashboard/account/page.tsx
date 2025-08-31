'use client'

import Link from 'next/link'

import {

  Logout,
  Mail,
  PasswordField,
  RightArrow,
  User,
} from '@/components/uikit/icons'
import BottomNav from '@/components/dashboard/bottomNav'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { LogoutModal } from '@/components/dashboard/auth/modals'
import { apiLogout } from '@/utilities/api/user_auth/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser } from '@/providers/main_providers/UserContext'

export default function AccountPage() {
  const {user} = useUser()

  const router = useRouter()

  const onLogoutHandler = async () => {
    const res = await apiLogout()
    if (res.ok) {
      toast('Signed out successfuly')
      router.push('/dashboard')
    } else {
      toast('Something went wrong')
    }
  }

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

            <LogoutModal onLogoutHandler={onLogoutHandler}>
              <ButtonListItem text="Logout" icon={Logout} />
            </LogoutModal>
          </div>

        </ContentWrapper>
      </>
      {/* The main content of page ends here */}

      <BottomNav />
    </>
  )
}
