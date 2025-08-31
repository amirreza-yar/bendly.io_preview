import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['id', 'name', 'resource', 'action', 'createdAt'],
    group: 'Admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'text' },
    {
      name: 'resource',
      type: 'select',
      required: true,
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Flashings', value: 'flashings' },
        { label: 'Templates', value: 'templates' },
        { label: 'Job References', value: 'jobreferences' },
        { label: 'Orders', value: 'orders' },
        { label: 'Factories', value: 'factories' },
        { label: 'Support Requests', value: 'supportrequests' },
        { label: 'Adjust Requests', value: 'adjustrequests' },
        { label: 'App Settings', value: 'appsettings' },
        { label: 'Payment History', value: 'paymenthistory' },
        { label: 'Logs', value: 'logs' },
        { label: 'Permissions', value: 'permissions' },
        { label: 'Roles', value: 'roles' },
        { label: 'System', value: 'system' },
      ],
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Read', value: 'read' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'List', value: 'list' },
        { label: 'Approve', value: 'approve' },
        { label: 'Reject', value: 'reject' },
        { label: 'Export', value: 'export' },
        { label: 'Import', value: 'import' },
        { label: 'Manage', value: 'manage' },
      ],
    },
    {
      name: 'conditions',
      type: 'group',
      fields: [
        { name: 'ownDataOnly', type: 'checkbox', defaultValue: false },
        { name: 'factoryOnly', type: 'checkbox', defaultValue: false },
        { name: 'statusFilter', type: 'text' },
        { name: 'dateRange', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
