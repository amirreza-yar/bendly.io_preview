"use client";
import React, { use } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import DetailsComponent, {
  DetailsFormValues,
} from "@/components/flashing/details/detailsComponent";
import {
  useGETOrderById,
  initNewOrder,
  upsertPartialOrder,
} from "@/lib/db/helpers/orderHelpers";
import {
  useGETFlashingById,
  removeOrderIdToBeSavedFromFlashingById,
  deleteFlashingById,
} from "@/lib/db/helpers/flashingHelpers";
import {
  Specification,
  StoredOrder,
  StoredOrderFlashing,
} from "@/types/orderTypes";
import { generateRandomId } from "@/lib/db/helpers/utils";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import api from "@/lib/axios";

export default function DetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ flashingId?: string }>;
}) {
  const flashingId = use(searchParams).flashingId;

  const router = useRouter();

  const flashing = useGETFlashingById("1");

  const onModalDiscardChanges = () => {
    router.push(`/o/cart`);
  };

  const onDetailsFormSubmit = async (data: DetailsFormValues) => {
    console.log(data);

    console.log({
      material: flashing?.material,
      code: data.code,
      position: data.position,
      specifications: data.specifications,
      start_crush_fold: flashing?.startCrushFold,
      end_crush_fold: flashing?.endCrushFold,
      color_side_dir: flashing?.crushFoldDir,
      tapered: flashing?.tapered,
      nodes: flashing?.nodes,
    });

    if (flashingId) {
      console.log(flashingId);
    } else if (flashing) {
      try {
        await api.post("/a/flashing/", {
          material: flashing?.material,
          code: data.code,
          position: data.position,
          specifications: data.specifications,
          start_crush_fold: flashing?.startCrushFold,
          end_crush_fold: flashing?.endCrushFold,
          color_side_dir: flashing?.crushFoldDir,
          tapered: flashing?.tapered,
          nodes: flashing?.nodes,
        });

        toast("Flashing added to order");
        router.replace("/cart");

        await deleteFlashingById("1");
      } catch (err: any) {}
    }

    // const specificationsToBeStored: Specification[] = data.specifications.map(
    //   (spec) => ({
    //     ...spec,
    //     id: generateRandomId({ length: 4 }),
    //     flashingId: flashing?.id ?? "",
    //   })
    // );

    // const orderIdToBeSaved = flashing?.orderIdToBeSaved;

    // if (flashing?.orderIdToBeSaved) {
    //   removeOrderIdToBeSavedFromFlashingById(flashing.id);
    // }

    // const newFlashing: StoredOrderFlashing = {
    //   id: flashing?.id ?? "",
    //   code: data.code,
    //   position: data.position,
    //   specifications: specificationsToBeStored,
    // };

    // const newOrderFlashing: Partial<StoredOrder> = {
    //   flashings: [newFlashing],
    // };

    // if (orderIdToBeSaved) {
    //   upsertPartialOrder(Number(orderIdToBeSaved), newOrderFlashing).then(
    //     (orderId) => {
    //       router.push(`/o/${orderIdToBeSaved}/review`);
    //       toast("New flashing added");
    //     }
    //   );
    // } else if (order) {
    //   console.log(order, orderId);
    //   upsertPartialOrder(Number(orderId), newOrderFlashing).then((orderId) => {
    //     router.push(`/o/${order.id}/review`);
    //     toast("Your changes have been saved");
    //   });
    // } else {
    //   initNewOrder(newOrderFlashing).then((orderId) => {
    //     router.push(`/o/${orderId}/review`);
    //   });
    // }
  };

  return (
    <>
      <DetailsComponent
        onDetailsFormSubmit={onDetailsFormSubmit}
        flashingId={flashingId}
        onModalDiscardChanges={onModalDiscardChanges}
        // Header={<Header title="Details" returnHref="/f/preview" />}
      />
    </>
  );
}
