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
    useAsTitle: '_id',
    defaultColumns: ['_id'],
  },
  fields: [
    { name: '_id', type: 'text' },
    { name: 'name', type: 'text' },
    { name: 'materials', type: 'array', fields: [] },
    { name: 'customFormulas', type: 'array', fields: [] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
  timestamps: true,
}