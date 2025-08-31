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
        { label: 'User', value: 'user' },
        { label: 'Flashing', value: 'flashing' },
        { label: 'Template', value: 'template' },
        { label: 'JobReference', value: 'jobreference' },
        { label: 'Order', value: 'order' },
        { label: 'Factory', value: 'factory' },
        { label: 'SupportRequest', value: 'supportrequest' },
        { label: 'AdjustRequest', value: 'adjustrequest' },
        { label: 'AppSettings', value: 'appsettings' },
        { label: 'PaymentHistory', value: 'paymenthistory' },
        { label: 'System', value: 'system' },
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
