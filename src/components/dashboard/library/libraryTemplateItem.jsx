'use client'
import { Delete, Edit, Info, More } from '@/components/uikit/icons'
import { useState } from 'react'
import { cn } from '@/utilities/ui'
import { Separator } from '@/components/uikit/separator'
import { Drawer, DrawerClose } from '@/components/uikit/drawer'
import { XIcon } from 'lucide-react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { Button } from '@/components/uikit/buttons/button'
import { Input } from '@/components/uikit/input'
import { toast } from 'sonner'

function AlertDialogContent({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-md',
          className,
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          ' bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[90%] -[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg p-6 shadow-lg duration-200 sm:-lg shadown-md',
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  )
}

export function LibraryTemplateItem({ title, image, isMyTemplate = false, ...props }) {
  const [inputValueRepititive, setInputValueRepititive] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  return (
    <div {...props} className="rounded-md border-1 border-border-default px-2 h-39">
      <div className="h-full flex-col">
        <div className=" h-29 justify-center flex items-center relative">
          IMG
          {isMyTemplate && (
            <Drawer trigger={<More className="absolute -right-1 top-2" />}>
              <div className="flex flex-col p-6">
                <div className="flex justify-between pb-2">
                  <p className="text-smd/[19px] font-semibold">Manage Template</p>
                  <DrawerClose asChild>
                    <XIcon className="size-6" />
                  </DrawerClose>
                </div>
                <AlertDialogPrimitive.Root data-slot="alert-dialog">
                  <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
                    <div className={cn('flex items-center h-12 gap-4')}>
                      <Edit />
                      <span className="label-regular">Rename</span>
                    </div>
                  </AlertDialogPrimitive.Trigger>
                  <AlertDialogContent>
                    <div data-slot="alert-dialog-header" className="pb-4">
                      <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
                        <XIcon className="text-neutral-dark" />
                      </AlertDialogPrimitive.Cancel>
                      <AlertDialogPrimitive.Title data-slot="alert-dialog-title">
                        <span className="text-smd/[19px] font-semibold">Rename Template</span>
                      </AlertDialogPrimitive.Title>
                    </div>
                    <Input
                      value={inputValue}
                      className="pl-3"
                      onChange={(val) => {
                        setInputValue(val.target.value)
                      }}
                    />
                    <div className="flex justify-between pb-4 pt-1">
                      <div
                        className={`flex items-center gap-1 [&_svg:not([class*='size-'])]:size-[12px] text-2xs/[19px] font-regular text-attention-default`}
                      >
                        {inputValue.length === 0 && (
                          <>
                            <Info />
                            <p>Template name is required</p>
                          </>
                        )}
                        {inputValueRepititive && (
                          <>
                            <Info />
                            <p>This name is already in use</p>
                          </>
                        )}
                      </div>
                      <p className="justify-self-end">{inputValue.length}/30</p>
                    </div>
                    <div data-slot="alert-dialog-footer" className="grid gap-4">
                      <DrawerClose asChild>
                        <AlertDialogPrimitive.Action asChild>
                          <Button onClick={() => toast('Template name updated')}>Save</Button>
                        </AlertDialogPrimitive.Action>
                      </DrawerClose>
                      <AlertDialogPrimitive.Cancel asChild>
                        <Button variant="secondary">Cancel</Button>
                      </AlertDialogPrimitive.Cancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPrimitive.Root>

                <Separator className="" />
                <AlertDialogPrimitive.Root data-slot="alert-dialog">
                  <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
                    <div className={cn('flex items-center h-12 gap-4')}>
                      <Delete />
                      <span className="label-regular">Delete Template</span>
                    </div>
                  </AlertDialogPrimitive.Trigger>
                  <AlertDialogContent>
                    <div data-slot="alert-dialog-header" className="pb-4">
                      <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
                        <XIcon className="text-neutral-dark" />
                      </AlertDialogPrimitive.Cancel>
                      <AlertDialogPrimitive.Title data-slot="alert-dialog-title">
                        <span className="text-smd/[19px] font-semibold">
                          Do you want to delete?
                        </span>
                      </AlertDialogPrimitive.Title>
                      <AlertDialogPrimitive.Description
                        data-slot="alert-dialog-description"
                        className="body-small py-4"
                      >
                        Are you sure you want to delete this template? This action cannot be undone
                      </AlertDialogPrimitive.Description>
                    </div>
                    <div data-slot="alert-dialog-footer" className="grid gap-4">
                      <DrawerClose asChild>
                        <AlertDialogPrimitive.Action asChild>
                          <Button
                            className="bg-surface-attention"
                            onClick={() => toast('Template Deleted')}
                          >
                            Delete
                          </Button>
                        </AlertDialogPrimitive.Action>
                      </DrawerClose>

                      <AlertDialogPrimitive.Cancel asChild>
                        <Button variant="secondary">Cancel</Button>
                      </AlertDialogPrimitive.Cancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPrimitive.Root>
              </div>
            </Drawer>
          )}
        </div>
        <Separator className />
        <div className=" p-2 text-center label-regular truncate">{title}</div>
      </div>
    </div>
  )
}
