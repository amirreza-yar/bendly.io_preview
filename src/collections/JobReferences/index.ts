import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const JobReferences: CollectionConfig = {
  slug: 'jobreferences',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['id', 'code', 'ownerId', 'projectName'],
  },
  fields: [
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    { name: 'code', type: 'text' },
    { name: 'projectName', type: 'text' },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'suburb', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'postcode', type: 'text' },
        { name: 'addressName', type: 'text' },
      ],
    },
    {
      name: 'recipients',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
