"use client";
import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import { Header } from "@/components/dashboard/header";
import {
  DeleteFlashingModalOnOrderReview,
  NewOrderCard,
} from "@/components/dashboard/order/cards";
import { Button } from "@/components/uikit/buttons/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/uikit/carousel";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { NoFlashingSVG } from "@/components/dashboard/order/svgs";
import useSWR from "swr";
import api, { fetcher } from "@/lib/axios";
import { Download, Edit, Remove } from "@/components/uikit/icons";
import FlashingSVG from "@/components/utils/flashingSVG";

export default function OrderReviewPage() {
  const { orderId }: { orderId: string } = useParams();

  const router = useRouter();

  const { data: cart, error, isLoading, mutate } = useSWR("/a/cart/", fetcher);

  const onDeleteFlashing = async (flashingId: string) => {
    try {
      await api.delete(`/a/flashing/${flashingId}/`);
      mutate();
      toast("Flashing removed from order");
    } catch (error: any) {
      toast("Something broke, probably not your fault.");
    }
  };

  const onSaveFlashing = (flashingId: string) => {
    // TODO Flashing PDF download function here
  };

  const onAddNewFlashing = () => {
    router.replace("/f/material");
  };

  const onGoHome = async () => {
    // TODO Here the cart should be deleted
    router.push("/dashboard");
  };

  const onProceedOrder = () => {
    router.push(`/cart/fulfill`);
  };

  return (
    <>
      {(cart?.flashings?.length ?? 0) > 0 ? (
        <>
          <Header title="Order Review" />
          <ContentWrapper className="pt-14 pb-24 bg-gray-100">
            <div className="">
              <Carousel
                opts={{
                  align: "start",
                }}
                orientation="vertical"
                className=""
              >
                <CarouselContent className="h-[calc(100vh-130px)] grid md:grid-cols-2">
                  {cart?.flashings?.map((flash: any) => (
                    <CarouselItem key={flash.id} className="last:mb-4">
                      {/* <NewOrderCard
                        flashing={flash}
                        onDeleteFlashing={onDeleteFlashing}
                        onSaveFlashing={onSaveFlashing}
                        orderId={orderId}
                      /> */}

                      <div className="grid gap-2 bg-white p-3 rounded-xs border border-border-default">
                        <button
                          onClick={() =>
                            router.replace(`/f/canvas?flashingId=${flash.id}`)
                          }
                          className="grid grid-cols-2 p-3 rounded-xs border border-border-default bg-gray-50"
                        >
                          <FlashingSVG
                            flashing={flash}
                            className="pl-2 h-18"
                            path3DOffsetCoeff={0.8}
                          />
                          <div className="grid gap-1">
                            <Edit className="size-5 justify-self-end" />
                            <p className="caption-small">
                              Total Grith: {flash.total_girth.toFixed(0)} mm
                            </p>
                            <p className="caption-small">
                              Tapered: {flash.tapered ? "Yes" : "No"}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() =>
                            router.replace(`/f/material?flashingId=${flash.id}`)
                          }
                          className="flex justify-between items-start p-3 rounded-xs border border-border-default bg-gray-50"
                        >
                          <div className="grid gap-2">
                            <p className="caption-small">
                              Material: {flash.material_data.name}
                            </p>
                            <p className="caption-small">
                              {flash.material_data.type === "color"
                                ? `Color: ${flash.material_data.label}`
                                : `Thickness: ${flash.material_data.label} mm`}
                            </p>
                          </div>
                          <Edit className="justify-self-end size-5 mb-4" />
                        </button>
                        <button
                          onClick={() =>
                            router.replace(`/f/details?flashingId=${flash.id}`)
                          }
                          className="grid gap-4 p-3 rounded-xs border border-border-default bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="grid gap-2">
                              <p className="caption-small">
                                Code:{" "}
                                <span className="label-regular">
                                  {flash.code}
                                </span>
                              </p>
                              <p className="caption-small">
                                Position:
                                {flash.position
                                  ? flash.position
                                  : "Not provided"}
                              </p>
                            </div>
                            <Edit className="justify-self-end size-5 mb-4" />
                          </div>
                          <div className="flex justify-between pr-11">
                            <div className="grid gap-2">
                              <p className="label-regular border-b border-gray-300 pb-1 pr-2">
                                Quantity
                              </p>
                              {flash?.specifications?.map(
                                (spec: any, index: number) => (
                                  <p key={index} className="caption-small">
                                    {spec.quantity} pcs
                                  </p>
                                )
                              )}
                            </div>
                            <div className="grid gap-2 pr-6">
                              <p className="label-regular border-b border-gray-300 pb-1 pr-2">
                                Length
                              </p>
                              {flash?.specifications?.map(
                                (spec: any, index: number) => (
                                  <p key={index} className="caption-small">
                                    {spec.length} mm
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        </button>
                        <div className="flex justify-end items-center py-2">
                          <DeleteFlashingModalOnOrderReview
                            deleteFlashing={() => onDeleteFlashing(flash.id)}
                          >
                            <div className="flex label-regular items-center gap-2 px-4">
                              Delete
                              <Remove className="size-5" />
                            </div>
                          </DeleteFlashingModalOnOrderReview>
                          <div className="flex label-regular items-center gap-2 pl-4 pr-2 opacity-40">
                            PDF
                            <Download className="size-5" />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </ContentWrapper>
          <Footer>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="secondary"
                className=""
                onClick={onAddNewFlashing}
              >
                Add New Flashing
              </Button>
              <Button onClick={onProceedOrder}>Proceed Order</Button>
            </div>
          </Footer>
        </>
      ) : (
        <>
          <div className="h-full flex flex-col gap-4 items-center justify-center">
            <NoFlashingSVG />
            <p className="subtitle-large">
              There are no flashings for this order
            </p>
            <Button
              className="w-44"
              variant="default"
              onClick={onAddNewFlashing}
            >
              Add New Flashing
            </Button>
            <Button className="w-44" variant="secondary" onClick={onGoHome}>
              Go Home
            </Button>
          </div>
        </>
      )}
    </>
  );
}
