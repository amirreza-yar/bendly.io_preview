'use client'
import { Button } from '@/components/uikit/buttons/button'
import { Drawing, DrawingBold } from '@/components/ui/icon'
import { Check, CircleQuestion, GoogleIcon, XIcon } from '@/components/uikit/icons'
import { ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { IconButtonGroup } from '@/components/uikit/buttons/iconButtonGroup'
import { LabeledInput } from '@/components/uikit/input'
import { toast } from 'sonner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import JobRefCard from '@/components/uikit/cards/jobRefCard'

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/uikit/adjustDrawer"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { AlertModal } from '@/components/uikit/alertModal'

export default function Home() {
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full bg-red-400"
      >
        <CarouselContent className="mx-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1">
              <div className="">
                <JobRefCard jobRefrenceCode={index + 1} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  )
}
