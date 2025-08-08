import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const SupportRequests: CollectionConfig = {
  slug: 'supportrequests',
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
    { name: 'userId', type: 'relationship', relationTo: 'users' },
    { name: 'fullname', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'media', type: 'text' },
    { name: 'status', type: 'select', options: [{ label: 'Open', value: 'open' }, { label: 'Resolved', value: 'resolved' }] },
    { name: 'createdAt', type: 'date' },
  ],
  timestamps: true,
}