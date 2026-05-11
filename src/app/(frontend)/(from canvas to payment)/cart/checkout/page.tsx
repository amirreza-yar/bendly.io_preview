import { NewOrderSummaryAccordion } from "@/components/order/accordion";
import { Delivery, MapMarker, ProfileNav, WareHouse } from "@/components/icons";
import api from "@/lib/axios";
import { getDayMonthNumber, getDayString } from "@/utilities/datetime";
import { Cart } from "@/components/order/fulfillment-form";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentButton from "@/components/order/payment-button";

const onFetchCart: () => Promise<{
  data: Cart | undefined;
  ok: boolean;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/cart/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { data: res.data, ok: true };
  } catch {
    return { data: undefined, ok: false };
  }
};

export default async function CheckOutPage() {
  const { data: cart } = await onFetchCart();

  if (!cart) return notFound();

  // const handleOnPay = async () => {
  //   try {
  //     const res = await api.post("/a/cart/pay/");
  //     setIsPayLoading(false);
  //     router.push(res.data.pay_url);
  //     // eslint-disable-next-line
  //   } catch (error: any) {
  //     setIsPayLoading(false);
  //   }
  // };

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="h-full">
          <div className="h-full space-y-2 p-2 md:p-4 pb-20">
            <div className="space-y-2 px-4  py-4">
              {cart?.delivery_type === "delivery" ? (
                <>
                  <p className="text-base font-semibold pb-1">Deliver to</p>
                  <div className="border rounded-xl py-3 px-4 text-sm space-y-2">
                    <div className="flex gap-2">
                      <MapMarker className="size-4 mt-0.5" />
                      <p className="body-small">
                        {cart?.address?.full_address}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ProfileNav className="size-4 mb-0.5" />
                      <p className="">
                        {cart?.address?.recipient_name} {" +"}
                        {cart?.address?.recipient_phone}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold pb-1">Pickup at</p>
                  <div className="border rounded-xl py-3 px-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapMarker className="size-4 mt-0.5" />
                      <p className="text-sm">
                        Warehouse A, Wattle Downs, SA 5162
                        <br />
                        <span className="text-muted-foreground">
                          Open: Mon-Fri, 9:00 AM - 5:00 PM
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ProfileNav className="size-4 mb-0.5" />
                      <p className="">
                        {cart?.address?.recipient_name} -{" "}
                        {cart?.address?.recipient_phone}
                      </p>
                    </div>
                  </div>
                </>
              )}
              <>
                <p className="text-base font-semibold pb-1 pt-4">
                  {cart?.delivery_type === "delivery" ? "Delivery" : "Pickup"}{" "}
                  date
                </p>
                <div className="flex items-center gap-2 border rounded-xl py-3 px-4">
                  {cart?.delivery_type === "delivery" ? (
                    <Delivery className="size-5 mb-0.5" />
                  ) : (
                    <WareHouse className="size-5 mb-0.5" />
                  )}
                  <p className="text-sm">
                    {getDayString(cart?.delivery_date)} -{" "}
                    {getDayMonthNumber(cart?.delivery_date)}
                  </p>
                </div>
              </>
            </div>

            <div className="space-y-3 pb-4 px-4">
              <h6>Order Summary</h6>

              {cart?.flashings && (
                <NewOrderSummaryAccordion flashings={cart.flashings} />
              )}
              {cart?.delivery_type === "delivery" && (
                <>
                  <div className="rounded-xl border px-4 py-2 -mt-2">
                    <div className="flex justify-between label-small pr-2">
                      <p>Delivery</p>
                      <p className="text-success">
                        {cart?.delivery_method === "freight"
                          ? "Freight Collect"
                          : `$${cart?.delivery_cost?.toFixed(2)}`}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cart?.delivery_method !== "freight"
                        ? "Factory will deliver your order"
                        : "Order delivered via freight transport"}
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-between text-xs rounded-xl border px-4 py-2 pr-6">
                <p>Flashings Cost</p>
                <p className="text-success">
                  ${cart?.flashings_cost?.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between text-xs rounded-xl border px-4 py-2 pr-6">
                <p>GST</p>
                <p className="text-success">
                  $
                  {(
                    (cart.flashings_cost + (cart.delivery_cost ?? 0)) *
                    cart?.gst_ratio
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-base rounded-xl border px-4 py-2 pr-6">
                <p>Total</p>
                <p className="text-success">${cart?.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-end w-full absolute bottom-0 p-4 shadow-md bg-background rounded-b-xl">
        <PaymentButton totalAmount={cart.total_amount} />
      </div>

      {/* <Button
          className={cn("w-full", isPayLoading && "opacity-60 transition-all")}
        >
          {isPayLoading && <Loader2 className="animate-spin" />}
          Pay $ {cart?.total_amount.toFixed(2)}
        </Button> */}
    </>
  );
}
