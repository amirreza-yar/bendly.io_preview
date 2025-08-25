import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Factories: CollectionConfig = {
  slug: 'factories',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'factoryId',
    defaultColumns: ['id', 'factoryId', 'name', 'createdAt', 'updatedAt'],
  },
  fields: [
    { name: 'factoryId', type: 'text' },
    { name: 'name', type: 'text' },
    { name: 'materials', type: 'json' },
    { name: 'customFormulas', type: 'json' },
  ],
  timestamps: true,
}
