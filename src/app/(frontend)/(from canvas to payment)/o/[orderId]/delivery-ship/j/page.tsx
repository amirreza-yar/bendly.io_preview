'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  Magnifier,
  MapMarker,
  Plus,
  XIcon,
} from '@/components/uikit/icons'
import { Input } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { getAllJobRefs } from '@/lib/db/helpers/jobRefHelpers'
import { StoredJobReference } from '@/types/jobReferenceTypes'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { JobRefCard } from '@/components/dashboard/jobReference/cards'
import { useParams } from 'next/navigation'

export function searchJobReferences(
  data: StoredJobReference[] | null | undefined,
  query: string,
): StoredJobReference[] | null | undefined {
  const normalizedQuery = query.toLowerCase()

  return data?.filter((job) => {
    const valuesToSearch: string[] = []

    const extractValues = (obj: any) => {
      if (typeof obj === 'string' || typeof obj === 'number') {
        valuesToSearch.push(String(obj).toLowerCase())
      } else if (Array.isArray(obj)) {
        obj.forEach(extractValues)
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(extractValues)
      }
    }

    extractValues(job)

    return valuesToSearch.some((value) => value.includes(normalizedQuery))
  })
}

export default function JobReferencesPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const [searchValue, setSearchValue] = useState<string>('')

  const [searchResults, setSearchResults] = useState<StoredJobReference[] | null>()

  const jobReferences = getAllJobRefs()

  console.log(jobReferences)

  useEffect(() => {
    if (jobReferences) {
      setSearchResults(jobReferences)
    }
  }, [jobReferences])

  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Header title="Job References" returnHref={`/o/${orderId}/delivery-ship`} />

      {jobReferences?.length !== 0 ? (
        <>
          <ContentWrapper>
            <div className="grid">
              <div className="w-full py-4 flex items-center relative sticky top-0 z-10">
                <Magnifier className="size-5 absolute left-4" />

                <Input
                  type="text"
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    setSearchValue(value)
                    const results = searchJobReferences(jobReferences, value)
                    setSearchResults(results)
                  }}
                  placeholder="Search template..."
                  className="pl-11 bg-white"
                />

                {searchValue !== '' && (
                  <XIcon
                    className="size-5 absolute right-4 cursor-pointer"
                    onClick={() => {
                      setSearchValue('')
                      setSearchResults(jobReferences)
                      searchInputRef.current?.focus()
                    }}
                  />
                )}
              </div>

              <div className="grid w-full gap-4">
                {searchResults?.map((job, index) => (
                  <JobRefCard job={job} key={index} />
                ))}
              </div>
              {searchResults?.length === 0 && (
                <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
                  <div className="text-center">
                    <h5>No results found</h5>
                    <p className="subtitle-large text-subtitle">
                      Please check your spelling or try different keywords
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ContentWrapper>

          <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
            <div className="w-full h-full">
              <div className="flex justify-around items-center h-full">
                <Link className="w-full" href="/dashboard/j/add">
                  <Button className="w-full">
                    <Plus />
                    Create New Job References
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-10">
          <p className="text-center subtitle-large text-subtitle">
            No job references have been created yet{' '}
          </p>
          <Link className="w-full" href="/dashboard/j/add">
            <Button className="w-full">
              <Plus />
              Create New Job References
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
