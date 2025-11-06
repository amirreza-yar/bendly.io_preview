'use client'

import { AddNewMaterialFormValues } from '@/components/admin/forms/addNewMaterialForm'
import AddNewMaterialModal from '@/components/admin/modals/addNewMaterialModal'
import { MetalSVG } from '@/components/admin/svgs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import { Button } from '@/components/uikit/buttons/button'
import { ChevronRight, Download, GearSetting, Plus } from '@/components/uikit/icons'
import { Input } from '@/components/uikit/input'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

type MaterialVariant = {
  material: string
  variantNum: number
  baseCost: number
  costPer100mmGirth: number
  costPerFold: number
  costPer1mLength: number
  type: 'Color' | 'Thickness'
}

const materials: MaterialVariant[] = [
  {
    material: 'Aluminium',
    variantNum: 1,
    type: 'Color',
    baseCost: 5.0,
    costPer100mmGirth: 3.0,
    costPerFold: 2.0,
    costPer1mLength: 13.0,
  },
  {
    material: 'Steel',
    variantNum: 2,
    type: 'Thickness',
    baseCost: 7.5,
    costPer100mmGirth: 3.5,
    costPerFold: 2.5,
    costPer1mLength: 15.0,
  },
  {
    material: 'Brass',
    variantNum: 3,
    type: 'Color',
    baseCost: 6.2,
    costPer100mmGirth: 3.3,
    costPerFold: 2.1,
    costPer1mLength: 14.4,
  },
  {
    material: 'Aluminium',
    variantNum: 1,
    type: 'Color',
    baseCost: 5.0,
    costPer100mmGirth: 3.0,
    costPerFold: 2.0,
    costPer1mLength: 13.0,
  },
  {
    material: 'Steel',
    variantNum: 2,
    type: 'Thickness',
    baseCost: 7.5,
    costPer100mmGirth: 3.5,
    costPerFold: 2.5,
    costPer1mLength: 15.0,
  },
  {
    material: 'Brass',
    variantNum: 3,
    type: 'Color',
    baseCost: 6.2,
    costPer100mmGirth: 3.3,
    costPerFold: 2.1,
    costPer1mLength: 14.4,
  },
]

export default function MaterialsPage() {
  const [materialFilter, setMaterialFilter] = useState<MaterialVariant[]>(materials)
  const [isAddNewMaterialModalOpen, setIsAddNewMaterialModalOpen] = useState<boolean>(false)

  const onAddNewMaterialFormSubmit = async (data: AddNewMaterialFormValues) => {
    console.log(data)
    setIsAddNewMaterialModalOpen(false)
    toast('New material added')
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
            <BreadcrumbItem className="label-regular">
              <BreadcrumbPage>Materials</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="p-8 bg-white flex flex-col gap-10 border border-border-default rounded-lg min-h-[calc(100%-50px)]">
          <div className="space-y-6">
            <div className="md:flex space-y-3 md:space-y-0 items-center justify-between gap-3">
              <Input
                placeholder="Filter by customer or order id"
                onChange={(e) => {
                  const searched = materials.filter((mat) =>
                    mat.material.toLowerCase().includes(e.target.value.toLocaleLowerCase()),
                  )
                  setMaterialFilter(searched)
                }}
                className="md:max-w-sm"
              />
              <div className="md:flex gap-3 space-y-3 md:space-y-0">
                <Button
                  variant="secondary"
                  className="w-full md:w-fit"
                  onClick={() => setIsAddNewMaterialModalOpen(true)}
                >
                  <Plus />
                  Add Material
                </Button>
                <Button className="w-full md:w-fit">
                  <Download />
                  Export
                </Button>
              </div>
            </div>
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
              {materialFilter.map((mat, index) => (
                <Link
                  href="/ff-admin/setting/material/123"
                  key={index}
                  className="border border-border-default rounded-md flex flex-col p-4 gap-2"
                >
                  <div className="flex gap-2 items-center pb-1">
                    <MetalSVG className="size-5" />
                    <span className="font-semibold text-[18px]">{mat.material}</span>
                  </div>
                  <div className="flex items-center justify-between w-full px-1">
                    <p className="body-small text-gray-700">Type</p>
                    <p className="text-[13px]/[20px] font-semibold">{mat.type}</p>
                  </div>
                  <div className="flex items-center justify-between w-full px-1">
                    <p className="body-small text-gray-700">
                      {mat.type === 'Color' ? 'Colors' : 'Thicknesses'}
                    </p>
                    <p className="text-[13px]/[20px] font-semibold">{mat.variantNum}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 pl-1">
                    <p className="label-regular">
                      Base / <span>{mat.baseCost.toFixed(2)} $</span>
                    </p>
                    <ChevronRight className="size-5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddNewMaterialModal
        isAddNewMaterialModalOpen={isAddNewMaterialModalOpen}
        setIsAddNewMaterialModalOpen={setIsAddNewMaterialModalOpen}
        onAddNewMaterialFormSubmit={onAddNewMaterialFormSubmit}
      />
    </>
  )
}
