export function getDayAbbrString(dateString: string | number | undefined): string | undefined {
  if (!dateString) return
  const d = new Date(dateString)
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return days[d.getDay()]
}

export function getDayMonthNumber(dateString: string | number | undefined): string | undefined {
  if (!dateString) return
  const d = new Date(dateString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export function getDayString(dateString: string | number | undefined): string | undefined {
  if (!dateString) return
  const d = new Date(dateString)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[d.getDay()]
}
