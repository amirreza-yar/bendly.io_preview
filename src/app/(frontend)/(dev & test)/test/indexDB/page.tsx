'use client'
import { db } from '@/lib/db/appDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const mats = useLiveQuery(() => db.materialsAndProps.toArray(), [])

  console.log(mats)

  // const [content, setContent] = useState()

  // const [mats, setMats] = useState()

  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const mats = await db.materialsAndProps.toArray()

  //       setMats(mats)

  //       // db.open()
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   })()
  // }, [])

  return (
    <>
      {mats?.map((mat, index) => (
        <div key={index}>{mat.material}</div>
      ))}
    </>
  )
}
