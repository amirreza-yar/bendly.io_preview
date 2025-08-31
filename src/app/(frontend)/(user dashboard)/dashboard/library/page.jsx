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

export default function LibraryPage() {
  // Simulate fetching data (replace with DB/API)
  const templates = [
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-03', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-03', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-03', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-03', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'Flashing 2025-02', imageSrc: 'rectangle-10.png', isMyTemplate: true },
    { title: 'App Template 1', imageSrc: 'rectangle-10.png', isMyTemplate: false },
    { title: 'App Template 2', imageSrc: 'rectangle-10.png', isMyTemplate: false },
  ]

  return (
    <>
      <Header title="Library" returnHref="/dashboard">
        <Link href="/dashboard/library/search">
          <Magnifier />
        </Link>
      </Header>
      <ContentWrapper className="no-scrollbar pt-14">
        <div className="flex flex-col items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pt-4">
          <Tabs defaultValue="my-templates">
            <TabsList className="sticky top-4 bg-white z-20">
              <TabsTrigger value="my-templates">My Templates</TabsTrigger>
              <TabsTrigger value="app-templates">App Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="my-templates">
              <div className="grid grid-cols-2 pt-2 gap-4">
                {templates
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
            <TabsContent value="app-templates">
              <div className="grid grid-cols-2 pt-2 gap-4">
                {templates
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
      </ContentWrapper>

      <BottomNav />
    </>
  )
}
