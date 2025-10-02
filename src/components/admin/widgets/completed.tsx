import React from 'react'
import { CheckedBold, CheckedBold2 } from '@/components/uikit/icons'

export default function ProductionWidget({ number }: { number: number }) {
  return (
    <div
      className="relative overflow-hidden flex items-center rounded-lg p-4 h-[118px] text-white"
      style={{
        background: 'linear-gradient(286.76deg, #D2F2DD, #239E4C)',
      }}
    >
      <div className="flex flex-col">
        <div className="flex  items-center gap-2">
          <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 flex-shrink-0">
            <CheckedBold />
          </div>
          <h6 className="text-smd">Completed</h6>
        </div>

        <h2 className="mt-1 ml-14">{number}</h2>
      </div>

      <div className="absolute bottom-0.5 right-0.5 opacity-40">
        <CheckedBold2 />
      </div>
    </div>
  )
}
