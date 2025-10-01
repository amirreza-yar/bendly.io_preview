import React from 'react'
import { Production1, Factorybold } from '@/components/uikit/icons'

export default function ProductionWidget() {
  return (
    <div
      className="relative overflow-hidden flex items-center rounded-[32px] p-4 sm:p-6 w-full max-w-[263px] h-auto min-h-[118px] text-white"
      style={{
        background: 'linear-gradient(286.76deg, #FFD0D0 , #FF4343 )',
      }}
    >
      <div className="flex flex-col">
        <div className="flex  items-center gap-2">
          <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
            <Factorybold />
          </div>
          <h6 className="text-smd sm:text-lg font-semibold">In Production</h6>
        </div>

        <h2 className="mt-1 ml-13 htext-2xl sm:text-3xl font-bold">10</h2>
      </div>

      <div className="absolute top-1/2 right-0.5 -translate-y-3.5 opacity-40">
        <Production1 />
      </div>
    </div>
  )
}
