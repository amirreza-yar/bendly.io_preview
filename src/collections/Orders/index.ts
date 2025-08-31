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
    useAsTitle: 'orderNumber',
    defaultColumns: ['id', 'orderNumber', 'clientId', 'status', 'price.orderTotal'],
  },
  fields: [
    { name: 'orderNumber', type: 'text' },
    { name: 'clientId', type: 'relationship', relationTo: 'users' },
    { name: 'jobReferenceId', type: 'relationship', relationTo: 'jobreferences' },
    { name: 'projectName', type: 'text' },
    {
      name: 'delivery',
      type: 'group',
      fields: [
        { name: 'date', type: 'date' },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Delivery', value: 'delivery' },
            { label: 'Pickup', value: 'pickup' },
          ],
        },
        { name: 'address', type: 'text' },
        {
          name: 'driver',
          type: 'group',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'contact', type: 'text' },
          ],
        },
        { name: 'id', type: 'text' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'flashingId', type: 'relationship', relationTo: 'flashings' },
        {
          name: 'material',
          type: 'group',
          fields: [
            { name: 'type', type: 'text' },
            { name: 'property', type: 'text' },
          ],
        },
        { name: 'thickness', type: 'number' },
        { name: 'girth', type: 'number' },
        { name: 'tapered', type: 'checkbox' },
        { name: 'crushfold', type: 'checkbox' },
        { name: 'code', type: 'text' },
        { name: 'position', type: 'text' },
        {
          name: 'subItems',
          type: 'array',
          fields: [
            { name: 'quantity', type: 'number' },
            { name: 'length', type: 'number' },
            { name: 'price', type: 'number' },
          ],
        },
        { name: 'itemTotal', type: 'number' },
      ],
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        { name: 'itemsTotal', type: 'number' },
        { name: 'tax', type: 'number' },
        { name: 'delivery', type: 'number' },
        { name: 'orderTotal', type: 'number' },
      ],
    },
    { name: 'paymentHistory', type: 'relationship', relationTo: 'paymenthistory' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In-Progress', value: 'in-progress' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Indexed', value: 'indexed' },
      ],
    },
  ],
  timestamps: true,
}
