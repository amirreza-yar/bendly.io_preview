import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const AdjustRequests: CollectionConfig = {
  slug: 'adjustrequests',
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
    { name: 'orderId', type: 'relationship', relationTo: 'orders' },
    { name: 'items', type: 'text' },
    { name: 'reason', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'media', type: 'text' },
    { name: 'status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'Approved', value: 'approved' }, { label: 'Rejected', value: 'rejected' }] },
    { name: 'createdAt', type: 'date' },
  ],
  timestamps: true,
}