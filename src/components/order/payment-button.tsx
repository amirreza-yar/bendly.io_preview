"use client";

import useSWRMutation from "swr/mutation";
import { Button } from "../ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/utilities/ui";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentButton({
  totalAmount,
}: {
  totalAmount: number;
}) {
  const router = useRouter();

  const handlePay = async () => {
    try {
      const res = await api.post("/a/cart/pay/");
      console.log(res.data.pay_url);

      window.location.href = res.data.pay_url;

      // eslint-disable-next-line
    } catch (error: any) {
      toast("Payment provider error");
    }
  };

  const { trigger: onPay, isMutating: isLoadingPayment } = useSWRMutation(
    "/a/cart/pay/",
    handlePay,
  );

  return (
    <Button
      type="submit"
      className={cn(
        "w-full sm:w-80",
        isLoadingPayment && "opacity-60 transition-all",
      )}
      size="lg"
      onClick={() => onPay()}
    >
      {isLoadingPayment ? (
        <>
          <Loader2 className="animate-spin" />
          Redirecting to Payment Page
        </>
      ) : (
        <>
          Pay
          <span>${totalAmount.toFixed(2)}</span>
        </>
      )}
    </Button>
  );
}
