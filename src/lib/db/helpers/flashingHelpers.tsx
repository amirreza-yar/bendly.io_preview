// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from '../appDB'
import type { StoredFlashing } from '@/types/flashingTypes'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId } from './utils'
import Dexie from 'dexie'
import { getTotalGirth } from '@/hooks/canvas/useFlashingLoader'

type ReturnDexieError = Promise<string | typeof Dexie.DexieError | Error>

export async function initNewFlashing(): ReturnDexieError {
  try {
    const newFlashingId = generateRandomId()
    await upsertPartialFlashing(newFlashingId, {})
    return newFlashingId
  } catch (err) {
    if (err instanceof Dexie.DexieError || err instanceof Error) {
      return err
    } else {
      return new Error(String(err))
    }
  }
}

export function getFlashingById(flashingId: string): StoredFlashing | undefined | null {
  return useLiveQuery(() => db.flashings.get({ id: flashingId }), [flashingId], null)
}

export async function upsertPartialFlashing(id: string, partial: Partial<StoredFlashing>) {
  const now = Date.now()

  await db.transaction('rw', db.flashings, async () => {
    // Try to update first (merge)
    const existing = await db.flashings.get(id)

    if (existing) {
      // Merge existing + partial
      const merged: StoredFlashing = {
        ...existing,
        ...partial,
        updatedAt: now,
      }

      // Recompute derived fields
      merged.crushFold = merged.startCrushFold || merged.endCrushFold
      merged.tapered = merged.nodes.some((node) => !!node.next_line_bside_length)
      merged.totalGirth = getTotalGirth(merged.nodes) ?? 0

      await db.flashings.put(merged)
      return
    }

    // Not found -> create new with defaults + partial
    const base: StoredFlashing = {
      id,
      nodes: [],
      startCrushFold: false,
      endCrushFold: false,
      crushFoldDir: false,
      material: '',
      color: undefined,
      thickness: undefined,
      createdAt: now,
      updatedAt: now,
      isDraft: true,
      colorSideDirection: false,
      crushFold: false,
      tapered: false,
      totalGirth: 0,
    }

    const merged: StoredFlashing = {
      ...base,
      ...partial,
    }

    // Recompute derived fields
    merged.crushFold = merged.startCrushFold || merged.endCrushFold
    merged.tapered = merged.nodes.some((node) => !!node.next_line_bside_length)
    merged.totalGirth = getTotalGirth(merged.nodes) ?? 0

    merged.updatedAt = now
    merged.createdAt = now

    await db.flashings.add(merged)
  })
}

export const deleteFlashingById = async (flashingId: string) => {
  try {
    await db.transaction('rw', db.flashings, db.templates, async () => {
      await db.flashings.delete(flashingId)
    })
  } catch {
    console.error('Error accured in delete flashing by ID')
  }
}

export const deleteAllDraftFlashings = async () => {
  try {
    await db.flashings.filter((flash) => flash.isDraft).delete()
  } catch (err) {
    if (err instanceof Dexie.DexieError || err instanceof Error) {
      return err
    } else {
      return new Error(String(err))
    }
  }
}
