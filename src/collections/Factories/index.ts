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
        { name: 'materialProperty', type: 'text' },
        {
          name: 'thicknessOptions',
          type: 'array',
          fields: [
            { name: 'thickness', type: 'number' },
          ],
        },
        {
          name: 'otherProps',
          type: 'group',
          fields: [
            { name: 'key', type: 'text' },
            { name: 'value', type: 'text' },
          ],
        },
      ],
    },

  ],
  timestamps: true,
}
