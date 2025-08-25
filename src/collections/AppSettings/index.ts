import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const AppSettings: CollectionConfig = {
  slug: 'appsettings',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'GroupSetting',
    defaultColumns: ['GroupSetting', 'createdAt', 'updatedAt'],
  },
  fields: [
    {
      name: 'GroupSetting',
      type: 'text',
      required: true,
    },
    {
      name: 'settings',
      type: 'array',
      fields: [
        {
          name: 'settingName',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'json',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
