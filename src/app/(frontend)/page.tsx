'use client'
import { useEffect } from 'react'

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

  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-10">
      <h4 className="text-center mb-5">
        This page is for installing the PWA. Please use chrome or safari to download it.
      </h4>
      <a href={'/dashboard'}>Go to Main page</a>
    </div>
  )
}
