import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['fullname', 'email', 'role', 'status'],
    useAsTitle: 'fullname',
    group: 'Admin',
  },
  fields: [
    { name: 'fullname', type: 'text', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Factory', value: 'factory' },
        { label: 'Superadmin', value: 'superadmin' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Deactivated', value: 'deactivated' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'measurementMode',
          type: 'select',
          options: [
            { label: 'Metric', value: 'metric' },
            { label: 'Imperial', value: 'imperial' },
          ],
        },
        {
          name: 'uiPrefs',
          type: 'group',
          fields: [
            { name: 'dashboardLayout', type: 'text' },
            { name: 'tipsEnabled', type: 'checkbox' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
