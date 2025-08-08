'use client'

import { useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  Magnifier,
  MapMarker,
  Plus,
  XIcon,
} from '@/components/uikit/icons'
import { Input } from '@/components/uikit/input'
import { jobReferences, JobReference, searchJobReferences } from '@/utilities/demoJobRefData'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'

export default function JobReferencesPage() {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<JobReference[]>(jobReferences)

  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Header title="Job References" returnHref="/dashboard/profile" />

      {jobReferences.length !== 0 ? (
        <>
          <div className="overflow-scroll h-full pt-14 pb-22 px-4 no-scrollbar">
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
                {searchResults.map((job) => (
                  <Link
                    href={`/dashboard/job-references/${job.code}`}
                    key={job.code}
                    data-slot="card"
                    className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
                  >
                    <ChevronRight className="absolute top-4 right-4" />
                    <div className="grid gap-1 label-regular">
                      <p>JR-{job.code}</p>
                      <p>{job.projectName}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex gap-2">
                        <MapMarker className="size-5" />
                        <div className="flex flex-col gap-1 truncate">
                          <p className="label-regular">{job.addresses[0].title}</p>
                          <p className="body-small">
                            {job.addresses[0].streetAddress}, {job.addresses[0].suburb},{' '}
                            {job.addresses[0].stateAbbreviation} {job.addresses[0].postcode}
                          </p>
                        </div>
                      </div>
                      {job.addresses[1] && (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="label-small">Other Address:</p>
                            <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1">
                              {job.addresses[1].title}
                            </span>
                            {job.addresses.length > 2 && (
                              <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1">
                                +{job.addresses.length - 2}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {searchResults.length === 0 && (
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

          <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
            <div className="w-full h-full">
              <div className="flex justify-around items-center h-full">
                <Link className="w-full" href="/dashboard/job-references/add">
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
          <Link className="w-full" href="/dashboard/job-references/add">
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
