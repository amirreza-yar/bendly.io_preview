import RevenueChartCard from '@/components/admin/charts/revenue'
import OrdersChartCard from '@/components/admin/charts/bar'
import CompletedWidget from '@/components/admin/widgets/completed'
import PendingWidget from '@/components/admin/widgets/pending'
import ReadyWidget from '@/components/admin/widgets/ready'
import ProductionWidget from '@/components/admin/widgets/production'
import RecentOrderTable from '@/components/admin/tables/recentorder'
import RecentActivity from '@/components/admin/cards/recentactivity'
import ReplacementRequestTable from '@/components/admin/tables/recplacementrequest'

export default function AdminDashboardOverview() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-8 p-8 bg-[#F1F5F9]">
        <div className="grid auto-rows-min gap-8 md:grid-cols-4">
          <PendingWidget number={5} />
          <ProductionWidget number={4} />
          <ReadyWidget number={10} />
          <CompletedWidget number={8} />
        </div>
        <div className="w-full h-[498px] border rounded-lg border-border-default bg-white">
          <RecentOrderTable />
        </div>
        <div className="w-full flex gap-5 flex-col md:flex-row">
          <div className=" border rounded-lg border-border-default bg-white  ">
            <RecentActivity />
          </div>
          <div className="w-full border rounded-lg border-border-default bg-white">
            <ReplacementRequestTable />
          </div>
        </div>
        <div className="grid auto-rows-min gap-8 md:grid-cols-2">
          <OrdersChartCard totalorders={1543} changes={4.2} />
          <RevenueChartCard totalrevenue={4513.0} changes={5.7} />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  )
}
