// components/Modal.tsx
import React from 'react'

import { XIcon } from './icons'

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

const EditModal = ({ onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Background Blur */}
      <div className="fixed inset-0 backdrop-blur-sm bg-overlay-white-backdrop" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full sm:-md p-6 shadow-xl border-t-1 border-t-border-dark bg-surface-card bottom-0">
        <div className="flex items-center justify-between mb-4">
          <h6 className="text-smd font-semibold text-heading">Choose Your Edit Option</h6>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onClose()
            }}
          >
            <XIcon />
          </button>
        </div>

        <div className="pt-xs pb-l">{children}</div>
      </div>
    </div>
  )
}

export { EditModal }
