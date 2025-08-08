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
    useAsTitle: '_id',
    defaultColumns: ['_id'],
  },
  fields: [
    { name: '_id', type: 'text' },
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    { name: 'code', type: 'text' },
    { name: 'projectName', type: 'text' },
    { name: 'address', type: 'group', fields: [
      { name: 'street', type: 'text' },
      { name: 'suburb', type: 'text' },
      { name: 'state', type: 'text' },
      { name: 'postcode', type: 'text' },
      { name: 'addressName', type: 'text' },
    ] },
    { name: 'recipient', type: 'group', fields: [
      { name: 'name', type: 'text' },
      { name: 'phone', type: 'text' },
    ] },
    { name: 'createdAt', type: 'date' },
  ],
  timestamps: true,
}