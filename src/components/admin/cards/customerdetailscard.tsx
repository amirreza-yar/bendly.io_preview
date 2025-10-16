'use client'

import { Pencil, Call2, Mail } from '@/components/uikit/icons'
import * as React from 'react'
import { AlertModal } from '@/components/uikit/alertModal'
import { useRouter } from 'next/navigation'

interface CustomerCardProps {
  data?: {
    name: string
    email: string
    phone: string
  }
}

export default function CustomerDetailsCard({ data }: CustomerCardProps) {
  const router = useRouter()

  const customerData = {
    name: 'Mike Oldfield',
    email: 'Mike@example.com',
    phone: '+610412364625',
  }

  const displayData = data || customerData

  const [open, setOpen] = React.useState(false)
  const [selectedReason, setSelectedReason] = React.useState('')

  const reasons = [
    { key: 'personalInfo', label: 'Customer requested profile update', route: '/update-profile' },
    { key: 'accountError', label: 'Data Correction', route: '/data-correction' },
    { key: 'securityUpdate', label: 'Other', route: '/security-update' },
  ]

  const handleAction = () => {
    const selected = reasons.find((r) => r.key === selectedReason)
    if (selected) {
      console.log('Navigating to:', selected.route)
      router.push(selected.route)
    }
    setOpen(false)
  }

  const handleCancel = () => setOpen(false)

  return (
    <>
      {/* Customer Card */}
      <div className="w-[357px] bg-white border rounded-lg h-100 flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between mx-6 mt-6">
          <h5 className="text-md">Customer Information</h5>
          <button onClick={() => setOpen(true)}>
            <Pencil />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex flex-col px-6 pt-5 space-y-2">
          <div className="flex justify-between">
            <p>Name</p>
            <p className="font-bold">{displayData.name}</p>
          </div>
          <div className="flex justify-between">
            <p>Email</p>
            <p className="font-bold">{displayData.email}</p>
          </div>
          <div className="flex justify-between">
            <p>Mobile Number</p>
            <p className="font-bold">{displayData.phone}</p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mx-6 mb-6 mt-8 space-y-5">
          <button className="border border-border-primary rounded-md flex w-full justify-center gap-2 text-primary text-sm py-3">
            <Call2 />
            Call
          </button>
          <button className="border border-border-primary rounded-md flex w-full justify-center gap-2 text-primary text-sm py-3">
            <Mail />
            Send Mail
          </button>
        </div>
      </div>

      {/* Modal */}
      <AlertModal
        title="Secure Data Change Request"
        description="Select the reason for this change from the list below. After you proceed, the system will send a verification code to the customer."
        alignmentVariant="right"
        cancelButtonText="Cancel"
        actionButtonText="Save & Send Code"
        actionButtonVariant="default"
        cancleButtonVariant="secondary"
        dismissible={true}
        onAction={handleAction}
        onCancle={handleCancel}
        onOpenChange={setOpen}
        open={open}
      >
        {/* Inline conditional rendering ensures options show inside popup visually */}
        {open && (
          <div className="mt-4 space-y-4">
            {reasons.map((reason) => (
              <label key={reason.key} className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={reason.key}
                  checked={selectedReason === reason.key}
                  onChange={() => setSelectedReason(reason.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-800">{reason.label}</span>
              </label>
            ))}
          </div>
        )}
      </AlertModal>
    </>
  )
}
