'use client'

import * as React from 'react'
import type { DateRange } from 'react-day-picker'
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
import { Badge } from '@/components/uikit/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusCell } from './statuscell'
import { Calendar } from '@/components/uikit/calendar'
import { EyeIcon, Plus } from '@/components/uikit/icons'

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

interface DateRangePickerProps {
  onChange?: (range: { start: Date; end: Date }) => void
  onCancel?: () => void
}

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
    priority: 'High',
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
  {
    OrderID: 5638787,
    Customer: 'Sarah Wilson',
    DueDate: '2025-10-22',
    Material: 'Brass',
    priority: 'High',
    status: 'IP',
  },
]

const statusOptions = [
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

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'orange'
    case 'High':
      return 'red'
    case 'Normal':
      return 'gray'
    default:
      return 'gray'
  }
}

export const columns: ColumnDef<OrderDetails>[] = [
  {
    accessorKey: 'OrderID',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Order ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-6">{row.getValue('OrderID')}</div>,
    filterFn: (row, columnId, filterValue) => String(row.getValue('OrderID')).includes(filterValue),
  },
  {
    accessorKey: 'Customer',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Customer <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('Customer')}</div>,
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue('Customer')).toLowerCase().includes(String(filterValue).toLowerCase()),
  },
  {
    accessorKey: 'DueDate',
    header: 'Due Date',
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
          items={statusOptions as any}
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
          {/* Add your custom icon here */}
          <EyeIcon />
          <span className="sr-only">View order details</span>
        </Button>
      )
    },
  },
]

interface CancelButtonProps {
  onClick?: () => void
  label?: string
  disabled?: boolean
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  label = 'Cancel',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, onCancel }) => {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <div className="w-fit rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        captionLayout="dropdown"
        className="rounded-md"
      />

      <div className="flex justify-between items-center text-sm text-gray-700 px-1">
        {range?.from && range?.to ? (
          <p>
            Selected: <strong>{range.from.toLocaleDateString()}</strong> →{' '}
            <strong>{range.to.toLocaleDateString()}</strong>
          </p>
        ) : range?.from ? (
          <p>
            Start: <strong>{range.from.toLocaleDateString()}</strong>
          </p>
        ) : (
          <p>Select a start and end date</p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setRange(undefined)}
          >
            Clear
          </Button>

          <CancelButton
            onClick={() => {
              setRange(undefined)
              onCancel?.()
            }}
            label="Cancel"
          />

          <Button
            variant="default"
            size="sm"
            className="bg-[#3355FF] text-white hover:bg-[#2a44cc]"
            onClick={() => {
              if (range?.from && range?.to && onChange) {
                onChange({ start: range.from, end: range.to })
              }
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CustomerOrderTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [fetchedData, setFetchedData] = React.useState<OrderDetails[]>(data)

  const [selectedTime, setSelectedTime] = React.useState<string[]>(['all_time'])
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [customRange, setCustomRange] = React.useState<{ start: Date; end: Date } | null>(null)
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const router = useRouter()

  const filterData = React.useCallback(() => {
    let filteredData = data

    // Time filter
    if (selectedTime.length > 0 && !selectedTime.includes('all_time')) {
      const today = new Date('2025-10-08')
      filteredData = filteredData.filter((item) => {
        const dueDate = new Date(item.DueDate)
        return selectedTime.some((time) => {
          if (time === 'custom_range' && customRange) {
            return dueDate >= customRange.start && dueDate <= customRange.end
          }
          if (time === 'today') return dueDate.toDateString() === today.toDateString()
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
          if (time === 'this_month')
            return (
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear()
            )
          if (time === 'last_month') {
            const lastMonth = new Date(today)
            lastMonth.setMonth(today.getMonth() - 1)
            return (
              dueDate.getMonth() === lastMonth.getMonth() &&
              dueDate.getFullYear() === lastMonth.getFullYear()
            )
          }
          if (time === 'this_year') return dueDate.getFullYear() === today.getFullYear()
          return false
        })
      })
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filteredData = filteredData.filter((item) => selectedMaterials.includes(item.Material))
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filteredData = filteredData.filter((item) => selectedStatuses.includes(item.status))
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filteredData = filteredData.filter((item) => selectedPriorities.includes(item.priority))
    }

    setFetchedData(filteredData)
  }, [selectedTime, selectedMaterials, selectedStatuses, selectedPriorities, customRange])

  const table = useReactTable({
    data: fetchedData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      return (
        row.original.Customer.toLowerCase().includes(search) ||
        String(row.original.OrderID).includes(search)
      )
    },
    meta: { updateData: setFetchedData } as CustomTableMeta<OrderDetails>,
  })

  return (
    <div className="mx-6 my-6">
      <div className="w-fill flex justify-between mb-4 h-11 pl-2">
        <h5 className="">Orders</h5>
        <button className="flex gap-2 border border-border-primary rounded-md text-primary text-sm py-3 px-4 ">
          <Plus />
          Add New Order
        </button>
      </div>
      <div className="flex my-6 w-full justify-between h-11 gap-6">
        <Input
          placeholder="Filter by customer or order id"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Time Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[130px]">
              Time Filter <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {timeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1"
                checked={selectedTime.includes(option.value)}
                onCheckedChange={(checked) => {
                  setSelectedTime((prev) =>
                    checked
                      ? [...prev.filter((v) => v !== 'all_time'), option.value]
                      : prev.filter((v) => v !== option.value),
                  )
                  if (option.value === 'custom_range' && checked) setShowDatePicker(true)
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Material Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[190px]">
              All Materials <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {materialOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1"
                checked={selectedMaterials.includes(option.value)}
                onCheckedChange={(checked) =>
                  setSelectedMaterials((prev) =>
                    checked ? [...prev, option.value] : prev.filter((v) => v !== option.value),
                  )
                }
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[175px]">
              All Statuses <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1"
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={(checked) =>
                  setSelectedStatuses((prev) =>
                    checked ? [...prev, option.value] : prev.filter((v) => v !== option.value),
                  )
                }
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[140px]">
              All Priorities <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {priorityOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1"
                checked={selectedPriorities.includes(option.value)}
                onCheckedChange={(checked) =>
                  setSelectedPriorities((prev) =>
                    checked ? [...prev, option.value] : prev.filter((v) => v !== option.value),
                  )
                }
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={filterData}
          className="w-[74px] rounded-md bg-[#3355FF] text-white hover:bg-[#2a44cc]"
        >
          Apply
        </Button>
      </div>

      {/* Date Range Picker Overlay */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-50">
          <DateRangePicker
            onChange={(range: { start: Date; end: Date }) => {
              setCustomRange(range)
              setShowDatePicker(false)
              filterData()
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </div>
      )}

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
            {table.getRowModel().rows.length ? (
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
