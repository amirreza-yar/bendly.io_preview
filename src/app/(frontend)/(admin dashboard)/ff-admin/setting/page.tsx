import { Edit, ProfileNav } from '@/components/uikit/icons'

export default function AdminDashboardSettings() {
  return (
    <>
      <div className="grid grid-cols-5 p-6 gap-6 bg-[#F1F5F9]">
        <div className="col-span-1 h-200 bg-white flex flex-col items-center border border-border-default rounded-lg pt-16">
          <div className="h-25 w-25 rounded-full bg-gray-100 flex items-center justify-center relative">
            <ProfileNav className="size-15 text-gray-500" />
            <div className="absolute top-1 right-1 shadow-sm rounded-full bg-white p-1 border border-border-dark">
              <Edit className="size-4" />
            </div>
          </div>
          <p className=" font-bold">Amirreza Yarahmadi</p>
        </div>
        <div className="col-span-4 h-200 bg-blue-200"></div>
      </div>
    </>
  )
}
