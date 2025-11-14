'use client'
import { ArrowLeft, Delete, Edit, Info, Magnifier, More, XIcon } from '@/components/uikit/icons'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/uikit/tabs'
import { LibraryTemplateItem } from '@/components/dashboard/library/libraryTemplateItem'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Input } from '@/components/uikit/input'
import BottomNav from '@/components/dashboard/bottomNav'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { useGETTemplatesByOwner, useGETAppTemplates } from '@/lib/db/helpers/templateHelpers'
import FlashingSVG from '@/components/utils/flashingSVG'

export default function LibraryPage() {
  // TODO: Get current user ID from auth context
  const currentUserId = 'user' // This should come from auth context

  // Load templates from IndexedDB (offline-first)
  const myTemplates = useGETTemplatesByOwner(currentUserId) || []
  const appTemplates = useGETAppTemplates(currentUserId) || []

  return (
    <>
      <Header title="Library" returnHref="/dashboard">
        <Link href="/dashboard/library/search">
          <Magnifier />
        </Link>
      </Header>
      <div className="min-h-screen md:max-w-[1000px] md:mx-auto md:px-4">
        <ContentWrapper className="no-scrollbar pt-14">
          <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pt-4">
            <Tabs defaultValue="my-templates">
              <TabsList className="sticky top-4 bg-white z-20 w-full md:w-auto">
                <TabsTrigger value="my-templates">My Templates</TabsTrigger>
                <TabsTrigger value="app-templates">App Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="my-templates">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {myTemplates.length > 0 ? (
                    myTemplates.map((template, index) => (
                      <LibraryTemplateItem
                        key={template.name + index}
                        title={template.name}
                        isMyTemplate={true}
                      >
                        <FlashingSVG flashing={template.flashing} className="h-20" />
                      </LibraryTemplateItem>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-subtitle">No templates found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Create your first template to get started
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="app-templates">
                <div className="grid grid-cols-2 pt-2 gap-4">
                  {appTemplates.length > 0 ? (
                    appTemplates.map((template, index) => (
                      <LibraryTemplateItem key={template.name + index} title={template.name}>
                        <FlashingSVG flashing={template.flashing} className="h-20" />
                      </LibraryTemplateItem>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-subtitle">No app templates available</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Check back later for new templates
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ContentWrapper>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
      \
      <div className="md:max-w-[1000px] md:mx-auto">
        <div className="hidden md:block">
          <BottomNav />
        </div>
      </div>
    </>
  )
}
