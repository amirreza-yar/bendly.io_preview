'use client'
import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'

export default function DatePicker() {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>['captionLayout']>('dropdown')
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))
  return (
    <div className="w-107 h-[375px] border rounded-lg bg-white flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className=" border shadow-sm w-full rounded-md bg-white"
      />
    </div>
  )
}
