// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from '../appDB'
import type { StoredFlashing } from '@/types/flashingTypes'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId } from './utils'
import { StoredMaterialAndProps } from '@/types/material&PropsType'
import { materialsWithProperties } from '@/utilities/demo_datas/demoMaterials&Props'
import { useEffect } from 'react'
import Dexie from 'dexie'

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
  // const db = getDBOrThrow()
  const now = Date.now()

  await db.transaction('rw', db.flashings, async () => {
    // Try to update first (merge)
    const updatedCount = await db.flashings.update(id, {
      ...partial,
      updatedAt: now,
      // we will compute a correct isDraft below for both update and create cases
    } as Partial<StoredFlashing>)

    if (updatedCount) {
      // After update, recompute completeness and set isDraft properly (in case partial completed it)
      const merged = await db.flashings.get(id)
      if (!merged) return
      await db.flashings.update(id, { updatedAt: now })
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
      isDraft: true, // will be overwritten below after merge check
      colorSideDirection: false,
    }

    const merged = { ...base, ...partial }
    merged.updatedAt = now
    merged.createdAt = now

    await db.flashings.add(merged as StoredFlashing)
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
