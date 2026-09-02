import { notFound, redirect } from "next/navigation";
import api from "@/lib/axios";

import OrderFulfillmentForm, {
  Cart,
  JobRef,
} from "@/components/order/fulfillment-form";
import { cookies } from "next/headers";

const onFetchCart: () => Promise<{
  data: Cart | undefined;
  ok: boolean;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/cart/", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return { data: res.data, ok: true };
  } catch {
    return { data: undefined, ok: false };
  }
};

const onFetchJobRefs: () => Promise<{
  data: { results: JobRef[] };
  ok: boolean;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/job-ref/", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    });

    return { data: res.data, ok: true };
  } catch {
    return { data: { results: [] }, ok: false };
  }
};

// const onPatchCart: (data: any) => Promise<{
//   data: { flashings: Flashing[] } | undefined;
//   ok: boolean;
// }> = async (data) => {
//   "use server";

//   try {
//     const accessToken = (await cookies()).get("auth-jwt")?.value;

//     const res = await api.patch("/a/cart/", data, {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
//       },
//     });

//     return { data: res.data as { flashings: Flashing[] }, ok: true };
//   } catch {
//     return { data: undefined, ok: false };
//   }
// };

export default async function OrderFulfillmentPage({
  searchParams,
}: {
  searchParams: Promise<{
    project_id: string | number;
    address_id: number | string;
  }>;
}) {
  const { data: cart } = await onFetchCart();
  const { data: jobRefs } = await onFetchJobRefs();

  const { project_id, address_id } = await searchParams;

  if (!cart) return notFound();

  if (cart.flashings.length === 0) {
    return redirect("/cart");
  }

  return (
    <>
      <OrderFulfillmentForm
        cart={cart}
        jobRefs={jobRefs.results}
        queryAddressId={address_id}
        queryProjectId={project_id}
      />

      {/* <Footer>
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
          </Footer> */}
    </>
    //   ) : (
    //     <>
    //       <div className="h-full flex flex-col gap-4 items-center justify-center">
    //         <NoFlashingSVG />
    //         <p className="subtitle-large">
    //           There are no flashings for this order
    //         </p>
    //         <Button
    //           className="w-44"
    //           variant="default"
    //           onClick={onAddNewFlashing}
    //         >
    //           Add New Flashing
    //         </Button>
    //         <Button className="w-44" variant="secondary" onClick={onGoHome}>
    //           Go Home
    //         </Button>
    //       </div>
    //     </>
    //   )}
    // </>
  );
}
