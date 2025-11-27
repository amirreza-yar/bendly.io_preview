'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
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
import { useGETAllJobRefs } from '@/lib/db/helpers/jobRefHelpers'
import { StoredJobReference } from '@/types/jobReferenceTypes'
import useSWR from 'swr'
import { fetcher } from '@/lib/axios'
import { Skeleton } from '@/components/uikit/skeleton'
import { Footer } from '@/components/dashboard/footer'

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
  const [searchValue, setSearchValue] = useState<string>('')

  const [searchResults, setSearchResults] = useState<StoredJobReference[] | null>()

  const { data, error, isLoading } = useSWR('/d/job-ref/', fetcher)

  console.log(data?.results)

  const jobReferences = data?.results

  useEffect(() => {
    if (jobReferences) {
      setSearchResults(jobReferences)
    }
  }, [jobReferences])

  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Header title="Job References" returnHref="/dashboard/profile" />

      {jobReferences?.length !== 0 ? (
        <>
          <div className="overflow-scroll h-full pt-14 pb-22 px-4 no-scrollbar">
            <div className="grid">
              <div className="w-full py-4 flex items-center relative sticky top-0 z-10 max-w-[500px] mx-auto">
                {isLoading ? (
                  <Skeleton className="h-11 w-full" />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="grid w-full gap-4 lg:grid-cols-3 md:grid-cols-2 max-w-[900px] mx-auto">
                {isLoading && (
                  <>
                    <Skeleton className="h-38" />
                    <Skeleton className="h-38" />
                    <Skeleton className="h-38" />
                    <Skeleton className="h-38" />
                    <Skeleton className="h-38" />
                    <Skeleton className="h-38" />
                  </>
                )}
                {searchResults?.map((job) => (
                  <Link
                    href={`/dashboard/j/${job?.id}`}
                    key={job?.code}
                    data-slot="card"
                    className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
                  >
                    <ChevronRight className="absolute top-4 right-4" />
                    <div className="grid gap-1 label-regular">
                      <p>JR-{job?.code}</p>
                      <p>{job?.project_name}</p>
                    </div>
                    {(job.addresses?.length ?? 0) > 0 ? (
                      <>
                        <div className="grid gap-2">
                          <div className="flex gap-2">
                            <MapMarker className="size-5" />
                            <div className="flex flex-col gap-1 truncate">
                              <p className="label-regular">{job?.addresses?.[0]?.title}</p>
                              <p className="body-small">
                                {job?.addresses?.[0]?.street_address}, {job?.addresses?.[0]?.suburb}
                                , {job?.addresses?.[0]?.state} {job?.addresses?.[0]?.postcode}
                              </p>
                            </div>
                          </div>
                          {job?.addresses?.[1] ? (
                            <>
                              <div className="flex items-center gap-2">
                                <p className="label-small">Other Address:</p>
                                <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                  {job?.addresses?.[1].title}
                                </span>
                                {job?.addresses?.length > 2 && (
                                  <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                    +{job?.addresses?.length - 2}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <p className="label-small">Other Address:</p>
                                <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                                  ---
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-3 items-start text-alert-default bg-surface-alert-subtle p-3 rounded-md">
                          <AlertTriangle className="size-4 mt-1" />
                          <div className="grid">
                            <p className="text-[14px] font-semibold">
                              Associated addresses deleted
                            </p>
                            <p className="body-small">
                              Add an address to continue or delete this Job Reference.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </Link>
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
          </div>

          <Footer>
            {isLoading ? (
              <Skeleton className="h-11 w-full" />
            ) : (
              <Link className="w-full" href="/dashboard/j/add">
                <Button className="w-full">
                  <Plus />
                  Create New Job References
                </Button>
              </Link>
            )}
          </Footer>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-10 max-w-[600px] mx-auto">
          <p className="text-center subtitle-large text-subtitle">
            No job references have been created yet{' '}
          </p>
          <Link className="w-full" href="/dashboard/j/add">
            <Button className="w-full ">
              <Plus />
              Create New Job References
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
