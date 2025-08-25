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
    useAsTitle: 'flashingId',
    defaultColumns: ['id', 'flashingId', 'ownerId', 'status', 'createdAt'],
  },
  fields: [
    { name: 'flashingId', type: 'text', required: true },
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    { name: 'data', type: 'json', required: true },
    { name: 'revisions', type: 'json' },
    { name: 'status', type: 'select', options: [{ label: 'Drafted', value: 'drafted' }] },
  ],
  timestamps: true,
}
