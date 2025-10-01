import React from 'react'
import { BoxDeliverdBold, BoxDeliverdBold2 } from '@/components/uikit/icons'

export default function ReadyWidget() {
  return (
    <div
      className="relative overflow-hidden flex items-center rounded-[32px] p-4 sm:p-6 w-full max-w-[263px] h-auto min-h-[118px] text-white"
      style={{
        background: 'linear-gradient(286.76deg, #D9E2FF , #5981FF )',
      }}
    >
      <div className="flex flex-col">
        <div className="flex  items-center gap-2">
          <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
            <BoxDeliverdBold />
          </div>
          <h6 className="text-smd sm:text-lg font-semibold">Ready</h6>
        </div>

        <h2 className="mt-1 ml-13 htext-2xl sm:text-3xl font-bold">4</h2>
      </div>

      <div className="absolute top-1/2 right-0.5 -translate-y-5 opacity-40">
        <BoxDeliverdBold2 />
      </div>
    </div>
  )
}
