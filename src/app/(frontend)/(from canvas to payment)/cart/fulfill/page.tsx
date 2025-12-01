'use client'

import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/uikit/buttons/button'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import DividerWithText from '@/components/uikit/dividerWithText'
import { Drawer } from 'vaul'
import {
  AlertTriangle,
  CardChecked,
  Check,
  ChevronRight,
  Edit,
  FeaturedCheckSmall,
  FeaturedSuccess,
  Magnifier,
  MapMarker,
  Plus,
  ProfileNav,
  XIcon,
} from '@/components/uikit/icons'
import { TabsContent } from '@/components/uikit/tabs'
import { fetcher } from '@/lib/axios'
import { cn } from '@/utilities/ui'
import { Tabs } from '@radix-ui/react-tabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Footer } from '@/components/dashboard/footer'
import { Input } from '@/components/uikit/input'
import { StoredJobReference } from '@/types/jobReferenceTypes'

export function searchJobReferences(data: any, query: any) {
  const normalizedQuery = query.toLowerCase()

  return data?.filter((job: any) => {
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

const snapPoints = [0.6, 1]

export default function FulFillPage() {
  const [tabValue, setTabValue] = useState('main-tab')

  const [deliveryTypeState, setDeliveryTypeState] = useState<'delivery' | 'pickup'>()
  const [jobReferenceDrawerOpen, setJobReferenceDrawerOpen] = useState<boolean>(false)
  const [jobReferenceDrawerSnap, setJobReferenceDrawerSnap] = useState<number | string | null>(
    snapPoints[0],
  )
  const [isSelectDateDrawerOpen, setIsSelectDateDrawerOpen] = useState<boolean>(false)

  const [searchValue, setSearchValue] = useState<string>('')

  const [searchResults, setSearchResults] = useState<StoredJobReference[] | null>()

  const { data: fetched_job_references } = useSWR('/d/job-ref/', fetcher, {
    onSuccess: (data) => {
      console.log(data.results)
      setSearchResults(data.results)
    },
  })

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [jobReference, setJobReference] = useState<{
    job_reference_id: number
    address_id: number
    code: string
    project_name?: string
    title: string
    full_address: string
    recipient: string
  } | null>()

  const {
    data: cart,
    error,
    isLoading,
    mutate,
  } = useSWR('/d/cart/', fetcher, {
    onError: notFound,
    onSuccess: (data) => {
      setDeliveryTypeState(data.delivery_type)
      // setJobReference({
      //   job_reference_id: data.job_reference.id,
      //   address_id: data.address.id,
      //   code: data.job_reference.code,
      //   project_name: data.job_reference.project_name,
      //   title: data.address.title,
      //   full_address: data.address.full_address,
      //   recipient: `${data.address.recipient_name} - ${data.address.recipient_phone}`,
      // })
    },
  })

  const order = {}

  return (
    <>
      <Tabs className="h-full" value={tabValue} onValueChange={setTabValue}>
        <TabsContent value="main-tab">
          <Header title="Shipping & Delivery" returnHref="/cart" />
          <ContentWrapper className="pt-14 pb-22 px-0 bg-surface-page-body md:px-0">
            <div className="bg-white px-4 py-4">
              <div className="grid grid-cols-2 text-center rounded-md border-2 p-0.5 md:mx-4 border-gray-300">
                <div
                  className={cn(
                    'rounded-md py-1.5 text-[13px]',
                    deliveryTypeState === 'delivery' ? 'bg-primary text-white' : 'text-body',
                  )}
                  onClick={() => setDeliveryTypeState('delivery')}
                >
                  Delivery
                </div>
                <div
                  className={cn(
                    'rounded-md py-1.5 text-[13px]',
                    deliveryTypeState === 'pickup' ? 'bg-primary text-white' : 'text-body',
                  )}
                  onClick={() => setDeliveryTypeState('pickup')}
                >
                  Pickup
                </div>
              </div>

              <div className="grid pb-2 pt-6 px-2">
                <h6>Job Reference</h6>
                {jobReference ? (
                  <div className="grid gap-1">
                    <div
                      data-slot="card"
                      className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mt-4"
                    >
                      <IconButton
                        // onClick={}
                        variant="ghost"
                        black
                        className="absolute top-0 right-0"
                      >
                        <XIcon className="size-5" />
                      </IconButton>
                      <div className="grid gap-1">
                        <p className="text-[16px] font-bold">JR-{jobReference?.code}</p>
                        <p className="text-[14px] font-semibold">{jobReference?.project_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <MapMarker className="size-5" />
                        <div className="flex flex-col gap-1 truncate">
                          <>
                            <p className="label-regular">{jobReference?.title}</p>

                            <p className="body-small">{jobReference?.full_address}</p>
                            {/* ) : (
                                <p className="body-small">Self pickup - No Delivery Address</p>
                              )} */}
                          </>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <ProfileNav className="size-5" />
                        <div className="truncate">
                          <>
                            <p className="body-small">{jobReference?.recipient}</p>
                          </>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="default"
                      onClick={() => setJobReferenceDrawerOpen(true)}
                      variant="ghost"
                      className="pr-0 justify-self-end"
                    >
                      Edit or Change
                      <ChevronRight className="size-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 pt-2">
                      <p className="subtitle-regular pb-2">
                        Choose an existing job reference or create a new one to organize this order
                      </p>

                      <button
                        onClick={() => setJobReferenceDrawerOpen(true)}
                        className=" flex gap-2 item-center justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Magnifier className="size-5" />
                        View And Search Job Reference
                      </button>
                      <DividerWithText text="OR" />
                      <Link
                        href="#"
                        className=" flex gap-2 item-start justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Plus className="size-5" />
                        Create New Job Reference
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ContentWrapper>

          <Drawer.Root>
            <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
              Open Drawer
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-full mt-24 lg:h-fit max-h-[96%] fixed bottom-0 left-0 right-0">
                <div className="p-4 bg-white rounded-t-[10px] flex-1">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="font-medium mb-4 text-gray-900">
                      Nested Drawers.
                    </Drawer.Title>
                    <p className="text-gray-600 mb-2">
                      Nesting drawers creates a{' '}
                      <a href="https://sonner.emilkowal.ski/" target="_blank" className="underline">
                        Sonner-like
                      </a>{' '}
                      stacking effect .
                    </p>
                    <p className="text-gray-600 mb-2">
                      You can nest as many drawers as you want. All you need to do is add a
                      `Drawer.NestedRoot` component instead of `Drawer.Root`.
                    </p>
                    <Drawer.NestedRoot>
                      <Drawer.Trigger className="rounded-md mt-4 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                        Open Second Drawer
                      </Drawer.Trigger>
                      <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                        <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] lg:h-[327px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0">
                          <div className="p-4 bg-white rounded-t-[10px] flex-1">
                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                            <div className="max-w-md mx-auto">
                              <Drawer.Title className="font-medium mb-4 text-gray-900">
                                This drawer is nested.
                              </Drawer.Title>
                              <p className="text-gray-600 mb-2">
                                If you pull this drawer down a bit, it&apos;ll scale the drawer
                                underneath it as well.
                              </p>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
                            <div className="flex gap-6 justify-end max-w-md mx-auto">
                              <a
                                className="text-xs text-gray-600 flex items-center gap-0.25"
                                href="https://github.com/emilkowalski/vaul"
                                target="_blank"
                              >
                                GitHub
                                <svg
                                  fill="none"
                                  height="16"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  width="16"
                                  aria-hidden="true"
                                  className="w-3 h-3 ml-1"
                                >
                                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                  <path d="M15 3h6v6"></path>
                                  <path d="M10 14L21 3"></path>
                                </svg>
                              </a>
                              <a
                                className="text-xs text-gray-600 flex items-center gap-0.25"
                                href="https://twitter.com/emilkowalski_"
                                target="_blank"
                              >
                                Twitter
                                <svg
                                  fill="none"
                                  height="16"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  width="16"
                                  aria-hidden="true"
                                  className="w-3 h-3 ml-1"
                                >
                                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                  <path d="M15 3h6v6"></path>
                                  <path d="M10 14L21 3"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </Drawer.Content>
                      </Drawer.Portal>
                    </Drawer.NestedRoot>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <Drawer.Root
            open={jobReferenceDrawerOpen}
            onOpenChange={setJobReferenceDrawerOpen}
            // snapPoints={snapPoints}
            // activeSnapPoint={jobReferenceDrawerSnap}
            // setActiveSnapPoint={setJobReferenceDrawerSnap}
            // snapToSequentialPoint
          >
            <Drawer.Overlay className="fixed z-90 inset-0 backdrop-blur-lg" />
            <Drawer.Portal>
              <Drawer.Content
                data-testid="content"
                className="fixed z-99 flex flex-col border-2 border-gray-200 border-b-none rounded-t-md bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] bg-white shadow-lg"
              >
                <div
                  className={cn('no-scrollbar overflow-y-scroll flex flex-col mx-auto w-full', {
                    // 'overflow-y-auto': jobReferenceDrawerSnap === 1,
                    // 'overflow-hidden': jobReferenceDrawerSnap !== 1,
                  })}
                >
                  <Drawer.Title className="hidden" />

                  {fetched_job_references?.results?.length !== 0 ? (
                    <>
                      <div className="h-full no-scrollbar overflow-y-scroll">
                        <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-2" />
                        <div className="flex flex-col">
                          <div className="w-full sticky top-0 z-10 bg-white border-b">
                            <div className="w-full py-3 flex items-center relative px-4 max-w-[500px] mx-auto">
                              <Magnifier className="size-5 absolute left-8" />
                              <Input
                                type="text"
                                ref={searchInputRef}
                                value={searchValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = e.target.value
                                  setSearchValue(value)
                                  const results = searchJobReferences(
                                    fetched_job_references?.results,
                                    value,
                                  )
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
                                    setSearchResults(fetched_job_references?.results)
                                    searchInputRef.current?.focus()
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          <div
                            className={cn(
                              'flex flex-col w-full pt-4 px-4 pb-22 gap-4 max-w-[900px] mx-auto',
                              {
                                // 'overflow-y-auto': jobReferenceDrawerSnap === 1,
                                // 'overflow-hidden': jobReferenceDrawerSnap !== 1,
                              },
                            )}
                          >
                            {searchResults?.map((job) => (
                              <Drawer.NestedRoot
                                key={job?.id}
                                // snapPoints={snapPoints}
                                activeSnapPoint={jobReferenceDrawerSnap}
                                setActiveSnapPoint={setJobReferenceDrawerSnap}
                              >
                                <Drawer.Trigger asChild>
                                  <button
                                    data-slot="card"
                                    className={cn(
                                      'grid gap-4 rounded-md border-1 border-border-default py-3 px-4 relative text-start',
                                      jobReference?.job_reference_id === Number(job.id) &&
                                        'bg-gray-100',
                                    )}
                                    // disabled
                                  >
                                    {jobReference?.job_reference_id === Number(job.id) && (
                                      <div className="absolute z-110 right-4 top-4">
                                        <FeaturedCheckSmall className="size-5" />
                                      </div>
                                    )}
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
                                              <p className="label-regular">
                                                {job?.addresses?.[0]?.title}
                                              </p>
                                              <p className="body-small">
                                                {job?.addresses?.[0]?.street_address},{' '}
                                                {job?.addresses?.[0]?.suburb},{' '}
                                                {job?.addresses?.[0]?.state}{' '}
                                                {job?.addresses?.[0]?.postcode}
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
                                              Add an address to continue or delete this Job
                                              Reference.
                                            </p>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </button>
                                </Drawer.Trigger>

                                <Drawer.Portal>
                                  <Drawer.Overlay className="fixed z-100 inset-0 backdrop-blur-sm bg-black/20" />
                                  <Drawer.Content className="bg-white border-t z-101 flex flex-col rounded-t-[10px] lg:h-[327px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0">
                                    <Drawer.Title className="hidden" />
                                    <ContentWrapper className="flex flex-col gap-4 pt-0">
                                      <div className="mx-auto w-20 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4" />
                                      {(searchResults?.find((job_ref) => job_ref.id === job?.id)
                                        ?.addresses?.length ?? 0) > 0 ? (
                                        <>
                                          {searchResults
                                            ?.find((job_ref) => job_ref.id === job?.id)
                                            ?.addresses?.map((address, index) => (
                                              <Drawer.Close
                                                key={address.id}
                                                onClick={() => {
                                                  setJobReference({
                                                    job_reference_id: Number(job.id),
                                                    address_id: Number(address.id),
                                                    code: String(job.code),
                                                    project_name: job.project_name,
                                                    title: address.title,
                                                    full_address: address.full_address,
                                                    recipient: `${address.recipient_name} - ${address.recipient_phone}`,
                                                  })
                                                  setJobReferenceDrawerOpen(false)
                                                }}
                                                className={cn(
                                                  'rounded-md border-1 border-border-default py-3 px-4 relative',
                                                  jobReference?.address_id === Number(address.id)
                                                    ? 'bg-gray-100'
                                                    : '',
                                                )}
                                              >
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex flex-col gap-2 text-start">
                                                    <div className="flex gap-2">
                                                      <MapMarker className="size-5" />
                                                      <div className="flex flex-col gap-1">
                                                        <p className="label-regular truncate">
                                                          {address.title}
                                                        </p>
                                                        <p className="body-small truncate">
                                                          {address.full_address}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                      <ProfileNav className="size-5 mt-[2px]" />
                                                      <div className="flex flex-col gap-1">
                                                        <p className="body-small truncate">
                                                          {address.recipient_name} {' +67'}
                                                          {address.recipient_phone}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex justify-end items-center [&_svg]:size-5 gap-6">
                                                    <Edit />
                                                  </div>
                                                </div>

                                                {jobReference?.address_id ===
                                                  Number(address.id) && (
                                                  <div className="absolute z-110 right-4 top-4">
                                                    <FeaturedCheckSmall className="size-5" />
                                                  </div>
                                                )}
                                              </Drawer.Close>
                                            ))}
                                        </>
                                      ) : (
                                        <div className="h-[50vh]">
                                          <div className="h-full grid items-center justify-center opacity-40">
                                            <h6>No addresses for JR-{jobReference?.code}</h6>
                                          </div>
                                        </div>
                                      )}
                                    </ContentWrapper>

                                    <Footer>
                                      <Button className="w-full">
                                        <Plus />
                                        Add New Address
                                      </Button>
                                    </Footer>
                                  </Drawer.Content>
                                </Drawer.Portal>
                              </Drawer.NestedRoot>
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
                        <Button className="w-full">
                          <Plus />
                          Create New Job References
                        </Button>
                      </Footer>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-10 max-w-[600px] mx-auto pt-30">
                      <p className="text-center subtitle-large text-subtitle">
                        No job references have been created yet{' '}
                      </p>

                      <Button className="w-full ">
                        <Plus />
                        Create New Job References
                      </Button>
                    </div>
                  )}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </TabsContent>
      </Tabs>
    </>
  )
}
