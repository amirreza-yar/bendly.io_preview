'use client'
import { Carousel, CarouselContent, CarouselItem } from '@/components/uikit/carousel'
import { Button } from '@/components/uikit/buttons/button'
import JobRefCard from '@/components/uikit/cards/jobRefCard'
import DividerWithText from '@/components/uikit/dividerWithText'
import { ChevronRight, HomeMenu, Info, NewOrder } from '@/components/uikit/icons'
import Link from 'next/link'
import BottomNav from '@/components/dashboard/bottomNav'
import { useEffect, useRef } from 'react'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { deleteAllDraftFlashings, initNewFlashing } from '@/lib/db/helpers/flashingHelpers'
import { redirect, useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'

export default function Page() {
  const router = useRouter()

  const didRunRef = useRef(false)

  useEffect(() => {
    if (!didRunRef.current) {
      didRunRef.current = true
      deleteAllDraftFlashings().catch((err) => {
        console.error('Failed to delete draft flashings:', err)
      })
    }
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('sw registered!')
          console.log(reg)
        })
        .catch((error) => {
          console.log('sw reg failed!')
          console.log(error)
        })
    }
  }, [])

  const jobRefsList = [
    {
      jobRefrenceCode: 'JR-1234',
      jobRefrenceText: 'Downtown Office Renovation',
      locationName: 'Main Building',
      locationAddress: '123 Collins Street, Melbourne, VIC 3000',
    },
    {
      jobRefrenceCode: 'JR-1234',
      jobRefrenceText: 'Downtown Office Renovation',
      locationName: 'Main Building',
      locationAddress: '123 Collins Street, Melbourne, VIC 3000',
    },
    {
      jobRefrenceCode: 'JR-1234',
      jobRefrenceText: 'Downtown Office Renovation',
      locationName: 'Main Building',
      locationAddress: '123 Collins Street, Melbourne, VIC 3000',
    },
    {
      jobRefrenceCode: 'JR-1234',
      jobRefrenceText: 'Downtown Office Renovation',
      locationName: 'Main Building',
      locationAddress: '123 Collins Street, Melbourne, VIC 3000',
    },
  ]

  const newFlashing = () => {
    initNewFlashing().then((flashingId) => {
      router.push(`/f/${flashingId}`)
    })
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white">
        <div className="flex items-center justify-center h-full">
          <h6 className="text-heading">Flashing Factory</h6>
        </div>
        <Link href="/dashboard/menu" className="absolute right-4">
          <HomeMenu />
        </Link>
      </header>
      <div className="pt-14 pb-16 h-full flex overflow-scroll px-4">
        <div className="flex flex-col items-center justify-center w-full">
          <p className="label-small pb-2">
            Start a new order from scratch and add project details later
          </p>
          <Button className="w-full" onClick={newFlashing}>
            <span>New Order</span>
            <NewOrder />
          </Button>
          <div className="flex pt-4 gap-1 [&_svg]:size-3 [&_svg]:mt-[2px] caption-small text-body">
            <Info />
            <p>Each Job Reference can include multiple delivery addresses</p>
          </div>

          <DividerWithText text="OR" className="py-8" />

          <p className="label-small">
            Continue with an existing project and create a new order for it
          </p>

          <div className="flex justify-between items-center w-full py-4">
            <h6>Recent Job Reference</h6>
            <Link
              href="/dashboard/j"
              className="flex items-center [&_svg]:size-5 gap-2 text-sm/[17px] font-semibold text-primary"
            >
              <span>View All</span>
              <ChevronRight />
            </Link>
          </div>

          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent className="">
              {jobReferences.slice(0, 5).map((item, index) => (
                <CarouselItem key={index} className="pt-1">
                  <div className="">
                    <JobRefCard
                      jobRefrenceCode={item.code}
                      jobRefrenceText={item.projectName}
                      locationName={item.addresses[0].title}
                      locationAddress={`${item.addresses[0].streetAddress}, ${item.addresses[0].suburb}, ${item.addresses[0].state}, ${item.addresses[0].postcode}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
