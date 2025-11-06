'use client'
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
import { CircleQuestion, Download, Edit, GearSetting, Plus } from '@/components/uikit/icons'
import FlashingSVG from '@/components/utils/flashingSVG'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import AddNewMaterialVarModal from '@/components/admin/modals/addNewMatVarModal'
import { NewVairantFormValues } from '@/components/admin/forms/addNewMatVarForm'
import EditMaterialModal from '@/components/admin/modals/editMaterialModal'
import { EditMaterialFormValues } from '@/components/admin/forms/editMaterialForm'

const data = {
  material: 'Pre-painted steel',
  colors: [
    { name: 'Monument', code: '#504A4B' },
    { name: 'Surfmist', code: '#ECE7E1' },
    { name: 'Shale Grey', code: '#7D7D7D' },
    { name: 'Woodland Grey', code: '#5C6A6A' },
    { name: 'Manor Red', code: '#8B3A3A' },
  ],
  baseCost: 5,
  costPerFold: 2,
  squishCost: 4,
  costPer100Girth: 3,
  costPer1Length: 15,
}

let materialDetails: any = {
  material: 'Pre-painted steel',
  groups: [
    {
      groupName: 'Base Group',
      colors: [
        { name: 'Monument', code: '#504A4B' },
        { name: 'Surfmist', code: '#ECE7E1' },
        { name: 'Shale Grey', code: '#7D7D7D' },
        { name: 'Woodland Grey', code: '#5C6A6A' },
        { name: 'Manor Red', code: '#8B3A3A' },
      ],
      baseCost: 5,
      costPerFold: 2,
      squishCost: 4,
      costPer100Girth: 3,
    },
    {
      groupName: 'Secondary Group',
      colors: [
        { name: 'Surfmist', code: '#ECE7E1' },
        { name: 'Classic Cream', code: '#F1E3C4' },
        { name: 'Paperbark', code: '#D2C0A2' },
        { name: 'Shale Grey', code: '#7D7D7D' },
        { name: 'Dune', code: '#B6A998' },
      ],
      baseCost: 8,
      costPerFold: 3,
      squishCost: 6,
      costPer100Girth: 5,
    },
  ],
}

const demoFlashingData = {
  nodes: [
    {
      node_id: 'gwomd9',
      left: 100,
      top: 350,
      next_node_id: '9rnao4',
    },
    {
      node_id: '9rnao4',
      left: 50,
      top: 500,
      prev_node_id: 'gwomd9',
      next_node_id: 'jeq3bi',
    },
    {
      node_id: 'jeq3bi',
      left: 150,
      top: 500,
      prev_node_id: '9rnao4',
      next_node_id: '6jagob',
    },
    {
      node_id: '6jagob',
      left: 200,
      top: 400,
      prev_node_id: 'jeq3bi',
      next_node_id: 'b7lk16',
    },
    {
      node_id: 'b7lk16',
      left: 150,
      top: 350,
      prev_node_id: '6jagob',
    },
  ],
  startCrushFold: true,
  endCrushFold: false,
  crushFoldDir: false,
  material: 'Stainless steel',
  createdAt: 1755368254753,
  updatedAt: 1755368273619,
  isDraft: false,
  colorSideDirection: false,
  thickness: {
    code: 'SS304-08',
    thickness: 0.8,
  },
  crushFold: false,
  tapered: false,
  totalGirth: 441,
}

export default function MaterialDetailsPage() {
  const [isAddNewVarModalOpen, setIsAddNewVarModalOpen] = useState<boolean>(false)
  const [isEditMaterialModalOpen, setIsEditMaterialModalOpen] = useState<boolean>(false)

  const onNewVariantFormSubmit = async (data: NewVairantFormValues) => {
    console.log(data)
    setIsAddNewVarModalOpen(false)
    toast('New variants added')
  }

  const onEditMaterialFormSubmit = async (data: EditMaterialFormValues) => {
    console.log(data)
    // setIsEditMaterialModalOpen(false)
    toast('Material updated')
  }

  return (
    <>
      <div className="h-full bg-[#F1F5F9]">
        <Breadcrumb className="px-6 pt-6">
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
              <BreadcrumbLink asChild>
                <Link href="/ff-admin/setting/material" className="text-primary label-regular">
                  Materials
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="label-regular">Material Details: {443212}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-3 p-6 gap-6 relative">
          <div className="col-span-1 h-fit sticky top-26">
            <div className="bg-white flex flex-col gap-4 items-center border border-border-default rounded-lg pt-10 pb-10 p-8">
              <div className="flex items-center justify-center gap-3 pb-4">
                <MetalSVG className="size-7" />
                <h3 className="font-bold">{data.material}</h3>
              </div>
              <div className="flex flex-col items-start w-full gap-3 pb-3">
                <p className="body-regular font-bold">Colors</p>
                <div className="grid gap-3 w-full">
                  {data.colors.map((color, index) => (
                    <div key={index} className="flex items-center justify-between pr-8 pl-2">
                      <p className="caption-regular">{color.name}</p>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ background: `${color.code}` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Type</p>
                <p className="label-regular">Color</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Groups</p>
                <p className="label-regular">2</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Num. of colors</p>
                <p className="label-regular">11</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Base cost</p>
                <p className="label-regular">5.00 $</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Cost per fold</p>
                <p className="label-regular">2.00 $</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Squish fold cost</p>
                <p className="label-regular">4.00 $</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="label-regular font-bold">Cost per 100 mm girth</p>
                <p className="label-regular">3.00 $</p>
              </div>
              <div className="w-full px-2 pt-6 space-y-3">
                <Button variant="secondary" onClick={() => {}} className="w-full">
                  <Download />
                  Export Material
                </Button>
                <Button onClick={() => setIsEditMaterialModalOpen(true)} className="w-full">
                  <Edit />
                  Edit Material
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-2 p-8 bg-white flex flex-col border border-border-default rounded-lg">
            <h5 className="text-md">Demo flashing cost calculation</h5>
            <p className="pb-8 pt-2 label-regular text-subtitle">
              A demo calculation to see how much a flashing will cost
            </p>
            <div className="p-8 border border-border-dark bg-gray-50 rounded-lg w-full flex flex-col items-center justify-center gap-12">
              <FlashingSVG flashing={demoFlashingData} className="w-90" />
              <div className="flex flex-wrap gap-4 w-full">
                <p className="text-[14px]/[16px] font-semibold p-2 rounded-sm border-border-dark border bg-gray-100">
                  Total girth: <span className="font-bold">820 mm</span>
                </p>
                <p className="text-[14px]/[16px] font-semibold p-2 rounded-sm border-border-dark border bg-gray-100">
                  Num. of folds: <span className="font-bold">3</span>
                </p>
                <p className="text-[14px]/[16px] font-semibold p-2 rounded-sm border-border-dark border bg-gray-100">
                  Num. of squish folds: <span className="font-bold">1</span>
                </p>
                <p className="text-[14px]/[16px] font-semibold p-2 rounded-sm border-border-dark border bg-gray-100">
                  Length: <span className="font-bold">4320 mm</span>
                </p>
              </div>
            </div>
            <div className="pt-8">
              <h6>Cost calculation</h6>
              <p className="pb-8 pt-2 label-regular text-subtitle">
                Cost calculation for the demo flashing above.
              </p>
              <div className="grid">
                <table className="w-full">
                  <thead className="border-b border-border-dark bg-gray-200">
                    <tr>
                      <th className="text-[14px]/[19px] font-semibold text-start px-4 py-2">
                        Name
                      </th>
                      <th className="text-[14px]/[19px] font-semibold text-center px-4 py-2">
                        Cost per unit
                      </th>
                      <th className="text-[14px]/[19px] font-semibold text-center px-4 py-2">
                        Variable
                      </th>
                      <th className="text-[14px]/[19px] font-semibold text-center px-4 py-2">
                        total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-t [&_tr:last-child]:border-border-dark label-regular">
                    <tr>
                      <td className="px-2 py-3">Base cost</td>
                      <td className="px-2 py-3 text-center">5.00 $</td>
                      <td className="px-2 py-3 text-center">-</td>
                      <td className="px-2 py-3 text-center">5.00 $</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-3">Folds cost</td>
                      <td className="px-2 py-3 text-center">2.00 $</td>
                      <td className="px-2 py-3 text-center">3</td>
                      <td className="px-2 py-3 text-center">6.00 $</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-3">Squish Folds cost</td>
                      <td className="px-2 py-3 text-center">4.00 $</td>
                      <td className="px-2 py-3 text-center">1</td>
                      <td className="px-2 py-3 text-center">4.00 $</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-3">Grith cost</td>
                      <td className="px-2 py-3 text-center">3.00 $</td>
                      <td className="px-2 py-3 text-center">9</td>
                      <td className="px-2 py-3 text-center">27.00 $</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-3 flex items-center gap-2">
                        Length cost
                        <CircleQuestion className="size-4" />
                      </td>
                      <td className="px-2 py-3 text-center">42.00 $</td>
                      <td className="px-2 py-3 text-center">5</td>
                      <td className="px-2 py-3 text-center">210.00 $</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="p-3 font-xbold">Total cost</td>
                      <td className="p-3 font-xbold text-center"></td>
                      <td className="p-3 font-xbold text-center"></td>
                      <td className="p-3 font-xbold text-center">210.00 $</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddNewMaterialVarModal
        isAddNewVarModalOpen={isAddNewVarModalOpen}
        setIsAddNewVarModalOpen={setIsAddNewVarModalOpen}
        onNewVariantFormSubmit={onNewVariantFormSubmit}
      />

      <EditMaterialModal
        isEditMaterialModalOpen={isEditMaterialModalOpen}
        setIsEditMaterialModalOpen={setIsEditMaterialModalOpen}
        materialDetails={materialDetails}
        onEditMaterialFormSubmit={onEditMaterialFormSubmit}
      />
    </>
  )
}
