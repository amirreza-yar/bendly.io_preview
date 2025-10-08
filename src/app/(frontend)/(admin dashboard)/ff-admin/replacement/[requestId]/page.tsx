'use client'

import ImageGalleryAdvanced from '@/components/admin/imageGallery'
import { CurrentStatusSelect, PrioritySelect } from '@/components/admin/select/badgeSelect'
import { formatDateWithDay } from '@/components/dashboard/order/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import { Button } from '@/components/uikit/buttons/button'
import {
  Check,
  ChevronRight,
  Close,
  HomeNav,
  Mail,
  Maximize,
  Phone,
  Plus,
  ProfileNav,
  Remove,
  SquareClock,
  WareHouse,
} from '@/components/uikit/icons'
import { BadgeSelect } from '@/components/uikit/select'
import { Separator } from '@/components/uikit/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import { Textarea } from '@/components/uikit/textarea'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

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

const tags = ['Production', 'Sample']

export default function AdminDashboardOrderDetails() {
  const { requestId, orderId, flashingId } = useParams()
  const [showInternalNote, setShowInternalNote] = useState<boolean>(false)
  const [internalNoteTags, setInternalNoteTags] = useState<string[]>([])
  const [baseInternalNoteTags, setBaseInternalNoteTags] = useState<string[]>(tags)

  return (
    <div className="bg-[#F1F5F9] p-6">
      <Breadcrumb>
        <BreadcrumbList className="">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ff-admin/">
                <HomeNav className="size-5 text-primary" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ff-admin/replacement" className="text-primary label-regular">
                Replacements
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="label-regular">Request: Rec-{requestId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-3 gap-5 pt-6">
        <div className="col-span-2 grid auto-rows-max gap-6">
          <div className="bg-white rounded-lg p-6">
            <h5>Requested Products</h5>
            <div className="grid gap-3 pt-6">
              <div className="flex items-center justify-start gap-2">
                <div className="h-16 w-16 border border-border-default flex items-center justify-center rounded-md">
                  Flash
                </div>
                <div className="flex flex-col justify-start items-start h-full gap-2 pt-1">
                  <p className="label-regular">Color Bound / Black Matte</p>
                  <p className="body-small">5 pcs x 1000 mm</p>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2">
                <div className="h-16 w-16 border border-border-default flex items-center justify-center rounded-md">
                  Flash
                </div>
                <div className="flex flex-col justify-start items-start h-full gap-2 pt-1">
                  <p className="label-regular">Color Bound / Black Matte</p>
                  <p className="body-small">5 pcs x 1000 mm</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 grid gap-3">
            <h5>Reason for Replacement</h5>
            <span className="px-4 py-2 mb-2 mt-3 label-regular rounded-full bg-surface-disable border border-border-default w-fit">
              Wrong size or dimensions
            </span>
            <h6>Customer Notes:</h6>
            <span className="p-4 body-regular rounded-md bg-surface-disable border border-border-default w-fit">
              I received my order, but one item doesn't match the specified measurements{' '}
            </span>
          </div>

          <div className="bg-white rounded-lg p-6 grid gap-3">
            <h5 className="pb-2">Attachments</h5>
            <ImageGalleryAdvanced
              images={[
                {
                  id: '1',
                  src: '/admin-sidebar.png',
                  alt: 'img1',
                },
                {
                  id: '2',
                  src: '/badge.png',
                  alt: 'img2',
                },
                {
                  id: '3',
                  src: '/website-template-OG.webp',
                  alt: 'img3',
                },
                {
                  id: '4',
                  src: '/admin-sidebar.png',
                  alt: 'img1',
                },
              ]}
            />
          </div>

          <div className="rounded-lg p-6 pb-3 bg-white">
            <h5 className="pb-6">Audit trail</h5>
            <div className="grid divide-y">
              <div className="grid gap-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="label-regular text-heading">Order Completed</p>
                  <p className="flex items-center gap-2 caption-small">
                    <SquareClock className="size-4" /> Sep 8, 2025, 06:00 PM
                  </p>
                </div>
                <p className="body-small">All items delivered and confirmed by customer</p>
                <p className="caption-small text-[#737373]">By: Sarah Mitchell</p>
              </div>
              <div className="grid gap-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="label-regular text-heading">Delivery Confirmed</p>
                  <p className="flex items-center gap-2 caption-small">
                    <SquareClock className="size-4" /> Sep 8, 2025, 06:00 PM
                  </p>
                </div>
                <p className="body-small">Driver: John Thompson, Truck #47</p>
                <p className="caption-small text-[#737373]">By: David Chen</p>
              </div>
              <div className="grid gap-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="label-regular text-heading">Status Updated to Shipped</p>
                  <p className="flex items-center gap-2 caption-small">
                    <SquareClock className="size-4" /> Sep 8, 2025, 06:00 PM
                  </p>
                </div>
                <p className="body-small">Loaded onto delivery truck</p>
                <p className="caption-small text-[#737373]">By: Sarah Mitchell</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 auto-rows-min">
          <div className="bg-white rounded-lg p-6 grid gap-4">
            <h5>Quick Actions</h5>
            <Button variant="secondary">
              <Check />
              Approve
            </Button>
            <Button variant="secondary" className="border-[#E50000] text-[#E50000]">
              <Close />
              Reject
            </Button>
            <Separator />
            {!showInternalNote ? (
              <Button variant="ghost" onClick={() => setShowInternalNote(true)}>
                Add Internal Note
              </Button>
            ) : (
              <div className="border border-border-default rounded-md grid label-regular p-3 gap-2">
                <div className="flex items-center justify-between">
                  Internal Note
                  <Close
                    onClick={() => setShowInternalNote(false)}
                    className="cursor-pointer hover:bg-gray-200 rounded-[4px]"
                  />
                </div>
                <Textarea placeholder="Write internal note here..." />
                <div className="flex flex-wrap gap-2 pt-2">
                  {internalNoteTags?.map((tag, index) => (
                    <button
                      value={tag}
                      key={index}
                      className="bg-[#EEEEEE] flex items-center justify-center gap-1 border border-border-darkest pr-2 pl-1.5 h-8 rounded-xs caption-regular cursor-pointer"
                      onClick={(e) => {
                        const value = e.currentTarget.value
                        setBaseInternalNoteTags((prev) => [...prev, value])
                        setInternalNoteTags((prev) => prev.filter((tag) => tag !== value))
                      }}
                    >
                      <Close className="size-4" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="py-1">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {baseInternalNoteTags.map((tag, index) => (
                    <button
                      value={tag}
                      key={index}
                      className="flex items-center justify-center gap-1 border border-default pr-2 pl-1.5 h-8 rounded-xs caption-regular cursor-pointer"
                      onClick={(e) => {
                        const value = e.currentTarget.value
                        setInternalNoteTags((prev) => [...prev, value])
                        setBaseInternalNoteTags((prev) => prev.filter((tag) => tag !== value))
                      }}
                    >
                      <Plus className="size-4" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
                <Button className="mt-2">Submit</Button>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 grid gap-4">
            <h5>Status & Priority</h5>
            <div className="flex items-center justify-between">
              <p>Current Status</p>
              <CurrentStatusSelect status="PE" />
            </div>
            <div className="flex items-center justify-between">
              <p>Priority</p>
              <PrioritySelect status="NO" />
            </div>
          </div>

          <div className="bg-white rounded-lg flex flex-col p-6 gap-3">
            <h5>Request Information</h5>
            <div className="flex items-center justify-between pt-3">
              <span className="body-regular">Request ID</span>
              <span className="body-regular font-bold">Rec-{orderData.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="body-regular">Request Date</span>
              <span className="body-regular font-bold">
                {formatDateWithDay(orderData.deliveryDate)}
              </span>
            </div>
            <div className="grid gap-3 rounded-md border border-border-default p-3">
              <div className="flex items-center justify-between body-small">
                Original Order ID
                <span className="font-bold">12345678</span>
              </div>
              <div className="flex items-center justify-between body-small">
                Order Date
                <span className="font-bold">{formatDateWithDay(orderData.deliveryDate)}</span>
              </div>
              <Button variant="secondary" className="pt-1">
                View Original Order
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg flex flex-col p-6 gap-3">
            <div className="grid gap-3 body-small">
              <h5 className="py-2">Customer Information</h5>
              <p>John Smith</p>
              <p>john.smith@domain.co</p>
              <p>++61234567890</p>
              <Button variant="secondary">
                <Phone />
                Call
              </Button>
              <Button variant="secondary">
                <Mail />
                Send Mail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
