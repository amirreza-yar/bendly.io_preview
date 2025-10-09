'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableMeta,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown } from 'lucide-react'
import { PaginationDemo } from '@/components/admin/pagination/paginationcustom'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/uikit/select'
import { Badge } from '@/components/uikit/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EyeIcon } from '@/components/uikit/icons'
import { StatusCell } from './statuscell'

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

const statusOptions: { value: OrderDetails['status']; label: string }[] = [
  { value: 'PE', label: 'Pending' },
  { value: 'IP', label: 'In Production' },
  { value: 'RFP', label: 'Ready for pickup' },
  { value: 'SI', label: 'Shipped' },
  { value: 'CO', label: 'Completed' },
  { value: 'RE', label: 'Rejected' },
]

const timeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom_range', label: 'Custom Range' },
  { value: 'all_time', label: 'All Time' },
]

const materialOptions = [
  { value: 'Steel', label: 'Steel' },
  { value: 'gold', label: 'Gold' },
  { value: 'Aluminum', label: 'Aluminum' },
  { value: 'Brass', label: 'Brass' },
]

const priorityOptions = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'High', label: 'High' },
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
    cell: ({ row }) => <div className="pl-6">{row.getValue('OrderID')}</div>,
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
          onClick={() => router.push(`/ff-admin/order/${row.original.OrderID}`)}
        >
          <EyeIcon />
          <span className="sr-only">View order details</span>
        </Button>
      )
    },
  },
]

export function OrderManagementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [fetchedData, setFetchedData] = React.useState<OrderDetails[]>(data)
  const [selectedTime, setSelectedTime] = React.useState<string[]>(['all_time'])
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([])

  const filterData = () => {
    let filteredData = data

    // Time filter
    if (selectedTime.length > 0 && !selectedTime.includes('all_time')) {
      const today = new Date('2025-10-08') // Using provided date
      filteredData = filteredData.filter((item) => {
        const dueDate = new Date(item.DueDate)
        return selectedTime.some((time) => {
          if (time === 'today') {
            return dueDate.toDateString() === today.toDateString()
          }
          if (time === 'this_week') {
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)
            return dueDate >= startOfWeek && dueDate <= endOfWeek
          }
          if (time === 'last_week') {
            const startOfLastWeek = new Date(today)
            startOfLastWeek.setDate(today.getDate() - today.getDay() - 7)
            const endOfLastWeek = new Date(startOfLastWeek)
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
            return dueDate >= startOfLastWeek && dueDate <= endOfLastWeek
          }
          if (time === 'this_month') {
            return (
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear()
            )
          }
          if (time === 'last_month') {
            const lastMonth = new Date(today)
            lastMonth.setMonth(today.getMonth() - 1)
            return (
              dueDate.getMonth() === lastMonth.getMonth() &&
              dueDate.getFullYear() === lastMonth.getFullYear()
            )
          }
          if (time === 'this_year') {
            return dueDate.getFullYear() === today.getFullYear()
          }
          if (time === 'custom_range') {
            // Placeholder for custom range
            return true
          }
          return false
        })
      })
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filteredData = filteredData.filter((item) => selectedMaterials.includes(item.Material))
    } else {
      filteredData = [] // If no materials selected, show no rows
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filteredData = filteredData.filter((item) => selectedStatuses.includes(item.status))
    } else {
      filteredData = [] // If no statuses selected, show no rows
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filteredData = filteredData.filter((item) => selectedPriorities.includes(item.priority))
    } else {
      filteredData = [] // If no priorities selected, show no rows
    }

    setFetchedData(filteredData)
  }

  const table = useReactTable({
    data: fetchedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (updatedData: OrderDetails[]) => {
        setFetchedData(updatedData)
      },
    } as CustomTableMeta<OrderDetails>,
  })

  return (
    <div className=" mx-6 my-6">
      <div className="flex items-center h-11 my-6 gap-6">
        <Input
          placeholder="Filter by customer or order id"
          value={(table.getColumn('OrderID')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('OrderID')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto w-[130px]">
              Time Filter <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {timeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize"
                checked={selectedTime.includes(option.value)}
                onCheckedChange={(checked) => {
                  setSelectedTime((prev) =>
                    checked
                      ? [...prev.filter((val) => val !== 'all_time'), option.value]
                      : prev.filter((val) => val !== option.value),
                  )
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto w-[190px]">
              All Materials <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {materialOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize"
                checked={selectedMaterials.includes(option.value)}
                onCheckedChange={(checked) => {
                  setSelectedMaterials((prev) =>
                    checked ? [...prev, option.value] : prev.filter((val) => val !== option.value),
                  )
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto w-[175px]">
              All Statuses <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize"
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={(checked) => {
                  setSelectedStatuses((prev) =>
                    checked ? [...prev, option.value] : prev.filter((val) => val !== option.value),
                  )
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto w-[140px]">
              All Priorities <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {priorityOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize"
                checked={selectedPriorities.includes(option.value)}
                onCheckedChange={(checked) => {
                  setSelectedPriorities((prev) =>
                    checked ? [...prev, option.value] : prev.filter((val) => val !== option.value),
                  )
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <Button
            onClick={filterData}
            className="w-[74px] h-[44px] min-w-[64px] rounded-md px-3 py-2 gap-2 bg-[#3355FF] border border-border-primary text-white hover:bg-[#2a44cc]"
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-none h-24"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center mt-8">
        <div className="space-x-2">
          <PaginationDemo />
        </div>
      </div>
    </div>
  )
}
