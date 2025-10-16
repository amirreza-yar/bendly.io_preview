'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

interface DateRangePickerProps {
  onChange?: (range: { start: Date; end: Date }) => void
}

interface CancelButtonProps {
  onClick?: () => void
  label?: string
  disabled?: boolean
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  label = 'Cancel',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}

export default function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <div className="w-fit rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        captionLayout="dropdown"
        className="rounded-md"
      />

      <div className="flex justify-between items-center text-sm text-gray-700 px-1">
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setRange(undefined)}
          >
            Clear
          </Button>

          <CancelButton onClick={() => setRange(undefined)} label="Cancel" />

          <Button
            variant="default"
            size="sm"
            className="bg-[#3355FF] text-white hover:bg-[#2a44cc]"
            onClick={() => {
              if (range?.from && range?.to && onChange) {
                onChange({ start: range.from, end: range.to })
              }
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
