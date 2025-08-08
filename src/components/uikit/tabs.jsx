import { cn } from '@/utilities/ui'
import * as TabsPrimitive from "@radix-ui/react-tabs"

export function Tabs({ ...props }) {
  return <TabsPrimitive.Root {...props} data-slot="tabs" className="flex flex-col gap-2 w-full" />
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      className={cn('h-[38px] flex items-center justify-center rounded-md border-2 border-border-dark p-[2px]', className)}
    />
  )
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      {...props}
      data-slot="tabs-trigger"
      className={cn("data-[state=active]:bg-primary data-[state=active]:text-on-action text-foreground rounded-md transition-[color,box-shadow] grow py-2 label-small", className)}
    />
  )
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content {...props} data-slot="tabs-content" className={cn("flex-1 outline-none", className)} />
  )
}
