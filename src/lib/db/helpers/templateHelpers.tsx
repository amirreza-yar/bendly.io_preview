import Dexie from 'dexie'

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
