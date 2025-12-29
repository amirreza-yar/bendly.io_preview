"use client";
import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import DetailsComponent, {
  DetailsFormValues,
} from "@/components/flashing/details/detailsComponent";
import { toast } from "sonner";
import api, { fetcher } from "@/lib/axios";
import useSWR from "swr";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/appDB";

export default function DetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ flashingId?: string }>;
}) {
  const flashingId = use(searchParams).flashingId;

  const router = useRouter();

  const { data: flashing } = useSWR(
    flashingId ? `/a/flashing/${flashingId}/` : null,
    fetcher
  );

  const dexieFlashing = useLiveQuery(
    () => (flashingId ? undefined : db.flashings.get({ id: "1" })),
    [flashingId],
    null
  );

  const onModalDiscardChanges = () => {
    router.push(`/o/cart`);
  };

  const onDetailsFormSubmit = async (data: DetailsFormValues) => {
    if (flashingId && flashing) {
      try {
        await api.patch(`/a/flashing/${flashingId}/`, {
          code: data.code,
          position: data.position,
          specifications: data.specifications,
        });

        toast("Flashing details updated");
        router.replace("/cart");
        // eslint-disable-next-line
      } catch (err: any) {
        toast("Something went wrong");
      }
    } else if (dexieFlashing) {
      try {
        await api.post("/a/flashing/", {
          material: dexieFlashing?.material,
          code: data.code,
          position: data.position,
          specifications: data.specifications,
          start_crush_fold: dexieFlashing?.startCrushFold,
          end_crush_fold: dexieFlashing?.endCrushFold,
          color_side_dir: dexieFlashing?.colorSideDirection,
          tapered: dexieFlashing?.tapered,
          nodes: dexieFlashing?.nodes,
        });

        toast("Flashing added to order");
        router.replace("/cart");

        await db.flashings.delete("1");
        // eslint-disable-next-line
      } catch (err: any) {
        toast("Something went wrong");
      }
    }
  };

  return (
    <>
      <DetailsComponent
        onDetailsFormSubmit={onDetailsFormSubmit}
        flashing={flashing}
        onModalDiscardChanges={onModalDiscardChanges}
      />
    </>
  );
}
