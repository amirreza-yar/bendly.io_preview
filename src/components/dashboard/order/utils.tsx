import { Flashing } from '@/types/orders/orderType'
import { RequestPiece } from '@/types/orders/requestType'

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getTotalQuantity(flashing: Flashing): number {
  const specQty = flashing?.sepcifications.reduce(
    (sum: number, spec: any) => sum + spec.quantity,
    0,
  )
  return specQty
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return `${formattedDate}   |  ${formattedTime}`
}

export function formatDateWithDay(input: string): string {
  const date = new Date(input)

  if (isNaN(date.getTime())) {
    return 'Invalid date format. Use YYYY-MM-DD.'
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed

  const weekday = weekdays[date.getDay()]

  return `${weekday} - ${day}/${month}`
}

export function groupByFlashing(requestPieces: RequestPiece[]): Flashing[] {
  const grouped: Record<string, Flashing> = {}

  for (const piece of requestPieces) {
    const { flashingId, material, color, thickness, totalGirth, pieceId, quantity, length, cost } =
      piece

    if (!grouped[flashingId]) {
      grouped[flashingId] = {
        flashingId,
        material,
        color,
        thickness,
        totalGirth,
        code: 'FL-A1', // default or fetched value
        position: 'A1',
        crushfold: false,
        tapered: false,
        sepcifications: [],
      }
    }

    grouped[flashingId].sepcifications.push({
      pieceId,
      quantity,
      length,
      cost,
    })
  }

  return Object.values(grouped)
}
