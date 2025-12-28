"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/uikit/carousel";
import { Button } from "@/components/uikit/buttons/button";
import JobRefCard from "@/components/uikit/cards/jobRefCard";
import DividerWithText from "@/components/uikit/dividerWithText";
import {
  ChevronRight,
  Edit,
  HomeMenu,
  Info,
  NewOrder,
  SquareClock,
} from "@/components/uikit/icons";
import Link from "next/link";
import BottomNav from "@/components/dashboard/bottomNav";
import { useEffect, useRef } from "react";
import { useGETAllJobRefs } from "@/lib/db/helpers/jobRefHelpers";
import {
  deleteAllDraftFlashings,
  initNewFlashing,
} from "@/lib/db/helpers/flashingHelpers";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import FlashingSVG from "@/components/utils/flashingSVG";
import { Hash, PencilRuler } from "lucide-react";
import { timeAgo } from "@/utilities/datetime";

export default function Page() {
  const router = useRouter();
  const { data: jobReferences } = useSWR("/a/job-ref/", fetcher);

  const { data: cart } = useSWR("/a/cart/", fetcher);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // console.log('sw registered!')
          // console.log(reg)
        })
        .catch((error) => {
          // console.log('sw reg failed!')
          // console.log(error)
        });
    }
  }, []);

  const newFlashing = () => {
    router.push(`/f/material`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white">
        <div className="flex items-center justify-center h-full">
          <h6 className="text-heading">Bendly.io</h6>
        </div>
        <Link href="/dashboard/menu" className="absolute right-4">
          <HomeMenu />
        </Link>
      </header>
      <ContentWrapper className="h-full flex flex-col items-center justify-center w-full mx-auto max-w-100">
        {cart && cart.flashings[0] ? (
          <div className="flex flex-col gap-3 border-1 border-primary/70 rounded-md w-full p-4">
            <h5>Resume Your Order</h5>

            <div className="flex items-center gap-2 label-small">
              <SquareClock className="size-4" />
              Last Edited {timeAgo(cart.flashings[0].updated_at)}
            </div>

            <div className="flex items-center gap-2 label-small">
              <Hash className="size-4" strokeWidth={1.5} />
              Have {cart.flashings.length} Flashing
            </div>

            <div className="grid grid-cols-2 p-3 rounded-xs border border-border-default bg-gray-50 mx-2 mt-1 mb-3">
              <FlashingSVG
                flashing={cart.flashings[0]}
                className="pl-2 h-12"
                path3DOffsetCoeff={0.8}
              />
              <div className="grid gap-1">
                <PencilRuler
                  strokeWidth={1}
                  className="size-5 justify-self-end absolute"
                />
                <p className="caption-small">
                  Total Grith: {cart.flashings[0].total_girth.toFixed(0)} mm
                </p>
                <p className="caption-small">
                  Tapered: {cart.flashings[0].tapered ? "Yes" : "No"}
                </p>
                <p className="caption-small">
                  Material: {cart.flashings[0].material_data.name}
                </p>
              </div>
            </div>

            <Button onClick={() => router.replace("/cart")}>
              Resume Order
            </Button>

            <Button variant="secondary" onClick={() => router.replace("/cart")}>
              Discard
            </Button>
          </div>
        ) : (
          <>
            <p className="label-small pb-2">
              Start a new order from scratch and add project details later
            </p>
            <Button
              className="w-full md:max-w-[500px] lg:max-w-150"
              onClick={newFlashing}
            >
              <span>New Order</span>
              <NewOrder />
            </Button>
            <div className="flex pt-4 gap-1 [&_svg]:size-3 [&_svg]:mt-[2px] caption-small text-body">
              <Info />
              <p>Each Job Reference can include multiple delivery addresses</p>
            </div>

            {jobReferences && jobReferences.results.length > 0 && (
              <>
                <DividerWithText text="OR" className="py-8" />

                <p className="label-small">
                  Continue with an existing project and create a new order for
                  it
                </p>

                <div className="flex justify-between items-center w-full py-4">
                  <h6>Recent Job Reference</h6>
                  <Link
                    href="/dashboard/j"
                    className="flex items-center [&_svg]:size-5 gap-2 text-sm/[17px] font-semibold text-primary"
                  >
                    <span>View All</span>
                    <ChevronRight />
                  </Link>
                </div>

                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {jobReferences.results.slice(0, 5).map((item, index) => (
                      <CarouselItem key={index} className="pt-1">
                        <Link href={`/dashboard/j/${item.id}`} key={index}>
                          <JobRefCard
                            jobRefrenceCode={item.code}
                            jobRefrenceText={item.project_name}
                            locationName={
                              item.addresses?.[0]?.title || "No address"
                            }
                            locationAddress={item.addresses[0].full_address}
                          />
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </>
            )}
          </>
        )}
      </ContentWrapper>
      <BottomNav />
    </>
  );
}
