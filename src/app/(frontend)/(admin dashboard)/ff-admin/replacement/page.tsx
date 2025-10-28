import { ReplacementTable } from '@/components/admin/tables/replacementstable'

export default function AdminDashboardReplacements() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F1F5F9]">
        <div className="mt-8 bg-white border rounded-lg">
          <ReplacementTable />
        </div>
      </div>
    </>
  )
}
