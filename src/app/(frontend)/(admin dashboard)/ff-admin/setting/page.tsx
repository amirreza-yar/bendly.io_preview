import RecentActivity from '@/components/admin/cards/recentactivity'
import { Button } from '@/components/uikit/buttons/button'
import { Edit, ProfileNav } from '@/components/uikit/icons'
import Link from 'next/link'

export default function AdminDashboardSettings() {
  return (
    <>
      <div className="grid grid-cols-5 p-6 gap-6 bg-[#F1F5F9] h-full relative">
        <div className="2xl:col-span-1 lg:col-span-2 md:col-span-3 col-span-5">
          <div className="h-fit sticky top-26">
            <div className="flex flex-col gap-6">
              <div className="bg-white flex flex-col gap-4 items-center border border-border-default rounded-lg pt-16 pb-10">
                <div className="h-25 w-25 mb-5 rounded-full bg-gray-100 flex items-center justify-center relative">
                  <ProfileNav className="size-15 text-gray-400" />
                  <div className="absolute top-1 right-1 shadow-sm rounded-full bg-white p-1 border border-border-dark">
                    <Edit className="size-4" />
                  </div>
                </div>
                <div className="flex flex-col items-start w-full gap-1 px-8">
                  <p className="label-small text-gray-600">Full name</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="">Amirreza Yarahmadi</p>
                    <Edit className="size-4 mb-1" />
                  </div>
                </div>
                <div className="flex flex-col items-start w-full gap-1 px-8">
                  <p className="label-small text-gray-600">Email</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="">yar.amirreza@gmail.com</p>
                    <Edit className="size-4 mb-1" />
                  </div>
                </div>
                <div className="flex flex-col items-start w-full gap-1 px-8">
                  <p className="label-small text-gray-600">Phone number</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="">+619876543210</p>
                    <Edit className="size-4 mb-1" />
                  </div>
                </div>
                <div className="flex flex-col items-start w-full gap-1 px-8">
                  <p className="label-small text-gray-600">Password</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="">•••••••</p>
                    <Edit className="size-4 mb-1" />
                  </div>
                </div>
                <div className="w-full px-8 pt-6">
                  <Button
                    variant="secondary"
                    className="border-red-500 text-red-500 hover:bg-red-50 w-full"
                  >
                    Logout
                  </Button>
                </div>
              </div>
              <div className="grid gap-5 border rounded-lg border-border-default bg-white py-4 px-6">
                <h5 className="text-md pt-4">Recent Activity</h5>
                <div className="flex flex-col">
                  <p className="body-regular">Order 12345678 moved to Production</p>
                  <p className="text-subtitle label-regular">2 minutes ago</p>
                </div>
                <div className="flex flex-col">
                  <p className="body-regular">Order 65987445 was Approved</p>
                  <p className="text-subtitle label-regular">20 minutes ago</p>
                </div>
                <div className="flex flex-col">
                  <p className="body-regular">Order 45687952 was Completed</p>
                  <p className="text-subtitle label-regular">10 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="2xl:col-span-4 lg:col-span-3 md:col-span-2 col-span-5 p-8 bg-white flex flex-col gap-10 border border-border-default rounded-lg">
          <div>
            <h5 className="text-md">Dashboard settings</h5>
            <p className="pb-6 pt-2 label-regular text-subtitle">
              The settings relevant to this dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Add / edit admins</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Observe, add or edit admins.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Add / edit admin roles</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Add or edit admin roles.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Accounting</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Observe or export transactions made in application.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Dashhboard logs</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Observe or export all dashboard logs including activities, transactions or changes
                  made by admins or auditions.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Audit trail</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Observe or export all audition logs.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>User verifications</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Change the user verification methods (by phone number, email or both)
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Dashboard and application info</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Version, title and description.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-md">Factory settings</h5>
            <p className="pb-6 pt-2 label-regular text-subtitle">
              The settings relevant to factory or manufacture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ff-admin/setting/material"
                className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2"
              >
                <h6>Add / Edit materials</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Add new materials with their colors or thicknesses. Also you can edit the
                  previously added materials, colors or thicknesses. Change the price of materials
                  based on flashing dimensions, squish folds or wight.
                </p>
              </Link>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Change delivery methods and cost</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Add or change delivery types. Edit different delivery type's cost based on
                  conditions.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Set factory days off</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Set or change factory holidays, closure days or days off. On these days user still
                  can submit orders but factory will be able to produce or deliver their order after
                  factory days off.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-md">Application settings</h5>
            <p className="pb-6 pt-2 label-regular text-subtitle">
              The settings relevant to factory or manufacture.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Edit basic application settings</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Edit application name, logo or description.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Edit basic canvas settings</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Edit units used, canvas grid size or tools.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Application terms and conditions</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Edit terms and conditions or privacy / policy for clients which uses the app. This
                  will be shown in application menu.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Add / edit payment methods</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Add or change payment methods used in application. You can disable or enable
                  specific methods to pay.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>Users authentication type</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Change the user authentication types.
                </p>
              </div>
              <div className="w-70 h-35 border border-border-default rounded-md flex flex-col p-4 gap-2">
                <h6>User verifications</h6>
                <p className="caption-regular text-gray-600 line-clamp-4">
                  Change the user verification methods (by phone number, email or both)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
