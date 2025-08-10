// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from '../appDB'
import type { StoredFlashing } from '@/types/flashingTypes'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId } from './utils'
import { StoredMaterialAndProps } from '@/types/material&PropsType'
import { materialsWithProperties } from '@/utilities/demo_datas/demoMaterials&Props'
import { useEffect } from 'react'

export function initNewFlashing() {
  const newFlashingId = generateRandomId()

  upsertPartialFlashing(newFlashingId, {})

  return newFlashingId
}

export function getFlashingById(id: string): StoredFlashing | undefined {
  return useLiveQuery(() => {
    if (!id) return undefined
    // const db = getDBOrThrow()
    return db.flashings.get(id)
  }, [id])
}

function isFlashingComplete(obj: Partial<StoredFlashing>): boolean {
  // nodes must be an array with at least one node (adjust if empty nodes should be allowed)
  if (!Array.isArray(obj.nodes) || obj.nodes.length < 2) return true

  // booleans must be present (not undefined)
  if (typeof obj.startCrushFold !== 'boolean') return true
  if (typeof obj.endCrushFold !== 'boolean') return true
  if (typeof obj.crushFoldDir !== 'boolean') return true

  // material must be non-empty string
  if (!obj.material || typeof obj.material !== 'string') return true

  if (!Boolean(obj.color) || Boolean(obj.thickness)) return true

  return false
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
      const finalIsDraft = isFlashingComplete(merged) // per your wording: true when required fields are filled
      await db.flashings.update(id, { isDraft: finalIsDraft, updatedAt: now })
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
    // merged.isDraft = isFlashingComplete(merged) // true when required fields filled

    // console.log(merged.isDraft)

    await db.flashings.add(merged as StoredFlashing)
  })
}

/**
 * Add demo materials if table is empty.
 * Idempotent: if table already has rows, does nothing.
 */
export async function seedMaterialsIfEmpty() {
  const count = await db.materialsAndProps.count()
  if (count > 0) return // already seeded

  // Prepare rows (map demo data to StoredMaterialAndProps)
  const rows: StoredMaterialAndProps[] = materialsWithProperties.map((m) => {
    const item: StoredMaterialAndProps = { material: m.material }
    if ('colors' in m && Array.isArray((m as any).colors)) item.colors = (m as any).colors
    if ('thicknesses' in m && Array.isArray((m as any).thicknesses))
      item.thicknesses = (m as any).thicknesses
    return item
  })

  try {
    // Use a transaction + bulkAdd for atomicity/efficiency
    await db.transaction('rw', db.materialsAndProps, async () => {
      await db.materialsAndProps.bulkAdd(rows)
    })
  } catch {}
  return
}

export function getMaterialsAndProprs() {
  // seedMaterialsIfEmpty()

  return useLiveQuery(() => {
    return db.materialsAndProps.toArray()
  }, [])
}
