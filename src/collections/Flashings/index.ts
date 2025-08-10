import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Flashings: CollectionConfig = {
  slug: 'flashings',
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
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    { name: 'data', type: 'json', required: true },
    { name: 'revisions', type: 'array', fields: [] },
    { name: 'status', type: 'select', options: [{ label: 'Drafted', value: 'drafted' }] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
  timestamps: true,
}