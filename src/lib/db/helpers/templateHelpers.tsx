import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../appDB'
import { Template } from '@/types/templateType'
import { StoredFlashing } from '@/types/flashingTypes'

export const addTemplate = async (
  template: Template,
): Promise<typeof Dexie.ConstraintError | Error | null> => {
  try {
    if (!template.flashing || !template.name || !template.owner) {
      throw new Error('Template missing args')
    }

    await db.transaction('rw', db.templates, db.flashings, async () => {
      await db.templates.add(template)
    })

    return null
  } catch (err) {
    if (err instanceof Dexie.ConstraintError) {
      return err
    } else if (err instanceof Error) {
      return err
    } else {
      return new Error(String(err))
    }
  }
}

// Hook to get all templates
export function useGETAllTemplates(): Template[] | undefined | null {
  return useLiveQuery(() => db.templates.toArray())
}

// Hook to get templates by owner
export function useGETTemplatesByOwner(owner: string): Template[] | undefined | null {
  return useLiveQuery(() => db.templates.where('owner').equals(owner).toArray())
}

// Hook to get app templates (templates not owned by current user)
export function useGETAppTemplates(currentUserId: string): Template[] | undefined | null {
  return useLiveQuery(() => db.templates.where('owner').notEqual(currentUserId).toArray())
}
