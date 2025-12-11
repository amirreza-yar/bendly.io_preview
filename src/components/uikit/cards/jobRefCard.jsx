import * as React from 'react'

import { cn } from '@/utilities/ui'
import { MapMarker } from '../icons'
import Link from 'next/link'

export default function JobRefCard({
  jobRefrenceCode,
  jobRefrenceText,
  locationName,
  locationAddress,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col rounded-md border-1 border-border-default bg-surface-card py-3 px-4 w-[280px]',
      )}
      {...props}
    >
      <div className="flex flex-col gap-1 label-regular">
        <p>JR-{jobRefrenceCode}</p>
        <p>{jobRefrenceText}</p>
      </div>
      <div className="flex pt-4 [&_svg]:size-5 gap-2">
        <MapMarker />
        <div className="flex flex-col gap-1 truncate">
          <p className="label-regular">{locationName}</p>
          <p className="body-small">{locationAddress}</p>
        </div>
      </div>
    </div>
  )
}
