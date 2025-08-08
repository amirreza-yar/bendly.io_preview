'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive, type DialogProps } from 'vaul'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { cn } from '@/utilities/ui'

type DrawerProps = DialogProps & {
  trigger?: React.ReactNode
  children?: React.ReactNode
}

function Drawer({ children, trigger, ...props }: DrawerProps) {
  return (
    <DrawerPrimitive.Root {...props} data-slot="drawer">
      {trigger && (
        <DrawerPrimitive.Trigger data-slot="drawer-trigger" asChild>
          {trigger}
        </DrawerPrimitive.Trigger>
      )}
      <DrawerPrimitive.Portal data-slot="drawer-portal">
        <DrawerPrimitive.Overlay
          data-slot="drawer-overlay"
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-md',
          )}
        />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:border-t border-border-dark backdrop-blur-md',
          )}
        >
          <div data-slot="drawer-header">
            <VisuallyHidden>
              <DrawerPrimitive.Title />
            </VisuallyHidden>
          </div>

          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}

function DrawerClose(props: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

export { Drawer, DrawerClose }
