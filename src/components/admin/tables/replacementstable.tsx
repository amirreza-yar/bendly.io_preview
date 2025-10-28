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
import { EyeIcon } from '@/components/uikit/icons'

export type OrderDetails = {
  RequestID: string
  OriginalOrder: string
  Customer: string
  Reason: string
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
    RequestID: 'Rec-5849453',
    OriginalOrder: '5849451',
    Customer: 'Ali Smith',
    Reason: 'Defective product',
    priority: 'Normal',
    status: 'CO',
  },
  {
    RequestID: 'Rec-9657475',
    OriginalOrder: '9657473',
    Customer: 'Joe Biden',
    Reason: 'Wrong item shipped',
    priority: 'High',
    status: 'RFP',
  },
  {
    RequestID: 'Rec-3144123',
    OriginalOrder: '3144121',
    Customer: 'Jane Doe',
    Reason: 'Quality issue',
    priority: 'Urgent',
    status: 'PE',
  },
  {
    RequestID: 'Rec-5638677',
    OriginalOrder: '5638675',
    Customer: 'Emma Wilson',
    Reason: 'Customer return',
    priority: 'Normal',
    status: 'RE',
  },
  {
    RequestID: 'Rec-5638787',
    OriginalOrder: '5638785',
    Customer: 'Sarah Wilson',
    Reason: 'Damaged in transit',
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

const priorityOptions = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'High', label: 'High' },
]

const priorityImportance: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const statusImportance: Record<string, number> = {
  pending: 4,
  'in progress': 3,
  completed: 2,
  cancelled: 1,
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
    accessorKey: 'RequestID',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-xs sm:text-sm"
      >
        Request ID <ArrowUpDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-2 sm:pl-4 text-xs sm:text-sm">{row.getValue('RequestID')}</div>
    ),
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue('RequestID')).includes(filterValue),
  },
  {
    accessorKey: 'OriginalOrder',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-xs sm:text-sm"
      >
        Original Order <ArrowUpDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-xs sm:text-sm">{row.getValue('OriginalOrder')}</div>,
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue('OriginalOrder')).includes(filterValue),
  },
  {
    accessorKey: 'Customer',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-xs sm:text-sm"
      >
        Customer <ArrowUpDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-xs sm:text-sm">{row.getValue('Customer')}</div>,
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue('Customer')).toLowerCase().includes(String(filterValue).toLowerCase()),
  },
  {
    accessorKey: 'Reason',
    header: () => <div className="text-xs sm:text-sm">Reason</div>,
    cell: ({ row }) => <div className="text-xs sm:text-sm">{row.getValue('Reason')}</div>,
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-xs sm:text-sm">Status</div>,
    cell: ({ row, table }) => {
      const handleStatusChange = (value: 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE') => {
        const updatedData = table.options.data.map((item) =>
          item.RequestID === row.original.RequestID ? { ...item, status: value } : item,
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
    header: () => <div className="text-xs sm:text-sm">Priority</div>,
    cell: ({ row }) => (
      <Badge
        text={row.getValue('priority')}
        variant={getPriorityVariant(row.getValue('priority'))}
        className="capitalize text-xs sm:text-sm"
      />
    ),
  },
  {
    accessorKey: 'Action',
    header: () => <div className="text-xs sm:text-sm">Action</div>,
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 pr-2 sm:pr-4"
          onClick={() => router.push(`/ff-admin/order/${row.original.RequestID}`)}
        >
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
      className="px-2 sm:px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  )
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, onCancel }) => {
  const [range, setRange] = React.useState<DateRange | undefined>()
  return (
    <div className="w-[90vw] max-w-md sm:max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm p-3 sm:p-4 flex flex-col gap-3">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        captionLayout="dropdown"
        className="rounded-md w-full"
      />
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-700 px-1 gap-2">
        {range?.from && range?.to ? (
          <p className="text-center sm:text-left">
            Selected: <strong>{range.from.toLocaleDateString()}</strong> →{' '}
            <strong>{range.to.toLocaleDateString()}</strong>
          </p>
        ) : range?.from ? (
          <p className="text-center sm:text-left">
            Start: <strong>{range.from.toLocaleDateString()}</strong>
          </p>
        ) : (
          <p className="text-center sm:text-left">Select a start and end date</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
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
            className="bg-[#3355FF] text-white hover:bg-[#2a44cc] text-xs sm:text-sm"
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

// Helper function to get filter display text
const getFilterDisplayText = (
  selectedItems: string[],
  options: { value: string; label: string }[],
) => {
  if (selectedItems.length === 0) return ''
  if (selectedItems.length === 1) {
    const selectedOption = options.find((opt) => opt.value === selectedItems[0])
    return selectedOption ? selectedOption.label : ''
  }
  const firstSelected = options.find((opt) => opt.value === selectedItems[0])
  return firstSelected
    ? `${firstSelected.label} & ${selectedItems.length - 1} more filter${selectedItems.length > 2 ? 's' : ''}`
    : ''
}

export function ReplacementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    Reason: true,
    status: true,
    priority: true,
    actions: true,
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [fetchedData, setFetchedData] = React.useState<OrderDetails[]>(data)
  const [selectedTime, setSelectedTime] = React.useState<string[]>(['all_time'])
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [customRange, setCustomRange] = React.useState<{ start: Date; end: Date } | null>(null)
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const router = useRouter()

  // Responsive column visibility
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnVisibility({
          RequestID: true,
          OriginalOrder: true,
          Customer: true,
          Reason: false,
          status: true,
          priority: false,
          actions: true,
        })
      } else if (window.innerWidth < 1024) {
        setColumnVisibility({
          RequestID: true,
          OriginalOrder: true,
          Customer: true,
          Reason: true,
          status: true,
          priority: true,
          actions: true,
        })
      } else {
        setColumnVisibility({
          RequestID: true,
          OriginalOrder: true,
          Customer: true,
          Reason: true,
          status: true,
          priority: true,
          actions: true,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filterData = React.useCallback(() => {
    let filteredData = data
    if (selectedTime.length > 0 && !selectedTime.includes('all_time')) {
      const today = new Date('2025-10-08')
      filteredData = filteredData.filter((item) => {
        return selectedTime.some((time) => {
          if (time === 'custom_range' && customRange) {
            return true
          }
          return true
        })
      })
    }
    if (selectedStatuses.length > 0) {
      filteredData = filteredData.filter((item) => selectedStatuses.includes(item.status))
    }
    if (selectedPriorities.length > 0) {
      filteredData = filteredData.filter((item) => selectedPriorities.includes(item.priority))
    }
    setFetchedData(filteredData)
  }, [selectedTime, selectedStatuses, selectedPriorities, customRange])

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
        String(row.original.RequestID).includes(search) ||
        String(row.original.OriginalOrder).includes(search)
      )
    },
    meta: { updateData: setFetchedData } as CustomTableMeta<OrderDetails>,
  })

  const timeFilterText = getFilterDisplayText(selectedTime, timeOptions)
  const statusFilterText = getFilterDisplayText(selectedStatuses, statusOptions)
  const priorityFilterText = getFilterDisplayText(selectedPriorities, priorityOptions)

  return (
    <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 my-4 sm:my-6">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:flex-wrap sm:items-center mb-4 sm:mb-6">
        <Input
          placeholder="Filter by customer, request id, or original order"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:w-auto sm:flex-1 min-w-[180px] max-w-[280px] text-xs sm:text-sm h-9 sm:h-10"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] md:w-[140px] h-9 sm:h-10 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm"
            >
              <span className="text-ellipsis overflow-hidden">
                {timeFilterText || 'Time Filter'}
              </span>
              <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] sm:w-[200px]">
            {timeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1 text-xs sm:text-sm"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] md:w-[140px] h-9 sm:h-10 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm"
            >
              <span className="text-ellipsis overflow-hidden">
                {statusFilterText || 'Statuses'}
              </span>
              <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] sm:w-[200px]">
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1 text-xs sm:text-sm"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] md:w-[140px] h-9 sm:h-10 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm"
            >
              <span className="text-ellipsis overflow-hidden">
                {priorityFilterText || 'Priorities'}
              </span>
              <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] sm:w-[200px]">
            {priorityOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize my-1 text-xs sm:text-sm"
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
          className="w-full sm:w-[80px] h-9 sm:h-10 bg-[#3355FF] text-white hover:bg-[#2a44cc] text-xs sm:text-sm"
        >
          Apply
        </Button>
      </div>
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-4">
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
      <div className="overflow-x-auto rounded-md border">
        <Table className="w-full min-w-[600px] sm:min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-2 sm:px-4 py-2 sm:py-3">
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
                  className="border-none h-12 sm:h-16"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 sm:px-4 py-2 sm:py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 sm:h-24 text-center text-xs sm:text-sm"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center mt-4 sm:mt-6">
        <PaginationDemo
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onNext={() => table.nextPage()}
          onPrevious={() => table.previousPage()}
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
        />
      </div>
    </div>
  )
}
