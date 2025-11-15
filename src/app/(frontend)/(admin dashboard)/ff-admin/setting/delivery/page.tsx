'use client'

import { Calendar, CalendarDayButton } from '@/components/uikit/calendar'
import { useEffect, useState } from 'react'
import { DayPicker, getDefaultClassNames, type DateRange } from 'react-day-picker'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Delete,
  Download,
  Edit,
  GearSetting,
  Plus,
  PlusIcon,
  Search,
} from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import {
  ArrowUpDown,
  ArrowUpWideNarrow,
  Calendar1,
  CalendarCog,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MoreHorizontal,
  PowerIcon,
  PowerOff,
  Truck,
} from 'lucide-react'
import { Badge } from '@/components/uikit/badge'
import { Button } from '@/components/uikit/buttons/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/uikit/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { Input, LabeledInput } from '@/components/uikit/input'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import {
  FreightTrainSVG,
  HeavyRigidTruckSVG,
  MediumRigidTruckSVG,
  SmallPanelVanSVG,
  UteSVG,
} from '@/components/admin/svgs'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/uikit/dropdown-menu'
import { Select } from '@/components/uikit/select'

export function SortableItem({ id, vehicle }: { id: any; vehicle: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px 16px',
    background: '#f3f4f6',
    borderRadius: '8px',
    cursor: 'grab',
    marginBottom: '8px',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-gray-100 px-8 p-4 rounded-md border border-gray-300 w-full"
    >
      <div className="flex items-center gap-8">
        <p className="text-gray-400 font-xbold">{vehicle.position}</p>
        <div>
          <h6 className="text-[16px]">{vehicle.name}</h6>
          <p className="text-[13px] text-subtitle">{vehicle.description}</p>
          <p className="text-[13px] pt-1">
            Capacity:{' '}
            <span className="font-semibold">
              {vehicle.minCapacity} - {vehicle.maxCapacity} Kg
            </span>{' '}
            | Distance up to: <span className="font-semibold">{vehicle.maxDistance} Km</span> |
            Length up to: <span className="font-semibold">{vehicle.maxDistance.toFixed(2)} m</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <vehicle.svg height={40} className="transform scale-x-[-1]" />
        <ArrowUpDown className="size-4 text-gray-500" />
      </div>
    </div>
  )
}

export default function FactoryWorkingDays() {
  const [vehicles, setVehicles] = useState([
    {
      id: 'heavy-rigid-truck',
      name: 'Heavy Rigid Truck',
      minCapacity: 4000,
      maxCapacity: 15000,
      maxDistance: 800,
      maxLength: 16.0,
      description:
        'A large open trailer used for carrying long, heavy materials. Used for long delivery distances.',
      position: 1,
      svg: HeavyRigidTruckSVG,
    },
    {
      id: 'small-panel-van',
      name: 'Small Panel Van',
      minCapacity: 500,
      maxCapacity: 3000,
      maxDistance: 300,
      maxLength: 4.5,
      description:
        'A mid-sized tray truck suited for heavier loads and medium-distance deliveries.',
      position: 2,
      svg: SmallPanelVanSVG,
    },
    {
      id: 'medium-rigid-truck',
      name: 'Medium Rigid Truck',
      minCapacity: 2000,
      maxCapacity: 7000,
      maxDistance: 500,
      maxLength: 7.0,
      description:
        'A compact enclosed vehicle used for light or short-length deliveries within local areas.',
      position: 3,
      svg: MediumRigidTruckSVG,
    },
    {
      id: 'ute',
      name: 'Ute',
      minCapacity: 200,
      maxCapacity: 1000,
      maxDistance: 150,
      maxLength: 3.5,
      description: 'A small-sized vehicle suited for lighter loads and short-distance deliveries.',
      position: 4,
      svg: UteSVG,
    },
    {
      id: 'rail-freight',
      name: 'Rail Freight',
      minCapacity: 10000,
      maxCapacity: 100000,
      maxDistance: 2000,
      maxLength: 25.0,
      description: 'A vehicle suited for the heaviest loads and longest deliveries.',
      position: 5,
      svg: FreightTrainSVG,
    },
  ])

  const [activeTab, setActiveTab] = useState('all-deliveries')
  const [isDeliveryMethodsCollapOpen, setIsDeliveryMethodsCollapOpen] = useState(true)

  const [items, setItems] = useState([1, 2, 3])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    console.log(items)
  }, [items, setItems])

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setVehicles((items) => {
        const oldIndex = items.findIndex((v) => v.id === active.id)
        const newIndex = items.findIndex((v) => v.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update positions based on new order
        return newItems.map((v, index) => ({ ...v, position: index + 1 }))
      })
    }
  }

  return (
    <>
      <div className="bg-[#F1F5F9] h-full relative p-6">
        <Breadcrumb className="pb-6">
          <BreadcrumbList className="">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/ff-admin/setting">
                  <GearSetting className="size-5 text-primary" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Delivery Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="p-8 bg-white flex flex-col border border-border-default rounded-lg min-h-[calc(100%-50px)]">
          <div className="space-y-2 pt-2 pb-8">
            <h5>Factory Delivery Methods</h5>
            <p className="label-regular text-subtitle">The settings relevant to this dashboard.</p>
          </div>
          <div className="md:flex space-y-3 md:space-y-0 items-center justify-between gap-3 pb-6">
            <LabeledInput
              placeholder="Filter by customer or order id"
              icon={Search}
              onChange={(e) => {}}
              className="md:max-w-sm md:min-w-sm"
            />
            <div className="md:flex gap-3 space-y-3 md:space-y-0">
              <DialogPrimitive.Root data-slot="alert-dialog">
                <DialogPrimitive.Trigger asChild>
                  <Button variant="secondary" className="w-full md:w-fit" onClick={() => {}}>
                    <Plus />
                    Modify Delivery Methods
                  </Button>
                </DialogPrimitive.Trigger>
                <AlertDialogContent className="font-roboto w-[90vw] h-[80vh] p-0">
                  <div data-slot="alert-dialog-header" className="hidden">
                    <DialogPrimitive.Title
                      data-slot="alert-dialog-title"
                      className="text-sm/[19px] font-semibold hidden"
                    />
                  </div>

                  <TabsPrimitive.Root
                    data-slot="tabs"
                    // defaultValue="all-deliveries"
                    className="flex w-full"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsPrimitive.List
                      className="w-70 bg-gray-200 rounded-tl-lg rounded-bl-lg shadow-md border-r border-gray-300 p-4 pt-6 flex flex-col gap-2"
                      data-slot="tabs-list"
                    >
                      <h6>Delivery methods panel</h6>
                      <p className="text-[13px] text-gray-600">
                        Modify delivery methods or add new one.
                      </p>

                      <div className="flex flex-col grow overflow-y-scroll pt-4">
                        <div className="flex flex-col gap-3">
                          <CollapsiblePrimitive.Root
                            data-slot="collapsible"
                            open={isDeliveryMethodsCollapOpen}
                            onOpenChange={setIsDeliveryMethodsCollapOpen}
                          >
                            <div
                              className="flex flex-col w-full rounded-md font-semibold relative transition
                                            [&:has(>#all-deliveries[data-state=active])]:bg-primary 
                                            [&:has(>#all-deliveries[data-state=active])]:text-white 
                                            [&:has(>#all-deliveries[data-state=active])>#collapsible-trigger]:hover:bg-primary-dark
                                            [&:has(>#all-deliveries[data-state=active])_#delivery-methods]:border-gray-100
                                            [&:has(>#all-deliveries[data-state=active])_#delivery-methods>*]:hover:bg-primary-dark
                                            [&:has(:not(#all-deliveries)[data-state=active])]:bg-gray-300
                                            [&:has(:not(#all-deliveries)[data-state=active])_#delivery-methods>*]:hover:bg-gray-400
                                            [&:has(:not(#all-deliveries)[data-state=active])>#collapsible-trigger]:hover:bg-gray-400
                                            [&:has(:not(#all-deliveries)[data-state=active])>#all-deliveries]:hover:bg-gray-400"
                            >
                              <TabsPrimitive.Trigger
                                data-slot="tabs-trigger"
                                id="all-deliveries"
                                value="all-deliveries"
                                className="flex items-center gap-2 peer text-start h-full grow p-3 cursor-pointer hover:bg-gray-300 data-[state=active]:hover:bg-primary-dark data-[state=active]:text-white rounded-md transition text-[15px]/[20px] font-semibold"
                              >
                                <Truck className="size-4" />
                                Delivery methods
                              </TabsPrimitive.Trigger>
                              <CollapsiblePrimitive.CollapsibleTrigger
                                data-slot="collapsible-trigger"
                                id="collapsible-trigger"
                                className="absolute right-2 top-[10px] rounded-xs p-1 text-center hover:bg-gray-300"
                                asChild
                              >
                                <ChevronsUpDown className="size-6" />
                              </CollapsiblePrimitive.CollapsibleTrigger>

                              <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content">
                                <div
                                  id="delivery-methods"
                                  className="flex flex-col gap-2 pl-3 pr-4 ml-5 -mt-1 border-l border-gray-400 pt-3 mb-4"
                                >
                                  <TabsPrimitive.Trigger
                                    className="flex  hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:hover:!bg-primary-dark transition w-full rounded-xs text-[13px]/[15px] font-regular p-2 cursor-pointer"
                                    data-slot="tabs-trigger"
                                    value="ute-details"
                                  >
                                    Ute
                                  </TabsPrimitive.Trigger>
                                  <TabsPrimitive.Trigger
                                    className="flex  hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:hover:!bg-primary-dark transition w-full rounded-xs text-[13px]/[15px] font-regular p-2 cursor-pointer"
                                    data-slot="tabs-trigger"
                                    value="1"
                                  >
                                    Small panel van
                                  </TabsPrimitive.Trigger>
                                  <TabsPrimitive.Trigger
                                    className="flex  hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:hover:!bg-primary-dark transition w-full rounded-xs text-[13px]/[15px] font-regular p-2 cursor-pointer"
                                    data-slot="tabs-trigger"
                                    value="2"
                                  >
                                    Medium rigid truck
                                  </TabsPrimitive.Trigger>
                                  <TabsPrimitive.Trigger
                                    className="flex  hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:hover:!bg-primary-dark transition w-full rounded-xs text-[13px]/[15px] font-regular p-2 cursor-pointer"
                                    data-slot="tabs-trigger"
                                    value="3"
                                  >
                                    Heavy rigid truck
                                  </TabsPrimitive.Trigger>
                                  <TabsPrimitive.Trigger
                                    className="flex  hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:hover:!bg-primary-dark transition w-full rounded-xs text-[13px]/[15px] font-regular p-2 cursor-pointer"
                                    data-slot="tabs-trigger"
                                    value="4"
                                  >
                                    Rail freight
                                  </TabsPrimitive.Trigger>
                                </div>
                              </CollapsiblePrimitive.CollapsibleContent>
                            </div>
                          </CollapsiblePrimitive.Root>

                          <TabsPrimitive.Trigger
                            className="flex items-center gap-2 hover:bg-gray-300 data-[state=active]:bg-primary data-[state=active]:hover:bg-primary-dark data-[state=active]:text-white transition-[color,box-shadow] w-full rounded-md text-[15px]/[20px] font-semibold p-3 cursor-pointer"
                            data-slot="tabs-trigger"
                            value="modify-deliveries-order"
                          >
                            <ArrowUpDown className="size-4" />
                            Modify delivery order
                          </TabsPrimitive.Trigger>
                        </div>
                      </div>
                      <div>
                        <Popover>
                          <PopoverTrigger className="w-full rounded-md hover:bg-gray-300 transition-all cursor-pointer text-gray-600 text-[14px] font-semibold flex items-center justify-center gap-2 p-3">
                            <PlusIcon className="size-4" />
                            New delivery method
                          </PopoverTrigger>

                          <PopoverContent side="top" className="space-y-2">
                            <h6>New delivery method</h6>
                            <p className="label-regular text-gray-400 pb-2">
                              Give the new delivery method a name
                            </p>
                            <Input
                              placeholder="Method name"
                              // value={newGroupName}
                              // onChange={(e) => setNewGroupName(e.target.value)}
                              className="border-1 bg-gray-50"
                            />
                            <div className="flex justify-end items-center gap-2 pt-4">
                              <PopoverClose asChild>
                                <Button variant="secondary">Discard</Button>
                              </PopoverClose>
                              <PopoverClose asChild>
                                <Button
                                // onClick={() => {
                                //   materialDetails.groups.push({
                                //     groupName: newGroupName,
                                //     colors: [],
                                //     baseCost: null,
                                //     costPerFold: null,
                                //     squishCost: null,
                                //     costPer100Girth: null,
                                //   })
                                //   form.reset({
                                //     material: materialDetails.material,
                                //     colors: [],
                                //   })
                                //   setActiveGroupIndex(materialDetails.groups.length - 1)
                                // }}
                                >
                                  Create
                                </Button>
                              </PopoverClose>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TabsPrimitive.List>

                    <TabsPrimitive.Content
                      data-slot="tabs-content"
                      value="all-deliveries"
                      className="flex-1 outline-none"
                    >
                      <div className="flex flex-col w-full h-full p-6">
                        <div className="grow">
                          <div className="pb-6 flex items-center justify-between pr-4">
                            <div>
                              <h6 className="text-[17px]">Delivery Methods</h6>
                              <p className="subtitle-regular text-gray-500">
                                You can observe all methods and vehicles here with their state.
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between bg-gray-100 pl-3 py-4 pr-6 rounded-md border border-gray-300">
                              <div className="flex items-center gap-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="size-8 text-gray-600 hover:bg-gray-200 p-2 rounded-xs cursor-pointer" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-30">
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem
                                        className="text-[13px]"
                                        onClick={() => {
                                          setActiveTab('ute-details')
                                          setIsDeliveryMethodsCollapOpen(true)
                                        }}
                                      >
                                        <Edit />
                                        Modify
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-[13px] text-orange-600">
                                        <PowerOff className="text-orange-500" />
                                        Deactivate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-[13px] text-red-600"
                                        onSelect={() => {}}
                                      >
                                        <Delete className="text-red-500" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <div>
                                  <h6 className="text-[15px] flex items-center gap-2">
                                    Ute
                                    <span>
                                      <Badge text="Active" />
                                    </span>
                                  </h6>
                                  <p className="text-[13px] text-subtitle">
                                    A small-sized vehicle suited for lighter loads and
                                    short-distance deliveries.
                                  </p>
                                </div>
                              </div>
                              <UteSVG height={40} className="transform scale-x-[-1]" />
                            </div>

                            <div className="flex items-center justify-between bg-gray-100 pl-3 py-4 pr-6 rounded-md border border-gray-300">
                              <div className="flex items-center gap-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="size-8 text-gray-600 hover:bg-gray-200 p-2 rounded-xs cursor-pointer" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-30">
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem className="text-[13px]" onSelect={() => {}}>
                                        <Edit />
                                        Modify
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-[13px] text-green-700"
                                        onSelect={() => {}}
                                      >
                                        <PowerIcon className="text-green-600" />
                                        Activate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-[13px] text-red-600"
                                        onSelect={() => {}}
                                      >
                                        <Delete className="text-red-500" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <div>
                                  <h6 className="text-[15px] flex items-center gap-2">
                                    Small panel van
                                    <span>
                                      <Badge text="Deactive" variant="red" />
                                    </span>
                                  </h6>
                                  <p className="text-[13px] text-subtitle">
                                    A compact enclosed vehicle used for light or short-length
                                    deliveries within local areas.
                                  </p>
                                </div>
                              </div>
                              <SmallPanelVanSVG height={40} />
                            </div>

                            <div className="flex items-center justify-between bg-gray-100 pl-3 py-4 pr-6 rounded-md border border-gray-300">
                              <div className="flex items-center gap-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="size-8 text-gray-600 hover:bg-gray-200 p-2 rounded-xs cursor-pointer" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-30">
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem className="text-[13px]" onSelect={() => {}}>
                                        <Edit />
                                        Modify
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-[13px] text-orange-600"
                                        onSelect={() => {}}
                                      >
                                        <PowerOff className="text-orange-500" />
                                        Deactivate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-[13px] text-red-600"
                                        onSelect={() => {}}
                                      >
                                        <Delete className="text-red-500" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <div>
                                  <h6 className="text-[15px] flex items-center gap-2">
                                    Medium rigid truck
                                    <span>
                                      <Badge text="Active" />
                                    </span>
                                  </h6>
                                  <p className="text-[13px] text-subtitle">
                                    A mid-sized tray truck suited for heavier loads and
                                    medium-distance deliveries.
                                  </p>
                                </div>
                              </div>
                              <MediumRigidTruckSVG height={40} />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-6 gap-4">
                          <DialogPrimitive.Cancel asChild>
                            <Button className="min-w-30" variant="secondary">
                              Discard
                            </Button>
                          </DialogPrimitive.Cancel>

                          <DialogPrimitive.Action asChild>
                            <Button className="min-w-30">Submit</Button>
                          </DialogPrimitive.Action>
                        </div>
                      </div>
                    </TabsPrimitive.Content>

                    <TabsPrimitive.Content
                      data-slot="tabs-content"
                      value="modify-deliveries-order"
                      className="flex-1 outline-none"
                    >
                      <div className="flex flex-col w-full h-full p-6">
                        <div className="grow">
                          <div className="pb-6 space-y-[2px] pr-4">
                            <h6 className="text-[17px]">Modiy delivery methods order</h6>
                            <p className="subtitle-regular text-gray-500">
                              You can change delivery method selection order here.
                            </p>
                          </div>

                          <div className="flex items-center justify-between mb-4 pb-1 border-b border-gray-200 px-2">
                            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-500">
                              <ArrowUpWideNarrow className="size-[14px] text-gray-500" />
                              Higher priority
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                              Try drag and drop
                              <ArrowUpDown className="size-[12px] text-gray-500" />
                            </div>
                          </div>

                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                          >
                            <SortableContext
                              items={vehicles.map((v) => v.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="grid gap-4">
                                {vehicles.map((vehicle) => (
                                  <SortableItem
                                    key={vehicle.id}
                                    id={vehicle.id}
                                    vehicle={vehicle}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </div>
                        <div className="flex justify-end pt-6 gap-4">
                          <DialogPrimitive.Cancel asChild>
                            <Button className="min-w-30" variant="secondary">
                              Discard
                            </Button>
                          </DialogPrimitive.Cancel>

                          <DialogPrimitive.Action asChild>
                            <Button className="min-w-30">Submit</Button>
                          </DialogPrimitive.Action>
                        </div>
                      </div>
                    </TabsPrimitive.Content>

                    <TabsPrimitive.Content
                      data-slot="tabs-content"
                      value="ute-details"
                      className="flex-1 outline-none"
                    >
                      <div className="flex flex-col w-full h-full p-6">
                        <div className="grow">
                          <div className="pb-6 flex items-center justify-between pr-4">
                            <div>
                              <h6 className="text-[17px] flex items-center gap-3">
                                Modiy Ute specifications
                                <Badge text="Active" />
                              </h6>
                              <p className="subtitle-regular text-gray-500">
                                You can enable / disable this method or modify it.
                              </p>
                            </div>
                            <UteSVG height={50} className="transform scale-x-[-1]" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <LabeledInput placeholder="Min weight" label="Min weight" badge="Kg" />
                            <LabeledInput placeholder="Max weight" label="Max weight" badge="Kg" />
                            <LabeledInput placeholder="Min length" label="Min length" badge="m" />
                            <LabeledInput placeholder="Max length" label="Max length" badge="m" />
                            <LabeledInput
                              placeholder="Max delivery distance"
                              label="Max delivery distance"
                              badge="Km"
                            />
                            <LabeledInput placeholder="Base charge" label="Base charge" badge="$" />
                            <LabeledInput
                              placeholder="Charge per Km"
                              label="Charge per Km"
                              badge="$"
                            />
                            <div>
                              <Select
                                label="Activation state"
                                items={[
                                  { value: 'AC', label: 'Active' },
                                  { value: 'DE', label: 'Deactive' },
                                ]}
                                defaultValue="AC"
                                placeholder="Select state / territory"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-6">
                          <Button
                            className="min-w-30 text-red-500 border-red-500 hover:bg-red-50"
                            variant="secondary"
                          >
                            Delete
                          </Button>
                          <div className="space-x-4">
                            <DialogPrimitive.Cancel asChild>
                              <Button className="min-w-30" variant="secondary">
                                Discard
                              </Button>
                            </DialogPrimitive.Cancel>

                            <DialogPrimitive.Action asChild>
                              <Button className="min-w-30">Submit</Button>
                            </DialogPrimitive.Action>
                          </div>
                        </div>
                      </div>
                    </TabsPrimitive.Content>
                  </TabsPrimitive.Root>
                </AlertDialogContent>
              </DialogPrimitive.Root>

              <Button className="w-full md:w-fit">
                <Download />
                Export All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-md border-2 border-border-gray-500 flex flex-col gap-6 p-6">
              <HeavyRigidTruckSVG height={60} />

              <div className="space-y-1 grow">
                <h6 className="text-[18px]">Heavy rigid truck</h6>
                <p className="text-[13px] text-subtitle">
                  A large open trailer used for carrying long, heavy materials. Used for long
                  delivery distances.
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-[14px]">
                    Maximum weight from <span className="font-bold pl-1">50,00 Kg</span> up to{' '}
                    <span className="font-bold pl-1">40,000 Kg</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum length from <span className="font-bold pl-1">1.0 m</span> up to{' '}
                    <span className="font-bold pl-1">16.0 m</span>
                  </p>
                  <p className="text-[14px]">
                    Base charge <span className="font-bold pl-1">350.00 $</span>
                  </p>
                  <p className="text-[14px]">
                    Charge per Km <span className="font-bold pl-1">6.00 $ / Km</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum delivery distance <span className="font-bold pl-1">2,000 Km</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DialogPrimitive.Root data-slot="alert-dialog">
                  <DialogPrimitive.Trigger asChild>
                    <Button>
                      <Edit />
                      Edit
                    </Button>
                  </DialogPrimitive.Trigger>
                  <AlertDialogContent className="font-roboto lg:w-[40vw] w-[90vw] max-h-[80vh]">
                    <div data-slot="alert-dialog-header" className="hidden">
                      <DialogPrimitive.Title
                        data-slot="alert-dialog-title"
                        className="text-sm/[19px] font-semibold hidden"
                      />
                    </div>
                    <div className="">
                      <h6 className="text-[17px]">Heavy rigid truck</h6>
                      <p className="subtitle-regular text-gray-500">
                        Edit heavy rigid truck conditions and charges.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <LabeledInput placeholder="Min weight" label="Min weight" badge="Kg" />
                      <LabeledInput placeholder="Max weight" label="Max weight" badge="Kg" />
                      <LabeledInput placeholder="Min length" label="Min length" badge="m" />
                      <LabeledInput placeholder="Max length" label="Max length" badge="m" />
                      <LabeledInput
                        placeholder="Max delivery distance"
                        label="Max delivery distance"
                        badge="Km"
                      />
                      <LabeledInput placeholder="Base charge" label="Base charge" badge="$" />
                      <LabeledInput placeholder="Charge per Km" label="Charge per Km" badge="$" />
                    </div>
                    <div className="flex justify-end pt-6 gap-4">
                      <DialogPrimitive.Cancel asChild>
                        <Button className="min-w-30" variant="secondary">
                          Discard
                        </Button>
                      </DialogPrimitive.Cancel>

                      <DialogPrimitive.Action asChild>
                        <Button className="min-w-30">Submit</Button>
                      </DialogPrimitive.Action>
                    </div>
                  </AlertDialogContent>
                </DialogPrimitive.Root>

                <Button variant="secondary" className="bg-gray-50">
                  <Download />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border-2 border-border-gray-500 flex flex-col gap-6 p-6 relative">
              <>
                <SmallPanelVanSVG height={60} />
              </>

              <div className="space-y-1 grow">
                <h6 className="text-[18px]">Small panel van</h6>
                <p className="text-[13px] text-subtitle">
                  A compact enclosed vehicle used for light or short-length deliveries within local
                  areas.
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-[14px]">
                    Maximum weight from <span className="font-bold pl-1">500 Kg</span> up to{' '}
                    <span className="font-bold pl-1">3,000 Kg</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum length from <span className="font-bold pl-1">1.0 m</span> up to{' '}
                    <span className="font-bold pl-1">5.5 m</span>
                  </p>
                  <p className="text-[14px]">
                    Base charge <span className="font-bold pl-1">150.00 $</span>
                  </p>
                  <p className="text-[14px]">
                    Charge per Km <span className="font-bold pl-1">3.0 $ / Km</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum delivery distance <span className="font-bold pl-1">300 Km</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button>
                  <Edit />
                  Edit
                </Button>
                <Button variant="secondary" className="bg-gray-50">
                  <Download />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border-2 border-border-gray-500 flex flex-col gap-6 p-6">
              <MediumRigidTruckSVG height={60} />

              <div className="space-y-1 grow">
                <h6 className="text-[18px]">Medium rigid truck</h6>
                <p className="text-[13px] text-subtitle">
                  A mid-sized tray truck suited for heavier loads and medium-distance
                  deliveries.{' '}
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-[14px]">
                    Maximum weight from <span className="font-bold pl-1">1,000 Kg</span> up to{' '}
                    <span className="font-bold pl-1">12,000 Kg</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum length from <span className="font-bold pl-1">1.0 m</span> up to{' '}
                    <span className="font-bold pl-1">9.0 m</span>
                  </p>
                  <p className="text-[14px]">
                    Base charge <span className="font-bold pl-1">250.00 $</span>
                  </p>
                  <p className="text-[14px]">
                    Charge per Km <span className="font-bold pl-1">4.5 $ / Km</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum delivery distance <span className="font-bold pl-1">1,500 Km</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button>
                  <Edit />
                  Edit
                </Button>
                <Button variant="secondary" className="bg-gray-50">
                  <Download />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border-2 border-border-gray-500 flex flex-col gap-6 p-6">
              <UteSVG height={60} />

              <div className="space-y-1 grow">
                <h6 className="text-[18px]">Ute</h6>
                <p className="text-[13px] text-subtitle">
                  A small-sized vehicle suited for lighter loads and short-distance deliveries.{' '}
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-[14px]">
                    Maximum weight from <span className="font-bold pl-1">1,000 Kg</span> up to{' '}
                    <span className="font-bold pl-1">12,000 Kg</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum length from <span className="font-bold pl-1">1.0 m</span> up to{' '}
                    <span className="font-bold pl-1">9.0 m</span>
                  </p>
                  <p className="text-[14px]">
                    Base charge <span className="font-bold pl-1">250.00 $</span>
                  </p>
                  <p className="text-[14px]">
                    Charge per Km <span className="font-bold pl-1">4.5 $ / Km</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum delivery distance <span className="font-bold pl-1">200 Km</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button>
                  <Edit />
                  Edit
                </Button>
                <Button variant="secondary" className="bg-gray-50">
                  <Download />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border-2 border-border-gray-500 flex flex-col gap-6 p-6">
              <FreightTrainSVG height={60} />

              <div className="space-y-1 grow">
                <h6 className="text-[18px]">Rail freight</h6>
                <p className="text-[13px] text-subtitle">
                  A vehicle suited for the heveaiest loads and longest deliveries.{' '}
                </p>
                <div className="space-y-2 pt-2">
                  <p className="text-[14px]">
                    Maximum weight from <span className="font-bold pl-1">10,000 Kg</span> up to{' '}
                    <span className="font-bold pl-1">100,000+ Kg</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum length from <span className="font-bold pl-1">3.0 m</span> up to{' '}
                    <span className="font-bold pl-1">60.0+ m</span>
                  </p>
                  <p className="text-[14px]">
                    Base charge <span className="font-bold pl-1">Freight collect</span>
                  </p>
                  <p className="text-[14px]">
                    Charge per Km <span className="font-bold pl-1">Freight collect</span>
                  </p>
                  <p className="text-[14px]">
                    Maximum delivery distance <span className="font-bold pl-1">5000+ Km</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button>
                  <Edit />
                  Edit
                </Button>
                <Button variant="secondary" className="bg-gray-50">
                  <Download />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
