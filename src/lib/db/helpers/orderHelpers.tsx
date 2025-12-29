// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from "../appDB";
import { useLiveQuery } from "dexie-react-hooks";
import {
  generateRandomId,
  generateRandomNumericId,
  looksLikeGeneratedNumericId,
} from "./utils";
import Dexie from "dexie";
import { getTotalGirth } from "@/hooks/canvas/useFlashingLoader";
import { StoredOrder, StoredOrderFlashing } from "@/types/orderTypes";
import { notFound } from "next/navigation";
import { StoredFlashing } from "@/types/flashingTypes";

type ReturnDexieError = Promise<string | typeof Dexie.DexieError | Error>;

export async function upsertPartialOrder(
  id: number,
  partial: Partial<StoredOrder>
) {
  const now = Date.now();

  if (!looksLikeGeneratedNumericId(id)) {
    return;
    // notFound()
  }

  await db.transaction("rw", db.orders, async () => {
    // Try to update first (merge)
    const existing = await db.orders.get(id);

    if (existing) {
      let flashings = existing.flashings ?? [];

      if (partial.flashings) {
        const incoming = partial.flashings;
        const map = new Map(flashings.map((f) => [f.id, f]));

        for (const flash of incoming) {
          map.set(flash.id, flash); // replaces if exists, adds if new
        }

        flashings = Array.from(map.values());
      }

      const merged: StoredOrder = {
        ...existing,
        ...partial,
        flashings,
        updatedAt: now,
      };

      await db.orders.put(merged);
      return;
    }

    // Not found -> create new with defaults + partial
    const base: StoredOrder = {
      id,
      status: "Pending",
      deliveryType: "delivery",
      progress: "Order Received",
      createdAt: now,
      updatedAt: now,
      completed: false,
      hasSeenPayResult: false,
    };

    const merged: StoredOrder = {
      ...base,
      ...partial,
    };

    await db.orders.add(merged);
  });
}

export async function initNewOrder(
  partial: Partial<StoredOrder>
): Promise<number | typeof Dexie.DexieError | Error> {
  try {
    const newOrderId = generateRandomNumericId();
    await upsertPartialOrder(newOrderId, partial);
    return newOrderId;
  } catch (err) {
    if (err instanceof Dexie.DexieError || err instanceof Error) {
      return err;
    } else {
      return new Error(String(err));
    }
  }
}

export function useGETOrderById(
  orderId: number
): StoredOrder | undefined | null {
  return useLiveQuery(() => db.orders.get({ id: orderId }), [orderId], null);
}

export function useGETAllOrders(): StoredOrder[] | undefined | null {
  return useLiveQuery(() => db.orders.toArray(), [], null);
}

export function useGETFlashingsByOrderId(
  orderId: number
): (StoredFlashing | undefined)[] {
  const flashingIds = useGETOrderById(orderId)?.flashings?.map(
    (flash) => flash.id
  );

  return useLiveQuery(
    async () => {
      if (!flashingIds || flashingIds.length === 0) return [];
      const rows = await db.flashings.where("id").anyOf(flashingIds).toArray();
      // if you need to preserve the original flashingIds order:
      const map = new Map(rows.map((r) => [r.id, r]));
      return flashingIds.map((id) => map.get(id)).filter(Boolean);
    },
    [flashingIds?.join(",")],
    []
  );
}

/**
 * Remove a flashing reference from an order's `flashings` array.
 *
 * @param orderId numeric id of the order
 * @param flashingId id of the flashing to remove (string|number depending on your schema)
 * @param options.deleteFlashingRow if true, also delete the flashing record from `db.flashings`
 * @returns true if a flashing was removed from the order, false otherwise
 */
export async function deleteFlashingFromOrderByIds(
  orderId: number,
  flashingId: string | number,
  options?: { deleteFlashingRow?: boolean }
): Promise<boolean> {
  if (orderId === undefined || orderId === null) return false;

  // choose tables to include in transaction:
  const useDelete = Boolean(options?.deleteFlashingRow);

  try {
    // include both tables in tx so both operations are atomic when delete is requested
    const modifiedCount = await db.transaction(
      "rw",
      useDelete ? [db.orders, db.flashings] : [db.orders],
      async () => {
        let removed = 0;

        // modify the order row in-place (Dexie modify saves it)
        const count = await db.orders
          .where("id")
          .equals(orderId as any)
          .modify(
            (
              order: Partial<StoredOrder> & {
                flashings?: StoredOrderFlashing[];
              }
            ) => {
              if (
                !Array.isArray(order.flashings) ||
                order.flashings.length === 0
              )
                return;
              const before = order.flashings.length;
              order.flashings = order.flashings.filter(
                (f) => f.id !== flashingId
              );
              const after = order.flashings.length;
              if (after < before) removed = 1;
            }
          );

        // `modify` returns number of rows matched/modified — but we also track `removed` above
        if (useDelete && removed) {
          // also delete the flashing row from the flashings table
          await db.flashings
            .where("id")
            .equals(flashingId as any)
            .delete();
        }

        return removed;
      }
    );

    return Boolean(modifiedCount);
  } catch (err) {
    console.error(
      "removeFlashingFromOrder transaction failed",
      { orderId, flashingId },
      err
    );
    throw err;
  }
}

export const deleteOrderById = async (orderId: number) => {
  try {
    await db.transaction("rw", db.orders, db.flashings, async () => {
      await db.orders.delete(orderId);
    });
  } catch {
    console.error("Error accured in delete flashing by ID");
  }
};

export const useOrderExistsById = (orderId: number) => {
  return useLiveQuery(
    async () => {
      const order = await db.orders.get(orderId);
      return Boolean(order);
    },
    [orderId],
    null
  );
};
