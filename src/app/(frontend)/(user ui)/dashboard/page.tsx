'use client'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Button } from '@/components/uikit/buttons/button'
import JobRefCard from '@/components/uikit/cards/jobRefCard'
import DividerWithText from '@/components/uikit/dividerWithText'
import { ChevronRight, HomeMenu, Info, NewOrder } from '@/components/uikit/icons'
import Link from 'next/link'
import BottomNav from '@/components/dashboard/bottomNav'
import { useEffect } from 'react'
import { jobReferences } from '@/utilities/demoJobRefData'

export default function Page() {
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
          <Link href="/2sdaasda/select-material-and-color" className="w-full">
            <Button className="w-full">
              <span>New Order</span>
              <NewOrder />
            </Button>
          </Link>
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
              href="/dashboard/job-references"
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
