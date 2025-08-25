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
    useAsTitle: 'requestId',
    defaultColumns: ['requestId', 'orderId', 'status', 'createdAt'],
  },
  fields: [
    { name: 'requestId', type: 'text', unique: true },
    { name: 'orderId', type: 'relationship', relationTo: 'orders' },
    { name: 'items', type: 'text' },
    { name: 'reason', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'media', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
  timestamps: true,
}
