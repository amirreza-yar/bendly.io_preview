'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

export default function DateRangePicker() {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <div className="w-fit border rounded-lg bg-white flex flex-col gap-4 p-4">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2} // shows 2 months side by side
        captionLayout="dropdown"
        className=" w-full border-b-1 border-[#D4D4D4] mb-2 bg-white"
      />

      <div className="flex justify-between items-center text-sm px-2">
        {range?.from && range?.to ? (
          <p>
            Selected: <strong>{range.from.toLocaleDateString()}</strong> →{' '}
            <strong>{range.to.toLocaleDateString()}</strong>
          </p>
        ) : range?.from ? (
          <p>
            Start: <strong>{range.from.toLocaleDateString()}</strong>
          </p>
        ) : (
          <p>Select a start and end date</p>
        )}

        {range && (
          <Button variant="outline" size="sm" onClick={() => setRange(undefined)}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
