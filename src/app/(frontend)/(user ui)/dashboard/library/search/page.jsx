'use client'
import { ArrowLeft, Delete, Edit, Info, Magnifier, More, XIcon } from '@/components/uikit/icons'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/uikit/tabs'
import { LibraryTemplateItem } from '@/components/dashboard/library/libraryTemplateItem'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/uikit/input'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import BottomNav from '@/components/dashboard/bottomNav'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'

export default function LibrarySearchPage() {
  // Simulate fetching data (replace with DB/API)
  const templates = [
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-03', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Template 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'App Template 1', imageSrc: 'rectangle-10.png', isMyTemplate: false },
    { title: 'App Template 2', imageSrc: 'rectangle-10.png', isMyTemplate: false },
  ]

  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef(null)

  const [searchResults, setSearchResults] = useState(templates)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href="/dashboard/library">
              <ArrowLeft />
            </Link>
          </div>

          <div className="w-full flex items-center relative ">
            <Magnifier className="size-5 absolute left-4" />
            <Input
              ref={searchInputRef}
              value={searchValue}
              onChange={(se) => {
                setSearchValue(se.target.value)
                setSearchResults(
                  templates.filter((template) =>
                    template.title.toLowerCase().includes(se.target.value.toLowerCase()),
                  ),
                )
              }}
              placeholder="Search template..."
              className="pl-11"
            />
            {searchValue !== '' && (
              <XIcon
                className="size-5 absolute right-4"
                onClick={() => {
                  setSearchValue('')
                  setSearchResults(templates)
                  searchInputRef.current?.focus()
                }}
              />
            )}
          </div>
        </div>
      </header>
      <ContentWrapper>
        {searchResults.length !== 0 ? (
          <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pt-4">
            <Tabs defaultValue="all-filtered">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-4 bg-white z-20">
                <span className="label-regular shrink-0">Filter:</span>
                <TabsPrimitive.List
                  data-slot="tabs-list"
                  className="flex h-8 gap-2 overflow-x-auto min-w-0 no-scrollbar"
                >
                  <TabsTrigger
                    // onClick={() => searchInputRef.current?.focus()}
                    value="all-filtered"
                    className="shrink-0 px-3 border-1 border-border-default data-[state=active]:bg-surface-comp-active data-[state=active]:border-border-darkest data-[state=active]:text-black"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-filtered-templates"
                    className="shrink-0 px-3 border-1 border-border-default data-[state=active]:bg-surface-comp-active data-[state=active]:border-border-darkest data-[state=active]:text-black"
                  >
                    My Templates
                  </TabsTrigger>
                  <TabsTrigger
                    value="app-filtered-templates"
                    className="shrink-0 px-3 border-1 border-border-default data-[state=active]:bg-surface-comp-active data-[state=active]:border-border-darkest data-[state=active]:text-black"
                  >
                    App Templates
                  </TabsTrigger>
                </TabsPrimitive.List>
              </div>

              <TabsContent value="all-filtered">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {searchResults.map((template, index) => (
                    <LibraryTemplateItem
                      key={index}
                      title={template.title}
                      image={template.imageSrc}
                      isMyTemplate={template.isMyTemplate}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="my-filtered-templates">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {searchResults
                    .filter((t) => t.isMyTemplate)
                    .map((template, index) => (
                      <LibraryTemplateItem
                        key={index}
                        title={template.title}
                        image={template.imageSrc}
                        isMyTemplate
                      />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="app-filtered-templates">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {searchResults
                    .filter((t) => !t.isMyTemplate)
                    .map((template, index) => (
                      <LibraryTemplateItem
                        key={index}
                        title={template.title}
                        image={template.imageSrc}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <h5>No results found</h5>
            <p className="text-center subtitle-large text-subtitle">
              Please check your spelling or try different keywords
            </p>
          </div>
        )}
      </ContentWrapper>
      <BottomNav />
    </>
  )
}
