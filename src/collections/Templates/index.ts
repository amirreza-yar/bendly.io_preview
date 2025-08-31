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
    useAsTitle: 'name',
    defaultColumns: ['id', 'name', 'scope', 'createdAt'],
  },
  fields: [
    { name: 'flashingId', type: 'relationship', relationTo: 'flashings' },
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    {
      name: 'tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text' },
      ],
    },
    {
      name: 'scope',
      type: 'select',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Shared', value: 'shared' },
        { label: 'App', value: 'app' },
      ],
    },
    { name: 'name', type: 'text' },
    {
      name: 'accessStats',
      type: 'group',
      fields: [
        { name: 'usageCount', type: 'number' },
        { name: 'lastAccessed', type: 'date' },
      ],
    },
  ],
  timestamps: true,
}
