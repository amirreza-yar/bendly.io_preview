'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  TableMeta,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, EyeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select } from '@/components/uikit/select'
import { Badge } from '@/components/uikit/badge'
import { StatusCell } from './statuscell'

const data: RequestDetails[] = [
  {
    RequestID: 'REQ-65842343',
    priority: 'Normal',
    status: 'CO',
  },
  {
    RequestID: 'REQ-65842344',
    priority: 'Normal',
    status: 'RFP',
  },
  {
    RequestID: 'REQ-65842345',
    priority: 'Urgent',
    status: 'PE',
  },
]

export type RequestDetails = {
  RequestID: string
  priority: 'Normal' | 'Urgent' | 'High'
  status: 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE'
}

interface CustomTableMeta<TData> extends TableMeta<TData> {
  updateData: (updatedData: TData[]) => void
}

const statusOptions: { value: RequestDetails['status']; label: string }[] = [
  { value: 'PE', label: 'Pending' },
  { value: 'IP', label: 'In Production' },
  { value: 'RFP', label: 'Ready for pickup' },
  { value: 'SI', label: 'Shipped' },
  { value: 'CO', label: 'Completed' },
  { value: 'RE', label: 'Rejected' },
]

const getStatusVariant = (status: string): 'green' | 'orange' | 'red' | 'blue' | 'gray' => {
  switch (status) {
    case 'CO':
    case 'RFP':
      return 'green'
    case 'PE':
      return 'orange'
    case 'IP':
      return 'blue'
    case 'SI':
      return 'gray'
    case 'RE':
      return 'red'
    default:
      return 'gray'
  }
}

const getStatusLabel = (status: string): string => {
  const option = statusOptions.find((opt) => opt.value === status)
  return option ? option.label : status
}

const getPriorityVariant = (priority: string): 'gray' | 'orange' | 'red' => {
  switch (priority) {
    case 'Urgent':
      return 'orange'
    case 'High':
      return 'red'
    case 'Normal':
    default:
      return 'gray'
  }
}

export const columns: ColumnDef<RequestDetails>[] = [
  {
    accessorKey: 'RequestID',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Request ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-6">{row.getValue('RequestID')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row, table }) => {
      const handleStatusChange = (value: 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE') => {
        const updatedData = table.options.data.map((item) =>
          item.RequestID === row.original.RequestID ? { ...item, status: value } : item,
        )
        ;(table.options.meta as CustomTableMeta<RequestDetails>)?.updateData(updatedData)
      }

      return (
        <StatusCell
          value={row.getValue('status')}
          onChange={handleStatusChange}
          items={statusOptions}
        />
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge
        text={row.getValue('priority')}
        variant={getPriorityVariant(row.getValue('priority'))}
        className="capitalize"
      />
    ),
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 pr-6"
          onClick={() => router.push(`/ff-admin/request/${row.original.RequestID}`)}
        >
          <EyeIcon />
          <span className="sr-only">View request details</span>
        </Button>
      )
    },
  },
]

export default function ReplacementRequestTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [fetchedData, setFetchedData] = React.useState<RequestDetails[]>(data)
  const router = useRouter()

  const table = useReactTable({
    data: fetchedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (updatedData: RequestDetails[]) => {
        setFetchedData(updatedData)
      },
    } as CustomTableMeta<RequestDetails>,
  })

  return (
    <div className="mt-4 mb-6 mx-6">
      <div className="flex items-center justify-between py-4">
        <h5 className="text-md font-semibold">Replacement Requests</h5>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
          onClick={() => router.push('/ff-admin/request')}
        >
          View All <ChevronDown className="rotate-[-90deg] h-4 w-4 text-sm" />
        </Button>
      </div>
      <div className="rounded-md border border-gray-300">
        <Table className="border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none ">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-b border-gray-300 py-4">
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
                <TableRow key={row.id} className="border-none gap-4">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-none pt-4 h-20">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none">
                <TableCell colSpan={columns.length} className=" text-center border-none pt-4">
                  No requests to show just yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
