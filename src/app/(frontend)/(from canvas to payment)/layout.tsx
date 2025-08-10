'use client'
import { usePageNavigationAppRouter } from '@/hooks/usePageNavigationRouter'
import { useLiveQuery } from 'dexie-react-hooks'
import Image from 'next/image'
import React from 'react'

export default function MyComponent({ children }: { children: React.ReactNode }) {
  // const { isBusy } = usePageNavigationAppRouter()

  // skip expensive or strict checks while the page is navigating/unloading
  // if (isBusy)
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
  //       <div className="text-center lg:text-[10rem] md:text-[7rem] text-[5rem]">
  //         <img src="/icon-512x512.png" alt="logo"></img>
  //       </div>
  //     </div>
  //   )

  // safe to run checks now
  // ...
  return <>{children}</>
}
