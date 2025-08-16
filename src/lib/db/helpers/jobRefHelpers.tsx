import { db } from '../appDB'
import type { StoredFlashing } from '@/types/flashingTypes'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId } from './utils'
import Dexie from 'dexie'
import { getTotalGirth } from '@/hooks/canvas/useFlashingLoader'
import { StoredAddress, StoredJobReference } from '@/types/jobReferenceTypes'

type ReturnDexieError = Promise<string | typeof Dexie.DexieError | Error>

export function getJobRefById(jobRefId: string): StoredJobReference | undefined | null {
  return useLiveQuery(() => db.jobReferences.get({ id: jobRefId }), [jobRefId], null)
}

export async function addJobReference(jobRefData: Omit<StoredJobReference, 'id'>) {
  const now = Date.now()

  await db.transaction('rw', db.jobReferences, async () => {
    const merged: StoredJobReference = {
      ...jobRefData,
      id: generateRandomId({ length: 4 }),
    }

    merged.updatedAt = now
    merged.createdAt = now

    await db.jobReferences.add(merged)
  })
}

export async function updateJobReference(
  jobRefId: string,
  partial: Partial<Omit<StoredJobReference, 'addresses'>> & {
    addresses?: StoredAddress[]
  },
) {
  const now = Date.now()

  await db.transaction('rw', db.jobReferences, async () => {
    const existing = await db.jobReferences.get(jobRefId)
    if (!existing) {
      console.warn(`JobReference with jobRefId ${jobRefId} not found.`)
      return
    }

    let addresses = existing.addresses ?? []

    if (partial.addresses) {
      const incoming = partial.addresses
      const map = new Map(addresses.map((addr) => [addr.id, addr]))

      for (const addr of incoming) {
        map.set(addr.id, addr)
      }

      addresses = Array.from(map.values())
    }

    const merged: StoredJobReference = {
      ...existing,
      ...partial,
      addresses,
      updatedAt: now,
    }

    await db.jobReferences.update(jobRefId, merged)
  })
}

export const deleteJobRefById = async (jobRefId: string) => {
  try {
    await db.transaction('rw', db.jobReferences, async () => {
      await db.jobReferences.delete(jobRefId)
    })
  } catch {
    console.error('Error accured in delete flashing by ID')
  }
}

export const deleteJobRefAddressByIds = async (jobRefId: string, addressId: string) => {
  await db.transaction('rw', db.jobReferences, async () => {
    const jobRef = await db.jobReferences.get(jobRefId)
    if (!jobRef) {
      console.warn(`JobReference with id ${jobRefId} not found.`)
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

export async function jobReferCodeExists({
  jobRefId,
  code,
}: {
  jobRefId?: string
  code: number
}): Promise<boolean> {
  if (jobRefId) {
    const jobRef = await db.jobReferences.get(jobRefId)
    if (!jobRef) return false

    if (jobRef.code === code) {
      return false
    }

    const jobRefByCode = await db.jobReferences.where('code').equals(code).first()
    return !!jobRefByCode
  } else {
    const jobRef = await db.jobReferences.where('code').equals(code).first()
    return !!jobRef
  }
}

export const getJobRefAddressByIds = (jobRefId: string, addressId: string) => {
  return useLiveQuery(
    async () => {
      const jobRef = await db.jobReferences.get(jobRefId)
      return jobRef?.addresses?.find((addr) => addr.id === addressId)
    },
    [jobRefId, addressId],
    null,
  )
}
