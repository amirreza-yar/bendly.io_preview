'use client'
import { ReactNode, useEffect, useState } from 'react'
import {
  ChevronDown,
  Clipboard,
  ClipboardBold,
  DateIcon,
  GearSetting,
  GearSettingBold,
  Logout,
  MainLogo,
  Overview,
  OverviewBold,
  Replacement,
  ReplacementBold,
  User,
  UserAvatar,
  Users,
  UsersBold,
} from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/uikit/sidebar'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/uikit/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/uikit/buttons/button'
import { DropdownMenuGroup } from '@/components/uikit/dropdown-menu'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'

const data = {
  navMain: [
    {
      title: 'Overview',
      url: '/ff-admin',
      icon: Overview,
      activeIcon: OverviewBold,
      isActive: true,
    },
    {
      title: 'Orders Management',
      url: '/ff-admin/order',
      icon: Clipboard,
      activeIcon: ClipboardBold,
      isActive: true,
    },
    {
      title: 'Replacements',
      url: '/ff-admin/replacement',
      icon: Replacement,
      activeIcon: ReplacementBold,
      isActive: true,
    },
    {
      title: 'Customers',
      url: '/ff-admin/customer',
      icon: Users,
      activeIcon: UsersBold,
      isActive: true,
    },
    {
      title: 'Settings',
      url: '/ff-admin/setting',
      icon: GearSetting,
      activeIcon: GearSettingBold,
      isActive: true,
    },
  ],
}

export default function AdminDashbaordLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [navIndex, setNavIndex] = useState(-1)

  useEffect(() => {
    if (pathname.startsWith('/ff-admin/order')) {
      setNavIndex(1)
    } else if (pathname.startsWith('/ff-admin/replacement')) {
      setNavIndex(2)
    } else if (pathname.startsWith('/ff-admin/customer')) {
      setNavIndex(3)
    } else if (pathname.startsWith('/ff-admin/setting')) {
      setNavIndex(4)
    } else {
      setNavIndex(0)
    }
  }, [pathname])

  const { state } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <>
      <Sidebar collapsible="icon" className="bg-white">
        <SidebarHeader className="bg-white px-6 pt-8">
          <SidebarMenuItem className="flex flex-row-reverse items-center justify-between md:pt-0 pt-4">
            <SidebarTrigger
              className={cn(
                state === 'collapsed' && 'rotate-180',
                'text-white disabled md:text-black mr-2',
              )}
              disabled={isMobile}
            />
            {(state === 'expanded' || isMobile) && (
              <div className="flex items-center justify-center rounded-lg gap-4">
                <MainLogo className="size-10" />
                <h4 className="font-semibold text-[24px]/[33px]">Logo</h4>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent className="bg-white p-4">
          <SidebarGroup>
            <SidebarMenu className="gap-3">
              {data.navMain.map((item, index) => (
                <SidebarMenuItem
                  key={index}
                  className={cn(
                    navIndex === index ? 'bg-primary text-white' : 'hover:bg-[#EEEEEE]',
                    'h-12 flex item-center rounded-md transition-[hover]',
                  )}
                >
                  <Link
                    href={item.url}
                    className="w-full h-full p-3 flex items-center justify-between"
                  >
                    <SidebarMenuButton className="gap-4 h-full flex items-center">
                      {navIndex === index ? (
                        <item.activeIcon className="size-6" />
                      ) : (
                        <item.icon className="size-6" />
                      )}
                      <span className="label-regular transition-all">
                        {(state === 'expanded' || isMobile) && item.title}
                      </span>
                    </SidebarMenuButton>

                    {index === 2 && state === 'expanded' && (
                      <Badge variant="red" className="bg-surface-attention text-white" text="2" />
                    )}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white flex-1 items-center justify-end">
          {(state === 'expanded' || isMobile) && (
            <Image
              src="/admin-sidebar.png"
              width={231}
              height={231}
              alt="admin-sidebar"
              className="pb-7"
            />
          )}
          <MainLogo className="size-8 mb-3" />
          {(state === 'expanded' || isMobile) && (
            <span className="font-semibold text-sm/[10px] pb-2">Powered by Flashing Factory</span>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 block md:hidden" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <h4 className="font-semibold text-[24px]/[33px]">
              {navIndex === 0
                ? 'Overview'
                : navIndex === 1
                  ? 'Orders Management'
                  : navIndex === 2
                    ? 'Replacement'
                    : navIndex === 3
                      ? 'Customers'
                      : navIndex === 4 && 'Settings'}
              {isMobile}
            </h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-black mr-2">
                <UserAvatar />
                Amirreza Yarahmadi
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg label-regular"
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <User />
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate">Amirreza Yarahmadi</span>
                    <span className="truncate">m@example.com</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="font-regular">
                <DropdownMenuItem>
                  <User className="text-black" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clipboard className="text-black" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DateIcon className="text-black" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 [&_svg]:text-red-500">
                <Logout className="text-red-500" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </SidebarInset>
    </>
  )
}
