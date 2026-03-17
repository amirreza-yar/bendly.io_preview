'use client'

import React from 'react'
import { ViewToggle } from '@/components/uikit/viewToggle'
import { FlashingPreview3D, FlashingPreview } from '@/components/uikit/tempPreview'
import { EditModal } from '@/components/uikit/editModal'
import { DeleteModal } from '@/components/uikit/deleteFlashingModal'
import { Trash, Pencil } from '@/components/uikit/icons'

const PreviewCard = ({ data = {} }) => {
  const modes = ['2D', '3D'] as const
  const [view, setView] = React.useState<(typeof modes)[number]>('3D')
  const [openEdit, setOpenEdit] = React.useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 w-fit">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">View</span>
          <ViewToggle modes={modes} view={view} onChange={(newView) => setView(newView)} />
        </div>
        {/* Trash and Pencil icons (placeholder) */}
        <div className="flex gap-6">
          <DeleteModal
            alignmentVariant="right"
            onOpenChange={() => {}}
            onAction={() => {}}
            dismissible={true}
            cancelButtonText="No"
            actionButtonText="Yes"
            title="Delete Flashing?"
            description={`Are you sure you want to delete this Flashing? This action cannot be undone.`}
          >
            <div onClick={() => {}}>
              <Trash />
            </div>
          </DeleteModal>
          <div onClick={() => setOpenEdit(true)}>
            <Pencil />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center pt-6 space-y-4">
        <div className="border-b-1 border-b-border pb-xs">
          {view === '3D' ? (
            <FlashingPreview3D height="155" width="251" />
          ) : (
            <FlashingPreview height="155" width="251" />
          )}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        <InfoCard items={[{ label: 'Total Girth', value: '800 mm' }]} />
        <InfoCard items={[{ label: 'Taperd', value: 'No' }]} />
        <InfoCard
          items={[
            { label: 'Material', value: 'Steel' },
            { label: 'Color', value: 'Steel' },
            { label: 'Thickness', value: '1mm' },
          ]}
        />
        <InfoCard
          items={[
            { label: 'Crush Fold', value: 'Yes' },
            { label: 'Type', value: 'Crush' },
          ]}
        />
      </div>
      {openEdit && (
        <EditModal onClose={() => setOpenEdit(false)}>
          <div className="w-full flex items-center gap-4 px-4 py-3 border-b-1 border-b-border-seprator">
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.2495 21.095C21.6637 21.095 21.9995 20.7592 21.9995 20.345C21.9995 19.9308 21.6637 19.595 21.2495 19.595V21.095ZM13.3955 3.18964L12.8652 2.6593L12.8652 2.65931L13.3955 3.18964ZM16.7019 3.18964L17.2322 2.65931L17.2322 2.6593L16.7019 3.18964ZM17.804 4.29174L17.2736 4.82207L17.2737 4.82208L17.804 4.29174ZM17.804 7.59805L17.2737 7.06772L17.2736 7.06772L17.804 7.59805ZM11.1994 14.2026L10.6691 13.6722L10.6691 13.6723L11.1994 14.2026ZM10.5178 14.536L10.6109 15.2802L10.6109 15.2802L10.5178 14.536ZM6.89404 14.989L6.987 15.7332L6.98707 15.7332L6.89404 14.989ZM6.00467 14.0995L5.26047 14.0065L5.26046 14.0065L6.00467 14.0995ZM6.45765 10.4758L7.20186 10.5688L7.20186 10.5688L6.45765 10.4758ZM6.791 9.79419L6.26067 9.26386L6.26063 9.26391L6.791 9.79419ZM21.2495 20.345V19.595H7.02977V20.345V21.095H21.2495V20.345ZM3.75977 20.345H3.00977C3.00977 21.6622 4.07757 22.73 5.39477 22.73V21.98V21.23C4.90599 21.23 4.50977 20.8338 4.50977 20.345H3.75977ZM5.39477 21.98V22.73C6.71195 22.73 7.77977 21.6622 7.77977 20.345H7.02977H6.27977C6.27977 20.8338 5.88355 21.23 5.39477 21.23V21.98ZM7.02977 20.345H7.77977C7.77977 19.0278 6.71197 17.96 5.39477 17.96V18.71V19.46C5.88354 19.46 6.27977 19.8563 6.27977 20.345H7.02977ZM5.39477 18.71V17.96C4.07757 17.96 3.00977 19.0278 3.00977 20.345H3.75977H4.50977C4.50977 19.8562 4.90599 19.46 5.39477 19.46V18.71ZM17.035 8.27628L17.5653 7.74595L13.2884 3.469L12.7581 3.99933L12.2277 4.52966L16.5047 8.80661L17.035 8.27628ZM13.3955 3.18964L13.9258 3.71998C14.546 3.09985 15.5514 3.09985 16.1716 3.71998L16.7019 3.18964L17.2322 2.6593C16.0263 1.45341 14.0711 1.45341 12.8652 2.6593L13.3955 3.18964ZM16.7019 3.18964L16.1715 3.71997L17.2736 4.82207L17.804 4.29174L18.3343 3.76141L17.2322 2.65931L16.7019 3.18964ZM17.804 4.29174L17.2737 4.82208C17.8938 5.4422 17.8938 6.4476 17.2737 7.06772L17.804 7.59805L18.3343 8.12839C19.5402 6.92249 19.5402 4.96731 18.3343 3.76141L17.804 4.29174ZM17.804 7.59805L17.2736 7.06772L10.6691 13.6722L11.1994 14.2026L11.7298 14.7329L18.3343 8.12839L17.804 7.59805ZM11.1994 14.2026L10.6691 13.6723C10.6032 13.7381 10.5173 13.7802 10.4247 13.7918L10.5178 14.536L10.6109 15.2802C11.0343 15.2272 11.428 15.0347 11.7298 14.7329L11.1994 14.2026ZM10.5178 14.536L10.4248 13.7917L6.80101 14.2448L6.89404 14.989L6.98707 15.7332L10.6109 15.2802L10.5178 14.536ZM6.89404 14.989L6.80108 14.2447C6.78677 14.2465 6.77243 14.2416 6.76223 14.2314L6.23187 14.7617L5.70152 15.292C6.03901 15.6295 6.51341 15.7923 6.987 15.7332L6.89404 14.989ZM6.23187 14.7617L6.76223 14.2314C6.75199 14.2212 6.74709 14.2069 6.74888 14.1926L6.00467 14.0995L5.26046 14.0065C5.20127 14.4802 5.36406 14.9545 5.70152 15.292L6.23187 14.7617ZM6.00467 14.0995L6.74888 14.1926L7.20186 10.5688L6.45765 10.4758L5.71345 10.3827L5.26047 14.0065L6.00467 14.0995ZM6.45765 10.4758L7.20186 10.5688C7.21341 10.4764 7.25543 10.3904 7.32138 10.3245L6.791 9.79419L6.26063 9.26391C5.95896 9.56562 5.76637 9.95926 5.71344 10.3828L6.45765 10.4758ZM6.791 9.79419L7.32133 10.3245L13.9259 3.71997L13.3955 3.18964L12.8652 2.65931L6.26067 9.26386L6.791 9.79419Z"
                fill="#262626"
              />
            </svg>

            <span className="caption-reqular label text-xsm font-semibold">Edit drawing</span>
          </div>

          <div className="w-full flex items-center gap-4 px-4 py-3 border-b-1 border-b-border-seprator">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.7158 18.8271L16.411 20.8609C15.7912 21.1537 15.0333 20.9821 14.7318 20.3664C13.8655 18.597 13.8704 16.4083 14.7323 14.6376C15.0332 14.0193 15.7933 13.8454 16.415 14.139L20.7142 16.1697C21.7562 16.7486 21.7572 18.2469 20.7158 18.8271Z"
                stroke="#262626"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 17.5L13.9233 17.499"
                stroke="#262626"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M4.28044 8.82709L8.58525 10.8609C9.20505 11.1537 9.96301 10.9821 10.2644 10.3664C11.1307 8.59704 11.1258 6.40831 10.264 4.6376C9.96304 4.01935 9.20299 3.84538 8.58125 4.13904L4.28209 6.16967C3.24005 6.74858 3.23912 8.24688 4.28044 8.82709Z"
                stroke="#262626"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.9995 7.49902H11.0723"
                stroke="#262626"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <span className="caption-reqular label text-xsm font-semibold">Edit color side</span>
          </div>
        </EditModal>
      )}
    </div>
  )
}

type InfoCardProps = {
  items: { label: string; value: string }[]
}

const InfoCard = ({ items }: InfoCardProps) => (
  <div className="rounded-md border-1 border-border px-3 py-2 space-y-1 text-sm">
    {items.map(({ label, value }, i) => (
      <div key={i} className="flex justify-between gap-4">
        <span className="font-medium">{label}:</span>
        <span className="text-right">{value}</span>
      </div>
    ))}
  </div>
)

export default PreviewCard
