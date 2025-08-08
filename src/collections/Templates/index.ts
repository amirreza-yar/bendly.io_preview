import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Templates: CollectionConfig = {
  slug: 'templates',
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
    { name: 'flashingId', type: 'relationship', relationTo: 'flashings' },
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    { name: 'tags', type: 'text' },
    { name: 'scope', type: 'select', options: [{ label: 'Private', value: 'private' }, { label: 'Shared', value: 'shared' }, { label: 'App', value: 'app' }] },
    { name: 'name', type: 'text' },
    { name: 'accessStats', type: 'group', fields: [
      { name: 'usageCount', type: 'number' },
      { name: 'lastAccessed', type: 'date' },
    ] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
  timestamps: true,
}