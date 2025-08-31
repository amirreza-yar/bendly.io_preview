import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['id', 'name', 'type', 'factoryId', 'createdAt'],
    group: 'Admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'System Role', value: 'system' },
        { label: 'Factory Role', value: 'factory' },
        { label: 'Client Role', value: 'client' },
      ],
    },
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
    },
    {
      name: 'inheritsFrom',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        { name: 'canManageUsers', type: 'checkbox', defaultValue: false },
        { name: 'canManageRoles', type: 'checkbox', defaultValue: false },
        { name: 'canViewLogs', type: 'checkbox', defaultValue: false },
        { name: 'canExportData', type: 'checkbox', defaultValue: false },
        { name: 'canImportData', type: 'checkbox', defaultValue: false },
        { name: 'canManageSystem', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
  ],
  timestamps: true,
}
