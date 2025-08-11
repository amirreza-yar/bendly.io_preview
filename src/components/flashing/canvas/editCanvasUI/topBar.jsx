// TopBar.jsx
'use client'
import React from 'react'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { ArrowLeft, FeaturedAlert, XIcon } from '@/components/uikit/icons'
import { ArrowRight } from '@/components/uikit/icons'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AlertDialogContent, AlertModal } from '@/components/uikit/alertModal'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/uikit/buttons/button'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

export const slideFromTop = {
  hidden: { y: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.25 } },
  visible: { y: '0%', opacity: 1, transition: { type: 'tween', duration: 0.25 } },
  exit: { y: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.2 } },
}

const TopBar = ({ onClose, onNext, hasEditModalChanges, canvasIsEmpty, deleteFlashing }) => {
  return (
    <motion.div
      variants={slideFromTop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 left-0 border-b-[1px] border-neutral-midlight z-50"
    >
      <div className="flex justify-between items-center bg-white h-[56px] px-4">
        {hasEditModalChanges && !canvasIsEmpty ? (
          <AlertDialogPrimitive.Root data-slot="alert-dialog">
            <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
              <div className="flex gap-4 items-center text-smd font-semibold">
                <IconButton variant="ghost" black className="hover:bg-white">
                  <ArrowLeft />
                </IconButton>
                Edit Canvas
              </div>
            </AlertDialogPrimitive.Trigger>
            <AlertDialogContent className="font-roboto">
              <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
                <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
                  <XIcon className="text-neutral-dark" variant="secondary" />
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Title
                  data-slot="alert-dialog-title"
                  className="text-sm/[19px] font-semibold"
                >
                  Unsaved Chnages
                </AlertDialogPrimitive.Title>

                <AlertDialogPrimitive.Description
                  data-slot="alert-dialog-description"
                  className="text-muted-foreground text-sm"
                >
                  You've made changes that haven't been saved. If you go back now, they'll be lost.
                </AlertDialogPrimitive.Description>
              </div>
              <div
                data-slot="alert-dialog-footer"
                className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
              >
                <AlertDialogPrimitive.Action asChild>
                  <Button onClick={onNext}>Save & Go Back</Button>
                </AlertDialogPrimitive.Action>

                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="secondary" onClick={onClose}>
                    Discard Changes
                  </Button>
                </AlertDialogPrimitive.Cancel>
              </div>
            </AlertDialogContent>
          </AlertDialogPrimitive.Root>
        ) : canvasIsEmpty ? (
          <AlertDialogPrimitive.Root data-slot="alert-dialog">
            <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
              <div className="flex gap-4 items-center text-smd font-semibold">
                <IconButton variant="ghost" black className="hover:bg-white">
                  <ArrowLeft />
                </IconButton>
                Edit Canvas
              </div>
            </AlertDialogPrimitive.Trigger>
            <AlertDialogContent className="font-roboto">
              <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
                <AlertDialogPrimitive.Title
                  data-slot="alert-dialog-title"
                  className="text-sm/[19px] font-semibold"
                >
                  <div className="grid gap-4">
                    <FeaturedAlert />
                    Unsaved Chnages
                  </div>
                </AlertDialogPrimitive.Title>

                <AlertDialogPrimitive.Description
                  data-slot="alert-dialog-description"
                  className="text-muted-foreground text-sm"
                >
                  You've made changes that haven't been saved. If you go back now, they'll be lost.
                </AlertDialogPrimitive.Description>
              </div>
              <div
                data-slot="alert-dialog-footer"
                className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
              >
                <AlertDialogPrimitive.Action asChild>
                  <Button onClick={deleteFlashing}>Delete Flashing</Button>
                </AlertDialogPrimitive.Action>

                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="secondary">Cancel</Button>
                </AlertDialogPrimitive.Cancel>
              </div>
            </AlertDialogContent>
          </AlertDialogPrimitive.Root>
        ) : (
          <div className="flex gap-4 items-center text-smd font-semibold">
            <IconButton variant="ghost" black className="hover:bg-white" onClick={onClose}>
              <ArrowLeft />
            </IconButton>
            Edit Canvas
          </div>
        )}

        {canvasIsEmpty ? (
          <AlertDialogPrimitive.Root data-slot="alert-dialog">
            <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
              <Button disabled={!hasEditModalChanges} className="px-5">
                Save
              </Button>
            </AlertDialogPrimitive.Trigger>
            <AlertDialogContent className="font-roboto">
              <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
                <AlertDialogPrimitive.Title
                  data-slot="alert-dialog-title"
                  className="text-sm/[19px] font-semibold"
                >
                  <div className="grid gap-4">
                    <FeaturedAlert />
                    Unsaved Chnages
                  </div>
                </AlertDialogPrimitive.Title>

                <AlertDialogPrimitive.Description
                  data-slot="alert-dialog-description"
                  className="text-muted-foreground text-sm"
                >
                  You've made changes that haven't been saved. If you go back now, they'll be lost.
                </AlertDialogPrimitive.Description>
              </div>
              <div
                data-slot="alert-dialog-footer"
                className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
              >
                <AlertDialogPrimitive.Action asChild>
                  <Button onClick={deleteFlashing}>Delete Flashing</Button>
                </AlertDialogPrimitive.Action>

                <AlertDialogPrimitive.Cancel asChild>
                  <Button variant="secondary">Cancel</Button>
                </AlertDialogPrimitive.Cancel>
              </div>
            </AlertDialogContent>
          </AlertDialogPrimitive.Root>
        ) : (
          <Button disabled={!hasEditModalChanges} onClick={onNext} className="px-5">
            Save
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default TopBar
