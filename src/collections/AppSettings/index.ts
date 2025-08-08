import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const AppSettings: CollectionConfig = {
  slug: 'appsettings',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: '_id',
    defaultColumns: ['_id'],
  },
  fields: [
    { name: '_id', type: 'text' },
    { name: 'setting', type: 'text' },
    {
      name: 'appDefaults',
      type: 'group',
      fields: [
        { name: 'materialOptions', type: 'text' },
        { name: 'foldStyles', type: 'text' },
        { name: 'statusOptions', type: 'text' },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'read',
          type: 'checkbox',
        },
        {
          name: 'write',
          type: 'checkbox',
        },
      ],
    },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
  timestamps: true,
}
