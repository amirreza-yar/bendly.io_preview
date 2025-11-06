'use client'

import { Calendar, CalendarDayButton } from '@/components/uikit/calendar'
import { useEffect, useState } from 'react'
import { DayPicker, getDefaultClassNames, type DateRange } from 'react-day-picker'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import Link from 'next/link'
import { ChevronDown, Download, GearSetting } from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import { Calendar1, CalendarCog, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/uikit/badge'
import { Button } from '@/components/uikit/buttons/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/uikit/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { Input } from '@/components/uikit/input'

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  // Format date as "25 July, 2025"
  const day = time.getDate()
  const month = time.toLocaleString('default', { month: 'long' })
  const year = time.getFullYear()

  return (
    <div className="flex flex-col items-center -mt-2">
      <span className="text-lg font-semibold">
        {hours}:{minutes}:{seconds}
      </span>
      <span className="label-regular text-gray-500">
        {day} {month}, {year}
      </span>
    </div>
  )
}

export default function FactoryWorkingDays() {
  const today = new Date()

  // List of special unrelated dates
  const specialDates = [
    new Date(2025, 10, 12),
    new Date(2025, 11, 12),
    new Date(2025, 11, 15),
    new Date(2025, 11, 2),
    new Date(2025, 12, 4),
  ]

  // Helper functions for recurring patterns
  const isFriday = (date: Date) => date.getDay() === 5
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

  // Optional: highlighted range (not selectable)
  const [dateRange, setDateRange] = useState(undefined)

  const modifiers = {
    start: (date: Date) => isFriday(date), // start of range
    middle: (date: Date) => date.getDay() === 6, // Saturday = middle
    end: (date: Date) => date.getDay() === 0, // Sunday = end
  }

  const modifiersClassNames = {
    start: 'rounded-l-md bg-orange-100 hover:bg-orange-100', // left rounded
    middle: 'rounded-none bg-orange-100 hover:bg-orange-100', // middle no rounding
    end: 'rounded-r-md bg-orange-100 hover:bg-orange-100', // right rounded
    special: 'bg-red-100 hover:bg-red-100 rounded-md',
    today: 'bg-blue-100 border border-blue-400 hover:bg-blue-100 rounded-md',
  }

  const defaultClassNames = getDefaultClassNames()

  return (
    <div className="bg-[#F1F5F9] h-full relative p-6">
      <Breadcrumb className="pb-6">
        <BreadcrumbList className="">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ff-admin/setting">
                <GearSetting className="size-5 text-primary" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Factory Days</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="p-8 bg-white flex flex-col border border-border-default rounded-lg min-h-[calc(100%-50px)]">
        <div className="flex items-start justify-between pb-8 mt-2 ">
          <div className="space-y-2">
            <h5>Factory Date / Time Settings</h5>
            <p className="label-regular text-subtitle">The settings relevant to this dashboard.</p>
          </div>
          <LiveClock />
        </div>
        <div className="bg-gray-50 border border-border-default rounded-lg flex gap-8 justify-between p-6">
          <div className="py-4 flex flex-col gap-4">
            <div>
              <h5>Factory Calendar</h5>
              <p className="body-small text-gray-500 pt-1">
                Calendar indicates the factory work / off days.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 grow">
              <div className="flex gap-1 text-[14px]/[16px] font-regular truncate">
                <Badge variant="blue" text="Blue" />
                day shows today.
              </div>
              <div className="flex gap-1 text-[14px]/[16px] font-regular truncate">
                <Badge variant="red" text="Red" />
                days show special days off.
              </div>
              <div className="flex gap-1 text-[14px]/[16px] font-regular truncate">
                <Badge variant="orange" text="Orange" />
                days show regular days off.
              </div>
            </div>

            <Button variant="ghost" className=" bg-gray-50 shadow-none hover:bg-primary-lightest">
              <Download className="size-4" />
              Export Factory Calendar
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <Calendar1 className="size-4" />
                  Edit Special days off
                </Button>
              </PopoverTrigger>

              <PopoverContent side="top" className="space-y-2 w-140 flex justify-between p-0">
                <div className="flex flex-col space-y-4 p-8">
                  <div className="space-y-2 grow">
                    <h6>Edit Special Days Off</h6>
                    <p className="label-regular text-gray-400 pb-2">
                      Select multiple days as special days off.
                    </p>
                    <Input placeholder="Description..." className="border-1 bg-gray-50" />
                  </div>

                  <div className="flex gap-3 justify-end w-full">
                    <PopoverClose asChild>
                      <Button variant="secondary" className="grow">
                        Discard
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button onClick={() => {}} className="grow">
                        Submit
                      </Button>
                    </PopoverClose>
                  </div>
                </div>

                <Calendar
                  mode="multiple"
                  selected={specialDates}
                  className="[--cell-size:--spacing(8)]"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <CalendarCog className="size-4" />
                  Edit Regular days off
                </Button>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                className="space-y-4 w-120 flex flex-col justify-between p-6"
              >
                <div className="space-y-2">
                  <h6>Edit Special Days Off</h6>
                  <p className="label-regular text-gray-400 pb-2">
                    Select multiple days as special days off.
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-4 p-2 pb-4">
                  <div className="aspect-square text-[14px]/[16px] font-black bg-primary-light text-primary-dark flex flex-col gap-1 pb-3 items-center justify-center border-2 border-primary-dark rounded-md">
                    <p className="caption-small text-primary/80">every</p>
                    Sunday
                  </div>
                  <div className="aspect-square label-regular  flex flex-col gap-1 pb-3 items-center justify-center border-2 border-gray-300 rounded-md">
                    <p className="caption-small text-gray-500">every</p>
                    Monday
                  </div>
                  <div className="aspect-square label-regular  flex flex-col gap-1 pb-3 items-center justify-center border-2 border-gray-300 rounded-md">
                    <p className="caption-small text-gray-500">every</p>
                    Tuesday
                  </div>
                  <div className="aspect-square label-regular  flex flex-col gap-1 pb-3 items-center justify-center border-2 border-gray-300 rounded-md">
                    <p className="caption-small text-gray-500">every</p>
                    Wednesday
                  </div>
                  <div className="aspect-square label-regular  flex flex-col gap-1 pb-3 items-center justify-center border-2 border-gray-300 rounded-md">
                    <p className="caption-small text-gray-500">every</p>
                    Thursday
                  </div>
                  <div className="aspect-square text-[14px]/[16px] font-black bg-primary-light text-primary-dark flex flex-col gap-1 pb-3 items-center justify-center border-2 border-primary-dark rounded-md">
                    <p className="caption-small text-primary/80">every</p>
                    Friday
                  </div>
                  <div className="aspect-square text-[14px]/[16px] font-black bg-primary-light text-primary-dark flex flex-col gap-1 pb-3 items-center justify-center border-2 border-primary-dark rounded-md">
                    <p className="caption-small text-primary/80">every</p>
                    Satarday
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <PopoverClose asChild>
                    <Button className="min-w-25" variant="secondary">
                      Discard
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button className="min-w-25" onClick={() => {}}>
                      Submit
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <DayPicker
            mode="single"
            numberOfMonths={3}
            modifiers={{
              ...modifiers,
              special: specialDates,
            }}
            modifiersClassNames={modifiersClassNames}
            showOutsideDays={true}
            className="max-w-[80%] p-4"
            classNames={{
              root: cn('w-full', defaultClassNames.root),
              months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
              month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
              nav: cn(
                'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
                defaultClassNames.nav,
              ),
              button_previous: cn(
                'size-(--cell-size) p-0 select-none',
                defaultClassNames.button_previous,
              ),
              button_next: cn('size-(--cell-size) p-0 select-none', defaultClassNames.button_next),
              month_caption: cn(
                'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
                defaultClassNames.month_caption,
              ),
              caption_label: cn('select-none font-medium text-sm', defaultClassNames.caption_label),
              weekdays: cn('flex', defaultClassNames.weekdays),
              weekday: cn(
                'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
                defaultClassNames.weekday,
              ),
              week: cn('flex w-full mt-2', defaultClassNames.week),
              day: cn(
                'relative w-full h-full p-0 [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day pointer-events-none',
              ),
              outside: cn(
                'text-muted-foreground/70 aria-selected:text-muted-foreground',
                defaultClassNames.outside,
              ),
            }}
            components={{
              Root: ({ className, rootRef, ...props }) => {
                return (
                  <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
                )
              },
              Chevron: ({ className, orientation, ...props }) => {
                if (orientation === 'left') {
                  return <ChevronLeft className={cn('size-4', className)} {...props} />
                }

                if (orientation === 'right') {
                  return <ChevronRight className={cn('size-4', className)} {...props} />
                }

                return <ChevronDown className={cn('size-4', className)} {...props} />
              },
              DayButton: CalendarDayButton,
              WeekNumber: ({ children, ...props }) => {
                return (
                  <td {...props}>
                    <div className="flex size-(--cell-size) items-center justify-center text-center">
                      {children}
                    </div>
                  </td>
                )
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
