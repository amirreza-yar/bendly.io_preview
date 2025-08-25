import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Logs: CollectionConfig = {
  slug: 'logs',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'entityId',
    defaultColumns: ['id', 'entityType', 'entityId', 'action', 'performedBy', 'timestamp'],
  },
  fields: [
    {
      name: 'entityType',
      type: 'select',
      options: [
        { label: 'Order', value: 'order' },
        { label: 'Request', value: 'request' },
        { label: 'Flashing', value: 'flashing' },
      ],
    },
    { name: 'entityId', type: 'text' },
    { name: 'action', type: 'text' },
    { name: 'performedBy', type: 'relationship', relationTo: 'users' },
    { name: 'timestamp', type: 'date' },
    { name: 'notes', type: 'text' },
  ],
  timestamps: true,
}
