import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const PaymentHistory: CollectionConfig = {
  slug: 'paymenthistory',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['id', 'transactionId', 'totalPrice', 'date', 'method'],
  },
  fields: [
    { name: 'transactionId', type: 'text' },
    { name: 'totalPrice', type: 'number' },
    { name: 'date', type: 'date' },
    {
      name: 'method',
      type: 'select',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Bank', value: 'bank' },
        { label: 'Cash', value: 'cash' },
      ],
    },
  ],
  timestamps: true,
}
