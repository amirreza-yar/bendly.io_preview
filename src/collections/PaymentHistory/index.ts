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
    useAsTitle: '_id',
    defaultColumns: ['_id'],
  },
  fields: [
    { name: '_id', type: 'text' },
    { name: 'transactionId', type: 'text' },
    { name: 'totalPrice', type: 'number' },
    { name: 'date', type: 'date' },
    { name: 'method', type: 'select', options: [{ label: 'Card', value: 'card' }, { label: 'Bank', value: 'bank' }, { label: 'Cash', value: 'cash' }] },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
  timestamps: true,
}