// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from '../appDB'
import type { StoredFlashing } from '@/types/flashingTypes'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId } from './utils'
import Dexie from 'dexie'
import { getTotalGirth } from '@/hooks/canvas/useFlashingLoader'
import { StoredAddress, StoredJobReference } from '@/types/jobReferenceTypes'

type ReturnDexieError = Promise<string | typeof Dexie.DexieError | Error>

export function getJobRefById(jobRefCode: number): StoredJobReference | undefined | null {
  return useLiveQuery(() => db.jobReferences.get({ code: jobRefCode }), [jobRefCode], null)
}

export async function addJobReference(jobRefData: StoredJobReference) {
  const now = Date.now()

  await db.transaction('rw', db.jobReferences, async () => {
    const merged: StoredJobReference = {
      ...jobRefData,
    }

    jobRefData.updatedAt = now
    jobRefData.createdAt = now

    console.log(jobRefData)

    await db.jobReferences.add(jobRefData)
  })
}

export async function updateJobReference(
  code: number,
  partial: Partial<Omit<StoredJobReference, 'addresses'>> & {
    addresses?: StoredAddress[]
  },
) {
  const now = Date.now()

  await db.transaction('rw', db.jobReferences, async () => {
    const existing = await db.jobReferences.get(code)
    if (!existing) {
      console.warn(`JobReference with code ${code} not found.`)
      return
    }

    let addresses = existing.addresses ?? []

    if (partial.addresses) {
      const incoming = partial.addresses
      const map = new Map(addresses.map((addr) => [addr.id, addr]))

      for (const addr of incoming) {
        map.set(addr.id, addr) // replaces if exists, adds if new
      }

      addresses = Array.from(map.values())
    }

    const merged: StoredJobReference = {
      ...existing,
      ...partial,
      addresses,
      updatedAt: now,
    }

    await db.jobReferences.update(code, merged)
  })
}

export const deleteJobRefById = async (jobRefCode: number) => {
  try {
    await db.transaction('rw', db.jobReferences, db.orders, async () => {
      await db.jobReferences.delete(jobRefCode)
    })
  } catch {
    console.error('Error accured in delete flashing by ID')
  }
}

export const deleteJobRefAddressByIds = async (jobRefCode: number, addressId: string) => {
  await db.transaction('rw', db.jobReferences, async () => {
    const jobRef = await db.jobReferences.get(jobRefCode)
    if (!jobRef) {
      console.warn(`JobReference with id ${jobRefCode} not found.`)
      return
    }

    const updatedAddresses = (jobRef.addresses ?? []).filter((addr) => addr.id !== addressId)

    const updatedJobRef: StoredJobReference = {
      ...jobRef,
      addresses: updatedAddresses,
      updatedAt: Date.now(),
    }

    await db.jobReferences.put(updatedJobRef)
  })
}

export function getAllJobRefs(): StoredJobReference[] | undefined | null {
  return useLiveQuery(() => db.jobReferences.toArray(), [], null)
}

export async function jobReferCodeExists(code: number): Promise<boolean> {
  const jobRef = await db.jobReferences.get(code)
  return !!jobRef
}
