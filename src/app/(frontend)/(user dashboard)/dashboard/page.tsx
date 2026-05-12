import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  CirclePile,
  Clock,
  GalleryVerticalEnd,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import RecentTemplates, {
  RecentTemplatesLoading,
} from "@/components/dashboard/library/recent-templates";
import { Suspense } from "react";
import api from "@/lib/axios";
import { cookies } from "next/headers";
import { Flashing } from "@/types/api";
import { timeAgo } from "@/utilities/datetime";
import DiscardCartButton from "@/components/dashboard/discard-cart-button";

type FlashingWithDate = Flashing & { updated_at: string };

const onFetchCart: () => Promise<{
  flashings?: FlashingWithDate[];
  job_reference?: any;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/cart/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(error, error?.response?.data);

    return {};
  }
};
const onPostDiscardCart: () => Promise<{ ok: boolean }> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    await api.post(
      "/a/cart/discard-cart/",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export default async function HomePage() {
  // const router = useRouter()

  const cart = await onFetchCart();

  let leastEditTime: string | undefined = cart.flashings?.[0]?.updated_at;

  cart.flashings?.forEach((f) => {
    if (f.updated_at > (leastEditTime ?? 0)) {
      leastEditTime = f.updated_at;
    }
  });

  if ((cart.flashings?.length ?? 0) > 0) {
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
            <h5 className="overflow-hidden">Resume Your Order?</h5>
            <p className="caption-small">
              Your previous order is incomplete. Resume now
            </p>
          </div>
        </div>
        <div className="fixed top-40 sm:top-50 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
          <div className="bg-background rounded-lg px-6 sm:px-8 py-8 sm:py-10 h-fit shadow-md space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <CirclePile className="size-4 mb-0.5" />
              {cart.flashings?.[0].material_data.name}
              {" . "}
              {cart.flashings?.[0].material_data.label}
            </div>
            {cart.job_reference ? (
              <div className="flex items-start gap-3 text-sm">
                <GalleryVerticalEnd className="size-4 mt-0.5" />
                Order For
                <br />
                PRJ-{cart.job_reference.code}
                {" . "}
                {cart.job_reference.project_name}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <GalleryVerticalEnd className="size-4" />
                Not yet assigned to Project
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Clock className="size-4 mb-0.5" />
              Last Edited {timeAgo(leastEditTime ?? "")}
            </div>

            <div className="grid md:grid-cols-2 gap-3 pt-4">
              <Button size="lg" asChild>
                <Link href="/cart">Countinue Order</Link>
              </Button>
              <DiscardCartButton onDiscard={onPostDiscardCart} />
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

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
              <Button size="lg" asChild>
                <a href="/canvas">
                  <Plus />
                  New Order
                </a>
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
