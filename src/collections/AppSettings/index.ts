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
    useAsTitle: 'groupName',
    defaultColumns: ['id', 'groupName', 'createdAt'],
    group: 'System',
  },
  fields: [
    {
      name: 'groupName',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Setting group scope (e.g., materialOptions, foldStyles)'
      }
    },
    {
      name: 'settings',
      type: 'array',
      fields: [
        { 
          name: 'key', 
          type: 'text',
          required: true,
          admin: {
            description: 'Setting key name'
          }
        },
        { 
          name: 'blockType', 
          type: 'select',
          required: true,
          options: [
            { label: 'Boolean', value: 'boolean' },
            { label: 'String', value: 'string' },
            { label: 'Number', value: 'number' },
            { label: 'JSON', value: 'json' },
            { label: 'Array', value: 'array' }
          ],
          admin: {
            description: 'Setting value type'
          }
        },
        { 
          name: 'value', 
          type: 'text',
          required: true,
          validate: (value: string | null | undefined, { siblingData }: { siblingData?: { blockType?: string } }) => {
            if (!value) return 'Value is required'
            
            switch (siblingData?.blockType) {
              case 'boolean':
                if (!['true', 'false', '0', '1'].includes(value.toLowerCase())) {
                  return 'Boolean value must be true, false, 0, or 1'
                }
                break
              case 'number':
                if (isNaN(Number(value))) {
                  return 'Value must be a valid number'
                }
                break
              case 'json':
                try {
                  JSON.parse(value)
                } catch {
                  return 'Value must be valid JSON'
                }
                break
              case 'array':
                // Arrays are comma-separated strings
                break
              case 'string':
                // Any string is valid
                break
            }
            return true
          },
          admin: {
            description: 'Setting value (format depends on type)'
          }
        }
      ],
      admin: {
        description: 'Dynamic key-value pairs for this group'
      }
    },
  ],
  timestamps: true,
}
