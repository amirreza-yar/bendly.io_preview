import { notFound } from "next/navigation";
import api from "@/lib/axios";
import { Download, Edit } from "@/components/icons";
import FlashingSVG from "@/components/utils/flashingSVG";
import { Button } from "@/components/ui/button";
import { Flashing, Material, Template } from "@/types/api";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cookies } from "next/headers";
import { DeleteFlashingFromCartModal } from "@/components/order/remove-flashing-from-cart-modal";
import CartNoFlashings from "@/components/order/cart-empty-state";
import { AddNewFlashingToCartModal } from "@/components/order/add-new-flashing-modal";
import BackController from "@/components/back-controller";
import { compressToEncodedURIComponent } from "lz-string";

import EditFlashingDetailsDialog from "@/components/order/edit-flashing-details-dialog";
import EditFlashingMaterialDialog from "@/components/order/edit-flashing-material-dialog copy";

const onFetchCart: () => Promise<{
  data: { flashings: Flashing[] } | undefined;
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

    return { data: res.data as { flashings: Flashing[] }, ok: true };
  } catch {
    return { data: undefined, ok: false };
  }
};

const onFetchMaterials: () => Promise<{
  data: Material[];
  ok: boolean;
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get("/a/materials/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { data: res.data as Material[], ok: true };
  } catch {
    return { data: [], ok: false };
  }
};

const onDeleteFlashing: (flashingId: string | number) => Promise<{
  ok: boolean;
}> = async (flashingId) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.delete(`/a/flashing/${flashingId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { data: res.data as { flashings: Flashing[] }, ok: true };
  } catch {
    return { data: undefined, ok: false };
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

const compressedFlashing = (fetchedFlashing: Flashing) => {
  const flash = {
    nodes: fetchedFlashing.nodes,
    start_crush_fold: fetchedFlashing.start_crush_fold,
    end_crush_fold: fetchedFlashing.end_crush_fold,
    color_side_dir: fetchedFlashing.color_side_dir,
  };

  return compressToEncodedURIComponent(JSON.stringify(flash));
};

export default async function OrderReviewPage() {
  const { data: cart } = await onFetchCart();

  if (!cart) return notFound();

  if (cart.flashings.length === 0) {
    return <CartNoFlashings onDiscardCart={onPostDiscardCart} />;
  }

  const { data: materials } = await onFetchMaterials();

  //   const onDeleteFlashing = async (flashingId: string | number) => {
  //     try {
  //       await api.delete(`/a/flashing/${flashingId}/`);
  //       //   mutate();
  //       toast("Flashing removed from order");
  //     } catch (error: any) {
  //       toast("Something broke, probably not your fault.");
  //     }
  //   };

  //   const onSaveFlashing = (flashingId: string) => {
  //     // TODO Flashing PDF download function here
  //   };

  //   const onAddNewFlashing = () => {
  //     // router.replace("/f/material");
  //   };

  //   const onGoHome = async () => {
  //     // TODO Here the cart should be deleted
  //     // router.push("/dashboard");
  //   };

  //   const onProceedOrder = () => {
  //     // router.push(`/cart/fulfill`);
  //   };

  return (
    <>
      <ScrollArea className="h-full">
        <div className="pb-22">
          {cart?.flashings?.map((flash: Flashing, index: number) => (
            <div key={index} className="space-y-2 p-3">
              <div className="p-3 rounded-xl border relative">
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="absolute right-1 top-1"
                  asChild
                >
                  <a
                    href={`/canvas?&next=cart&return=cart&flashingId=${flash.id}&flashing=${compressedFlashing(flash)}`}
                  >
                    <Edit className="size-5" />
                  </a>
                </Button>
                <FlashingSVG
                  // @ts-expect-error its ok
                  flashing={{
                    nodes: flash.nodes,
                    startCrushFold: flash.start_crush_fold,
                    endCrushFold: flash.end_crush_fold,
                    crushFoldDir: !flash.color_side_dir,
                  }}
                  className="py-4 max-h-40 h-full mx-auto"
                  path3DOffsetCoeff={1.2}
                />
                <div className="space-y-1">
                  <p className="caption-small">
                    Total Grith:
                    <span className="font-semibold pl-1">
                      {flash.total_girth.toFixed(0)} mm
                    </span>
                  </p>
                  <p className="caption-small">
                    Tapered:
                    <span className="font-semibold pl-1">
                      {flash.tapered ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl border relative">
                <div className="space-y-1">
                  <p className="caption-small">
                    Material:
                    <span className="pl-1 font-semibold">
                      {flash.material_data.name}
                    </span>
                  </p>
                  <p className="caption-small">
                    {flash.material_data.type === "color"
                      ? `Color:`
                      : `Thickness:`}
                    <span className="pl-1 font-semibold">
                      {flash.material_data.type === "color"
                        ? `${flash.material_data.label}`
                        : `${flash.material_data.label} mm`}
                    </span>
                  </p>
                </div>
                <EditFlashingMaterialDialog
                  flashingId={flash.id}
                  materials={materials}
                  selectedMat={flash.material_data}
                />
              </div>
              <div className="space-y-4 p-3 rounded-xl border relative">
                <EditFlashingDetailsDialog
                  flashingId={flash.id}
                  details={{
                    code: flash.code,
                    position: flash.position,
                    specifications: flash.specifications,
                  }}
                />
                <div className="space-y-1">
                  <p className="caption-small">
                    Code:
                    <span className="font-semibold pl-1">{flash.code}</span>
                  </p>
                  <p className="caption-small">
                    Position:
                    <span className="font-semibold pl-1">
                      {flash.position ? flash.position : "Not provided"}
                    </span>
                  </p>
                  <p className="caption-small">
                    Fit together:
                    <span className="font-semibold pl-1">Right to Left</span>
                  </p>
                </div>
                <div className="-mx-3">
                  <div className="grid grid-cols-2 justify-start text-xs bg-blue-100/50 pl-5 py-2 mb-2">
                    <p>Quantity</p>
                    <p>Length</p>
                  </div>
                  {flash?.specifications?.map((spec: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-1 justify-start text-xs pl-5 py-1"
                    >
                      <p>{spec.quantity} pcs</p>
                      <p>{spec.length} mm</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <DeleteFlashingFromCartModal
                  flashingId={flash.id}
                  deleteFlashing={onDeleteFlashing}
                />
                {/* <Button variant="ghost">
                  PDF
                  <Download className="size-5" />
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="grid grid-cols-2 gap-2 w-full absolute bottom-0 p-4 shadow-md bg-background rounded-b-xl">
        <AddNewFlashingToCartModal />
        <Button size="lg" asChild>
          <Link href="/cart/fulfill">Proceed Order</Link>
        </Button>
      </div>

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
