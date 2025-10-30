import MaterialsTable from '@/components/admin/tables/materials'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/uikit/breadcrumb'
import { GearSetting } from '@/components/uikit/icons'
import Link from 'next/link'

export default function MaterialsPage() {
  return (
    <div className="bg-[#F1F5F9] h-full relative p-6">
      <Breadcrumb className="pb-6">
        <BreadcrumbList className="">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/ff-admin/setting">
                <GearSetting className="size-5 text-primary" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="label-regular">
            <BreadcrumbPage>Materials</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-8 bg-white flex flex-col gap-10 border border-border-default rounded-lg">
        <MaterialsTable />
      </div>
    </div>
  )
}
