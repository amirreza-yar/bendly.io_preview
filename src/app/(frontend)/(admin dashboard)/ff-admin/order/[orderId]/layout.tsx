'use client'
import { ReactNode, useEffect, useState } from 'react'
import {
  ArrowLeft,
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
import { useParams, usePathname, useSearchParams } from 'next/navigation'
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

const orderData = {
  id: 11969514,
  status: 'Pending',
  deliveryType: 'delivery',
  progress: 'Order Received',
  createdAt: 1755368306239,
  updatedAt: 1755532064812,
  flashings: [
    {
      id: '924ws8',
      code: 'CODE-1',
      position: 'LS01',
      specifications: [
        {
          quantity: 2,
          length: 550,
          id: 'hyfq',
          flashingId: '924ws8',
          cost: 48.51,
        },
        {
          quantity: 8,
          length: 1230,
          id: 'j5p2',
          flashingId: '924ws8',
          cost: 433.944,
        },
        {
          quantity: 6,
          length: 5200,
          id: 'ztk2',
          flashingId: '924ws8',
          cost: 1375.92,
        },
      ],
      moreDetails: {
        nodes: [
          {
            node_id: 'gwomd9',
            left: 100,
            top: 350,
            next_node_id: '9rnao4',
          },
          {
            node_id: '9rnao4',
            left: 50,
            top: 500,
            prev_node_id: 'gwomd9',
            next_node_id: 'jeq3bi',
          },
          {
            node_id: 'jeq3bi',
            left: 150,
            top: 500,
            prev_node_id: '9rnao4',
            next_node_id: '6jagob',
          },
          {
            node_id: '6jagob',
            left: 200,
            top: 400,
            prev_node_id: 'jeq3bi',
            next_node_id: 'b7lk16',
          },
          {
            node_id: 'b7lk16',
            left: 150,
            top: 350,
            prev_node_id: '6jagob',
          },
        ],
        startCrushFold: false,
        endCrushFold: false,
        crushFoldDir: false,
        material: 'Stainless steel',
        createdAt: 1755368254753,
        updatedAt: 1755368273619,
        isDraft: false,
        colorSideDirection: false,
        thickness: {
          code: 'SS304-08',
          thickness: 0.8,
        },
        crushFold: false,
        tapered: false,
        totalGirth: 441,
      },
    },
    {
      id: '3u8rlw',
      code: 'CODE-2',
      position: 'LS02',
      specifications: [
        {
          quantity: 3,
          length: 335,
          id: '221n',
          flashingId: '3u8rlw',
          cost: 57.3855,
        },
        {
          quantity: 4,
          length: 1230,
          id: 'jtt5',
          flashingId: '3u8rlw',
          cost: 280.932,
        },
        {
          quantity: 7,
          length: 2000,
          id: 'mm7n',
          flashingId: '3u8rlw',
          cost: 799.4,
        },
      ],
      moreDetails: {
        nodes: [
          {
            node_id: 'q7pr3s',
            left: 100,
            top: 250,
            next_node_id: 'l3nwc3',
          },
          {
            node_id: 'l3nwc3',
            left: 50,
            top: 400,
            prev_node_id: 'q7pr3s',
            next_node_id: 'gr3mbq',
          },
          {
            node_id: 'gr3mbq',
            left: 200,
            top: 450,
            prev_node_id: 'l3nwc3',
            next_node_id: 'mc79x4',
          },
          {
            node_id: 'mc79x4',
            left: 150,
            top: 200,
            prev_node_id: 'gr3mbq',
          },
        ],
        startCrushFold: true,
        endCrushFold: true,
        crushFoldDir: false,
        material: 'Aluminium',
        createdAt: 1755368317610,
        updatedAt: 1755368329343,
        isDraft: false,
        colorSideDirection: false,
        color: {
          name: 'Copper',
          code: '#B87333',
        },
        crushFold: true,
        tapered: false,
        totalGirth: 571,
      },
    },
  ],
  jobRefrence: {
    id: '0r0t',
    code: 3568,
    projectName: 'Airport Terminal Expansion',
  },
  address: {
    title: 'Map Building',
    streetAddress: '1 Airport Drive',
    suburb: 'Melbourne',
    state: 'ACT',
    postcode: 3231,
  },
  recipientInfo: {
    recipientName: 'Amirreza Yarahmadi',
    recipientMobile: 8987654123,
  },
  deliveryDate: 1756080000000,
  pickupInfo: {
    desc: 'Open: Mon-Fri, 9:00 AM - 6:00 PM',
    address: {
      streetAddress: 'Warehouse A',
      suburb: 'Wattle Downs',
      state: 'SA',
      postcode: 5162,
    },
  },
  totalCost: 3307.7006499999998,
  GST: 299.60915,
  flashingTotalCost: 2996.0915,
  deliveryCost: 12,
  deliveryDesc: 'Available from 2 business days',
  notes: '',
  paymentHistory: {
    id: '1dmo9c',
    orderId: '11969514',
    total: 3307.7006499999998,
    date: 1755532064810,
    transactionId: 'pi_3NXY789012345678',
    via: 'credit-card',
  },
  completed: true,
}

export default function AdminDashboardOrderDetailsLayout({ children }: { children: ReactNode }) {
  const { flashingId, orderId } = useParams()

  return (
    <>
      <Sidebar collapsible="icon" className="bg-white">
        <SidebarHeader className="bg-white px-6 pt-8">
          <SidebarMenuItem className="flex items-center justify-between md:pt-0 pt-4">
            <div className="flex items-center justify-start rounded-lg gap-4">
              <MainLogo className="size-10" />
              <h4 className="font-semibold text-[24px]/[33px]">Logo</h4>
            </div>
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent className="bg-white p-4">
          <SidebarGroup>
            <SidebarMenu className="gap-3">
              {orderData.flashings.map((flash, index) => (
                <SidebarMenuItem
                  key={flash.id}
                  className={cn(
                    flashingId === flash.id
                      ? 'border border-primary bg-primary-light'
                      : 'hover:bg-[#EEEEEE]',
                    'border border-border-default flex item-center rounded-md transition-[hover]',
                  )}
                >
                  <Link
                    href={`/ff-admin/order/${orderId}/${flash.id}`}
                    className="w-full h-full p-2 flex items-center justify-between"
                  >
                    <SidebarMenuButton className="gap-4 h-full flex items-center">
                      <div className="h-16 w-16 rounded-md border border-border-default bg-white" />
                      <div className="flex flex-col justify-between items-start label-regular transition-all">
                        <span className="font-bold text-sm/[26px]">Flashing #{index + 1}</span>
                        <span className="body-small pt-1">
                          Qty:{' '}
                          {flash.specifications.reduce(
                            (sum: number, spec: any) => sum + spec.quantity,
                            0,
                          )}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white flex-1 items-center justify-end">Support</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-4 px-4">
            <Link href="/ff-admin/order">
              <ArrowLeft className="size-8" />
            </Link>
            <h4 className="font-semibold text-[24px]/[33px]">Order: {orderId}</h4>
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
