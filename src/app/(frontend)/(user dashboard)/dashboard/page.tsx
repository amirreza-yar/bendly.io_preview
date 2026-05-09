import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Plus, Settings } from "lucide-react";
import Link from "next/link";
import RecentTemplates, {
  RecentTemplatesLoading,
} from "@/components/dashboard/recent-templates";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
          Bendly
        </h6>

        <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />
        <Button
          variant="ghost"
          size="icon-lg"
          className="absolute right-1 top-1 text-primary-foreground hover:bg-transparent hover:text-primary-light"
          asChild
        >
          <Link href="/dashboard/setting">
            <Settings className="size-6" />
          </Link>
        </Button>

        <div className="flex flex-col gap-1 w-full absolute left-1/2 -translate-x-1/2 top-19 sm:top-24 text-primary-foreground text-center">
          <h5 className="overflow-hidden">Create Your Flashing Order</h5>
          <p className="caption-small">
            Create a new order or use a template to get started
          </p>
        </div>
      </div>
      <div className="fixed top-40 sm:top-50 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 sm:pt-6 pb-0! h-full [@media(min-height:700px)]:h-fit shadow-md">
          <div className="h-full gap-2 flex flex-col">
            <div className="flex flex-col gap-2 px-4 sm:px-6 shrink-0">
              <Button size="lg">
                <Plus />
                New Order
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard/library">
                  Use Templates
                  <ArrowRight />
                </Link>
              </Button>

              <div className="flex items-center justify-between caption-small pt-1 pb-1">
                Recent Templates
                <Button variant="link" size="xs" asChild>
                  <Link href="/dashboard/library">
                    View All
                    <ChevronRight />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <Suspense fallback={<RecentTemplatesLoading />}>
                <RecentTemplates />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
