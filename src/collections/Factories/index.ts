import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Factories: CollectionConfig = {
  slug: 'factories',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'factoryId',
    defaultColumns: ['id', 'factoryId', 'name', 'createdAt', 'updatedAt'],
  },
  fields: [
    { name: 'factoryId', type: 'text' },
    { name: 'name', type: 'text' },
    {
      name: 'materials',
      type: 'array',
      fields: [
        { name: 'material', type: 'text' },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'value', type: 'text' },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'color',
              options: [
                { label: 'Color', value: 'color' },
                { label: 'Thickness', value: 'thickness' },
                { label: 'Other', value: 'other' },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
