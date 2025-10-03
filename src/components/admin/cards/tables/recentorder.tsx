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
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/uikit/badge'

const data: OrderDetails[] = [
  {
    OrderID: 5849453,
    Customer: 'Ali Smith',
    DueDate: '2025-10-15',
    Material: 'Steel',
    priority: 'Normal',
    status: 'CO',
  },
  {
    OrderID: 9657475,
    Customer: 'Joe Biden',
    DueDate: '2025-10-15',
    Material: 'gold',
    priority: 'Normal',
    status: 'RFP',
  },
  {
    OrderID: 3144123,
    Customer: 'Jane Doe',
    DueDate: '2025-10-20',
    Material: 'Aluminum',
    priority: 'Urgent',
    status: 'PE',
  },
  {
    OrderID: 5638677,
    Customer: 'Emma Wilson',
    DueDate: '2025-10-22',
    Material: 'Brass',
    priority: 'Normal',
    status: 'RE',
  },
]

export type OrderDetails = {
  OrderID: number
  Customer: string
  DueDate: string
  Material: string
  priority: 'Normal' | 'Urgent' | 'High'
  status: 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE'
}

interface CustomTableMeta<TData> extends TableMeta<TData> {
  updateData: (updatedData: TData[]) => void
}

const statusOptions = [
  { value: 'PE', label: 'Pending' },
  { value: 'IP', label: 'In Production' },
  { value: 'RFP', label: 'Ready for pickup' },
  { value: 'SI', label: 'Shipped' },
  { value: 'CO', label: 'Completed' },
  { value: 'RE', label: 'Rejected' },
]

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString('en-US', { weekday: 'long' })
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dayNum = String(date.getDate()).padStart(2, '0')
  return `${day} - ${month}/${dayNum}`
}

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

export const columns: ColumnDef<OrderDetails>[] = [
  {
    accessorKey: 'OrderID',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Order ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-6 ">{row.getValue('OrderID')}</div>,
  },
  {
    accessorKey: 'Customer',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('Customer')}</div>,
  },
  {
    accessorKey: 'DueDate',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDueDate(row.getValue('DueDate'))}</div>,
  },
  {
    accessorKey: 'Material',
    header: 'Material',
    cell: ({ row }) => <div>{row.getValue('Material')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row, table }) => {
      const handleStatusChange = (value: 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE') => {
        const updatedData = table.options.data.map((item) =>
          item.OrderID === row.original.OrderID ? { ...item, status: value } : item,
        )
        ;(table.options.meta as CustomTableMeta<OrderDetails>)?.updateData(updatedData)
      }

      return (
        <Select
          items={statusOptions}
          value={row.getValue('status')}
          onValueChange={handleStatusChange}
        >
          <div className="flex items-center">
            <Badge
              text={getStatusLabel(row.getValue('status'))}
              variant={getStatusVariant(row.getValue('status'))}
              className="capitalize flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer"
            >
              <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
            </Badge>
          </div>
        </Select>
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
          onClick={() => router.push(`/ff-admin/order/${row.original.OrderID}`)}
        >
          {/* Add your custom icon here */}
          <EyeIcon />
          <span className="sr-only">View order details</span>
        </Button>
      )
    },
  },
]

export default function RecentOrderTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [fetchedData, setFetchedData] = React.useState<OrderDetails[]>(data)
  const router = useRouter()

  const table = useReactTable({
    data: fetchedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (updatedData: OrderDetails[]) => {
        setFetchedData(updatedData)
      },
    } as CustomTableMeta<OrderDetails>,
  })

  return (
    <div className="mt-4 mb-6 mx-6">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-xmd font-semibold ">Recent Orders</h2>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
          onClick={() => router.push('/ff-admin/order')}
        >
          View All <ChevronDown className="rotate-[-90deg] h-4 w-4 text-sm" />
        </Button>
      </div>
      <div className="rounded-md border border-gray-300 ">
        <Table className="border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none pt-4 h-14 ">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-b border-gray-300 w-4">
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
                <TableRow key={row.id} className="border-none h-20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-none">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none pt-4">
                <TableCell colSpan={columns.length} className="h-24 text-center border-none">
                  No orders to show just yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
