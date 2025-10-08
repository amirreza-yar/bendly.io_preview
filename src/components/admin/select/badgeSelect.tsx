import { BadgeSelect } from '@/components/uikit/select'
import { useEffect, useState } from 'react'

export function CurrentStatusSelect({
  status,
  ...props
}: {
  status: 'PE' | 'AP' | 'IP' | 'CM' | 'RO'
  defaultValue?: string
}) {
  const [statusBadgeColor, setStatusBadgeColor] = useState<
    'green' | 'orange' | 'red' | 'blue' | 'gray'
  >()

  const statusSelectItems: {
    value: string
    label: string
  }[] = [
    {
      value: 'PE',
      label: 'Pending',
    },
    {
      value: 'AP',
      label: 'Approved',
    },
    {
      value: 'IP',
      label: 'In Production',
    },
    {
      value: 'CM',
      label: 'Completed',
    },
    {
      value: 'RO',
      label: 'Reopened',
    },
  ]

  useEffect(() => {
    switch (status) {
      case 'PE':
        setStatusBadgeColor('orange')
        break
      case 'AP':
        setStatusBadgeColor('green')
        break
      case 'IP':
        setStatusBadgeColor('orange')
        break
      case 'CM':
        setStatusBadgeColor('green')
        break
      case 'RO':
        setStatusBadgeColor('gray')
        break
      default:
        setStatusBadgeColor('green')
    }
  }, [status])

  return (
    <BadgeSelect
      items={statusSelectItems}
      onValueChange={(val) => {
        switch (val) {
          case 'PE':
            setStatusBadgeColor('orange')
            break
          case 'AP':
            setStatusBadgeColor('green')
            break
          case 'IP':
            setStatusBadgeColor('orange')
            break
          case 'CM':
            setStatusBadgeColor('green')
            break
          case 'RO':
            setStatusBadgeColor('gray')
            break
          default:
            setStatusBadgeColor('green')
        }
      }}
      defaultValue={status}
      variant={statusBadgeColor}
      {...props}
    />
  )
}

export function PrioritySelect({
  status,
  ...props
}: {
  status: 'HI' | 'NO' | 'UG'
  defaultValue?: string
}) {
  const [statusBadgeColor, setStatusBadgeColor] = useState<
    'green' | 'orange' | 'red' | 'blue' | 'gray'
  >()

  const statusSelectItems: {
    value: string
    label: string
  }[] = [
    {
      value: 'NO',
      label: 'Normal',
    },
    {
      value: 'HI',
      label: 'Hight',
    },
    {
      value: 'UG',
      label: 'Urgent',
    },
  ]

  useEffect(() => {
    switch (status) {
      case 'NO':
        setStatusBadgeColor('green')
        break
      case 'HI':
        setStatusBadgeColor('blue')
        break
      case 'UG':
        setStatusBadgeColor('red')
        break
      default:
        setStatusBadgeColor('green')
    }
  }, [status])

  return (
    <BadgeSelect
      items={statusSelectItems}
      onValueChange={(val) => {
        switch (val) {
          case 'NO':
            setStatusBadgeColor('green')
            break
          case 'HI':
            setStatusBadgeColor('blue')
            break
          case 'UG':
            setStatusBadgeColor('red')
            break
          default:
            setStatusBadgeColor('green')
        }
      }}
      defaultValue={status}
      variant={statusBadgeColor}
      {...props}
    />
  )
}
