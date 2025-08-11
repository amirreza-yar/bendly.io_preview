import { StoredMaterialAndProps } from '@/types/material&PropsType'
import { materialsWithProperties } from '@/utilities/demo_datas/demoMaterials&Props'
import { db } from '../appDB'
import { useLiveQuery } from 'dexie-react-hooks'

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

export function getMaterialsAndProprs(): StoredMaterialAndProps[] | undefined | null {
  return useLiveQuery(() => db.materialsAndProps.toArray(), [], null)
}
