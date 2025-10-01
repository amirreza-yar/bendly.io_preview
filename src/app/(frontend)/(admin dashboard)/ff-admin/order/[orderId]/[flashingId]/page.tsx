'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import { HomeNav, Maximize } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

export default function AdminDashboardOrderDetails() {
  const { orderId, flashingId } = useParams()

  return (
    <div className="bg-[#F1F5F9] h-full p-6">
      <Breadcrumb>
        <BreadcrumbList className="">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ff-admin/order">
                <HomeNav className="size-5 text-primary" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="label-regular">Order: {orderId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-3 gap-5 pt-6">
        <div className="bg-white rounded-lg col-span-2">
          <h5 className="w-full border-b border-border-default p-6">
            Flashing #{orderData.flashings.findIndex((flash) => flash.id === flashingId) + 1} Detail
          </h5>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center p-6 w-full">
              <Tabs defaultValue="measures" onValueChange={(v) => {}}>
                <TabsList className="mx-auto max-w-110 w-full">
                  <TabsTrigger value="measures" className="text-xs sm:text-sm">
                    Measures
                  </TabsTrigger>
                  <TabsTrigger value="color-side" className="text-xs sm:text-sm">
                    Color Side
                  </TabsTrigger>
                  <TabsTrigger value="taper" className="text-xs sm:text-sm">
                    Taper
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="w-full h-64 flex justify-center items-center">Canvas here</div>
              <span className="text-[14px]/[17px] self-start">Unit: mm</span>
              <Maximize className="absolute right-12 bottom-11" />
            </div>
            <div className="w-full px-6">
              <Separator className="" />
            </div>
            <div className="grid grid-cols-2 p-6 gap-6 w-full">
              <div className="border border-border-default rounded-md flex flex-col p-4 gap-3">
                <h5>Specifications</h5>
                <div className="flex items-center justify-between pt-3">
                  <span className="body-regular">Total Girth</span>
                  <span className="body-regular font-bold">
                    {
                      orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                        .totalGirth
                    }{' '}
                    mm
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-regular">Material</span>
                  <span className="body-regular font-bold">
                    {
                      orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                        .material
                    }
                  </span>
                </div>
                {orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails.color ? (
                  <div className="flex items-center justify-between">
                    <span className="body-regular">Color</span>
                    <span className="body-regular font-bold">
                      {
                        orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                          .color?.name
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="body-regular">Thickness</span>
                    <span className="body-regular font-bold">
                      {
                        orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                          .thickness?.thickness
                      }{' '}
                      mm
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="body-regular">Tapered</span>
                  <span className="body-regular font-bold">
                    {orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                      .tapered
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-regular">Crush Fold</span>
                  <span className="body-regular font-bold">
                    {orderData.flashings.find((flash) => flash.id === flashingId)?.moreDetails
                      .crushFold
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="body-regular">Code</span>
                  <span className="body-regular font-bold">
                    {orderData.flashings.find((flash) => flash.id === flashingId)?.code}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-regular">Position</span>
                  <span className="body-regular font-bold">
                    {orderData.flashings.find((flash) => flash.id === flashingId)?.position}
                  </span>
                </div>
              </div>
              <div className="border border-border-default h-12 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="bg-white aspect-video rounded-lg" />
      </div>
    </div>
  )
}
