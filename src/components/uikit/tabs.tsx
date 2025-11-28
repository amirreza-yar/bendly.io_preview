import { cn } from '@/utilities/ui'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import React, { ComponentPropsWithoutRef } from 'react'

export function Tabs({ ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} data-slot="tabs" className="flex flex-col gap-2 w-full" />
}

export function TabsList({
  className,
  ...props
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      className={cn(
        'h-[38px] flex items-center justify-center rounded-md border-2 border-gray-300 p-[2px]',
        className,
      )}
    />
  )
}

export function TabsTrigger({
  className,
  value,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  value: string
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      {...props}
      data-slot="tabs-trigger"
      className={cn(
        'data-[state=active]:bg-primary data-[state=active]:text-on-action text-foreground rounded-md transition-[color,box-shadow] grow py-2 label-small',
        className,
      )}
    />
  )
}

export function TabsContent({
  className,
  value,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  value: string
}) {
  return (
    <TabsPrimitive.Content
      value={value}
      {...props}
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
    />
  )
}
