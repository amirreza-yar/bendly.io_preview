import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
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
    { name: 'orderNumber', type: 'text' },
    { name: 'clientId', type: 'relationship', relationTo: 'users' },
    { name: 'jobReferenceId', type: 'relationship', relationTo: 'jobreferences' },
    { name: 'projectName', type: 'text' },
    { name: 'deliveryDate', type: 'date' },
    { name: 'deliveryType', type: 'select', options: [{ label: 'Delivery', value: 'delivery' }, { label: 'Pickup', value: 'pickup' }] },
    { name: 'deliveryAddress', type: 'text' },
    { name: 'driver', type: 'group', fields: [
      { name: 'name', type: 'text' },
      { name: 'contact', type: 'text' },
    ] },
    { name: 'deliveryId', type: 'text' },
    { name: 'items', type: 'array', fields: [] },
    { name: 'price', type: 'group', fields: [
      { name: 'itemsTotal', type: 'number' },
      { name: 'tax', type: 'number' },
      { name: 'delivery', type: 'number' },
      { name: 'orderTotal', type: 'number' },
    ] },
    { name: 'paymentHistory', type: 'relationship', relationTo: 'paymenthistory' },
    { name: 'status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'In-Progress', value: 'in-progress' }, { label: 'Delivered', value: 'delivered' }, { label: 'Cancelled]', value: 'cancelled]' }, { label: 'Indexed', value: 'indexed' }] },
    { name: 'metadata', type: 'group', fields: [
      { name: 'createdAt', type: 'date' },
      { name: 'updatedAt', type: 'date' },
    ] },
  ],
  timestamps: true,
}