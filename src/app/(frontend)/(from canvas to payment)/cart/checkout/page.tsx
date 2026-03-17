"use client";

import { ContentWrapper } from "@/components/dashboard/contentWrapper";
import { Footer } from "@/components/dashboard/footer";
import { Header } from "@/components/dashboard/header";
import { NewOrderSummaryAccordion } from "@/components/order/accordion";
import { Button } from "@/components/uikit/buttons/button";
import {
  Delivery,
  MapMarker,
  ProfileNav,
  WareHouse,
} from "@/components/uikit/icons";
import { Separator } from "@/components/uikit/separator";
import api, { fetcher } from "@/lib/axios";
import { getDayMonthNumber, getDayString } from "@/utilities/datetime";
import { cn } from "@/utilities/ui";
import { Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CheckOutPage() {
  const { data: cart } = useSWR("/a/cart/", fetcher, {
    onError: notFound,
  });

  const [isPayLoading, setIsPayLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleOnPay = async () => {
    setIsPayLoading(true);
    try {
      const res = await api.post("/a/cart/pay/");
      setIsPayLoading(false);
      router.push(res.data.pay_url);
      // eslint-disable-next-line
    } catch (error: any) {
      setIsPayLoading(false);
    }
  };

  return (
    <>
      <Header title="Checkout" returnHref="/cart/fulfill/" />
      <ContentWrapper className="bg-surface-page-body px-0 pt-14 pb-23">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 bg-white px-4  py-4">
            {cart?.delivery_type === "delivery" ? (
              <>
                <p className="label-regular pb-1">Deliver to</p>
                <div className="flex items-start gap-2">
                  <MapMarker className="size-4 mt-0.5" />
                  <p className="body-small">{cart?.address?.full_address}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <ProfileNav className="size-4 mb-0.5" />
                  <p className="caption-small text-subtitle">
                    {cart?.address?.recipient_name} {" +"}
                    {cart?.address?.recipient_phone}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="label-regular pb-1">Pickup at</p>
                <div className="flex items-start gap-2">
                  <MapMarker className="size-4 mt-0.5" />
                  <p className="body-small">
                    Warehouse A, Wattle Downs, SA 5162
                    <br />
                    Open: Mon-Fri, 9:00 AM - 5:00 PM
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <ProfileNav className="size-4 mb-0.5" />
                  <p className="caption-small text-subtitle">
                    {cart?.address?.recipient_name} -{" "}
                    {cart?.address?.recipient_phone}
                  </p>
                </div>
              </>
            )}
            <Separator className="my-2" />
            <>
              <p className="label-regular pb-1">
                {cart?.delivery_type === "delivery" ? "Delivery" : "Pickup"}{" "}
                date
              </p>
              <div className="flex items-center gap-2">
                {cart?.delivery_type === "delivery" ? (
                  <Delivery className="size-4 mb-0.5" />
                ) : (
                  <WareHouse className="size-4 mb-0.5" />
                )}
                <p className="label-small">
                  {getDayString(cart?.delivery_date)} -{" "}
                  {getDayMonthNumber(cart?.delivery_date)}
                </p>
              </div>
            </>
          </div>

          <div className="flex flex-col gap-3 py-4 px-4 bg-white">
            <h6>Order Summary</h6>

            {cart?.flashings && (
              <NewOrderSummaryAccordion flashings={cart.flashings} />
            )}
            {cart?.delivery_type === "delivery" && (
              <>
                <Separator />
                <div className="flex flex-col">
                  <div className="flex justify-between label-small pr-8">
                    <p>Delivery</p>
                    <p className="text-success">
                      {cart?.delivery_method === "freight"
                        ? "Freight Collect"
                        : `$${cart?.delivery_cost?.toFixed(2)}`}
                    </p>
                  </div>
                  <p className="caption-small text-subtitle">
                    {cart?.delivery_method !== "freight"
                      ? "Factory will deliver your order"
                      : "Order delivered via freight transport"}
                  </p>
                </div>
              </>
            )}

            <Separator />
            <div className="flex justify-between label-small pr-8">
              <p>Flashings Cost</p>
              <p className="text-success">
                ${cart?.flashings_cost?.toFixed(2)}
              </p>
            </div>

            <Separator />
            <div className="flex justify-between label-small pr-8">
              <p>GST</p>
              <p className="text-success">
                $
                {(
                  (cart?.flashings_cost + cart?.delivery_cost) *
                  cart?.gst_ratio
                ).toFixed(2)}
              </p>
            </div>
            <Separator />
            <div className="flex justify-between label-regular pr-8">
              <p>Total</p>
              <p className="text-success">${cart?.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        <Button
          onClick={handleOnPay}
          className={cn("w-full", isPayLoading && "opacity-60 transition-all")}
        >
          {isPayLoading && <Loader2 className="animate-spin" />}
          Pay $ {cart?.total_amount.toFixed(2)}
        </Button>
      </Footer>
    </>
  );
}
