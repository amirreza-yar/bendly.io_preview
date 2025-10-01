import RevenueChartCard from '@/components/admin/charts/revenue'
import OrdersChartCard from '@/components/admin/charts/revenue'
import CompletedWidget from '@/components/admin/widgets/completed'
import PendingWidget from '@/components/admin/widgets/pending'
import ReadyWidget from '@/components/admin/widgets/ready'
import ProductionWidget from '@/components/admin/widgets/production'

export default function AdminDashboardOverview() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <OrdersChartCard />
          <RevenueChartCard />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  )
}
