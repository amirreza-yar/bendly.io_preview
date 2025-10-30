'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/uikit/buttons/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/uikit/badge'
import { Download, EyeIcon, Plus } from '@/components/uikit/icons'
import Link from 'next/link'
import { Input } from '@/components/uikit/input'
import { AddNewMaterialFormValues } from '../forms/addNewMaterialForm'
import { toast } from 'sonner'
import AddNewMaterialModal from '../modals/addNewMaterialModal'

// ✅ Example data
const data: MaterialVariant[] = [
  {
    material: 'Aluminium',
    variantNum: 1,
    variantBasedOn: 'Color',
    baseCost: 5.0,
    costPer100mmGirth: 3.0,
    costPerFold: 2.0,
    costPer1mLength: 13.0,
  },
  {
    material: 'Steel',
    variantNum: 2,
    variantBasedOn: 'Thickness',
    baseCost: 7.5,
    costPer100mmGirth: 3.5,
    costPerFold: 2.5,
    costPer1mLength: 15.0,
  },
  {
    material: 'Brass',
    variantNum: 3,
    variantBasedOn: 'Color',
    baseCost: 6.2,
    costPer100mmGirth: 3.3,
    costPerFold: 2.1,
    costPer1mLength: 14.4,
  },
  {
    material: 'Aluminium',
    variantNum: 1,
    variantBasedOn: 'Color',
    baseCost: 5.0,
    costPer100mmGirth: 3.0,
    costPerFold: 2.0,
    costPer1mLength: 13.0,
  },
  {
    material: 'Steel',
    variantNum: 2,
    variantBasedOn: 'Thickness',
    baseCost: 7.5,
    costPer100mmGirth: 3.5,
    costPerFold: 2.5,
    costPer1mLength: 15.0,
  },
  {
    material: 'Brass',
    variantNum: 3,
    variantBasedOn: 'Color',
    baseCost: 6.2,
    costPer100mmGirth: 3.3,
    costPerFold: 2.1,
    costPer1mLength: 14.4,
  },
]

export type MaterialVariant = {
  material: string
  variantNum: number
  baseCost: number
  variantBasedOn: string
  costPer100mmGirth: number
  costPerFold: number
  costPer1mLength: number
}

export const columns: ColumnDef<MaterialVariant>[] = [
  {
    accessorKey: 'material',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex text-black hover:bg-gray-200"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Material
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-6">{row.getValue('material')}</div>,
  },
  {
    accessorKey: 'variantNum',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black hover:bg-gray-200"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Variant Num.
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('variantNum')}</div>,
  },
  {
    accessorKey: 'variantBasedOn',
    header: 'Color / Thickness',
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          text={row.getValue('variantBasedOn')}
          variant={row.getValue('variantBasedOn') === 'Color' ? 'green' : 'blue'}
        />
      </div>
    ),
  },
  {
    accessorKey: 'baseCost',
    header: 'Base Cost',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue<number>('baseCost').toFixed(2)} $</div>
    ),
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <Link href="/ff-admin/setting/material/123" className="flex justify-center w-full">
          <EyeIcon className="size-5" />
          <span className="sr-only">View order details</span>
        </Link>
      )
    },
  },
  // {
  //   accessorKey: 'costPer100mmGirth',
  //   header: 'Cost per 100mm Girth',
  //   cell: ({ row }) => <div>{row.getValue('costPer100mmGirth').toFixed(2)} $</div>,
  // },
  // {
  //   accessorKey: 'costPerFold',
  //   header: 'Cost per Fold',
  //   cell: ({ row }) => <div>{row.getValue('costPerFold').toFixed(2)} $</div>,
  // },
  // {
  //   accessorKey: 'costPer1mLength',
  //   header: 'Cost per 1m Length',
  //   cell: ({ row }) => <div>{row.getValue('costPer1mLength').toFixed(2)} $</div>,
  // },
]

export default function MaterialsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [fetchedData, setFetchedData] = useState<MaterialVariant[]>(data)
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [isAddNewMaterialModalOpen, setIsAddNewMaterialModalOpen] = useState<boolean>(false)

  const onAddNewMaterialFormSubmit = async (data: AddNewMaterialFormValues) => {
    console.log(data)
    setIsAddNewMaterialModalOpen(false)
    toast('New material added')
  }

  const table = useReactTable({
    data: fetchedData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      return row.original.material.toLowerCase().includes(search)
    },
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter by customer or order id"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setIsAddNewMaterialModalOpen(true)}>
              <Plus />
              Add Material
            </Button>
            <Button>
              <Download />
              Export
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-gray-300">
          <Table className="border-none">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none pt-4 h-14">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border-b border-gray-300 text-center text-[14px]/[19px] font-semibold text-black"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-none h-15">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="label-regular">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-none pt-4">
                  <TableCell colSpan={columns.length} className="h-60 text-center border-none">
                    No material to show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
