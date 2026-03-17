'use client'

import { useState } from 'react'
import { Plus, Minus } from '@/components/uikit/icons'

export default function FlashingForm() {
  const [specs, setSpecs] = useState([
    { quantity: 0, length: 0 }, // Editable
    { quantity: 0, length: 0 }, // Disabled preview row
  ])

  const handleAdd = () => {
    const current = specs.slice(0, -1)
    const newRow = { quantity: 0, length: 0 }
    setSpecs([...current, newRow, { ...newRow }]) // Always add a new row + keep disabled row
  }

  const handleRemove = (index: number) => {
    if (specs.length <= 2) return // Minimum two rows (1 editable + 1 disabled)
    const updated = specs.filter((_, i) => i !== index)
    setSpecs(updated)
  }

  return (
    <div className="space-y-6">
      {/* Identification */}
      <div>
        <h6 className="text-sm font-semibold text-heading">Identification</h6>
        <div className="flex gap-4 mt-2">
          <div>
            <label className="block text-xs font-medium text-label mb-1">
              Code <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="Code"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-label mb-1">Position</label>
            <input
              type="text"
              placeholder="Enter the position"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-subtle mt-1">ⓘ Alphanumeric and – only</p>
      </div>

      {/* Specifications */}
      <div>
        <h6 className="text-sm font-semibold text-heading">Specifications</h6>
        {specs.map((row, index) => {
          const isLast = index === specs.length - 1
          const isOnly = specs.length <= 2
          return (
            <div key={index} className="grid grid-cols-6 sm:grid-cols-8 gap-4 mt-2 items-end">
              {/* Quantity */}
              <div className="col-span-2">
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isLast ? 'text-label opacity-60' : 'text-label'
                  }`}
                >
                  Quantity <span className="text-attention-default-default">*</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isLast}
                  value={row.quantity}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^\d*$/.test(value)) {
                      const updated = [...specs]
                      updated[index].quantity = value === '' ? 0 : parseInt(value, 10)
                      setSpecs(updated)
                    }
                  }}
                  className={`w-full border rounded-xl px-3 py-2 text-sm transition ${
                    isLast
                      ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Length */}
              <div className="col-span-3 sm:col-span-4">
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isLast ? 'text-label opacity-60' : 'text-label'
                  }`}
                >
                  Length <span className="text-attention-default-default">*</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={isLast}
                    value={row.length}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d*$/.test(value)) {
                        const updated = [...specs]
                        updated[index].length = value === '' ? 0 : parseInt(value, 10)
                        setSpecs(updated)
                      }
                    }}
                    className={`w-full border rounded-xl px-3 py-2 text-sm transition ${
                      isLast
                        ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed'
                        : 'border-gray-300'
                    }`}
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                      isLast ? 'text-gray-400 opacity-60' : 'text-gray-500'
                    }`}
                  >
                    mm
                  </span>
                </div>
              </div>

              {/* Minus / Plus */}
              <div className="col-span-1">
                {isLast ? (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full rounded-xl border border-border-primary-subtle px-4 py-2 text-xl flex justify-center items-center"
                  >
                    <Plus />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={isOnly}
                    className={`w-full rounded-xl border border-border-primary-subtle px-4 py-2 text-xl flex justify-center items-center ${
                      isOnly || isLast
                        ? 'text-gray-400 border-border-primary-subtle opacity-60 cursor-not-allowed'
                        : 'border-gray-300'
                    }`}
                  >
                    <Minus />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
