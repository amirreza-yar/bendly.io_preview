import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Flashings: CollectionConfig = {
  slug: 'flashings',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'flashingId',
    defaultColumns: ['id', 'flashingId', 'ownerId', 'status', 'createdAt'],
  },
  fields: [
    { name: 'flashingId', type: 'text', required: true },
    { name: 'ownerId', type: 'relationship', relationTo: 'users' },
    {
      name: 'data',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'nodes',
          type: 'array',
          fields: [
            { name: 'node_id', type: 'text' },
            { name: 'left', type: 'number' },
            { name: 'top', type: 'number' },
            { name: 'next_node_id', type: 'text' },
            { name: 'prev_node_id', type: 'text' },
            { name: 'next_line_bside_length', type: 'number' },
          ],
        },
        { name: 'startCrushFold', type: 'checkbox' },
        { name: 'endCrushFold', type: 'checkbox' },
        { name: 'crushFoldDir', type: 'checkbox' },
        { name: 'material', type: 'text' },
        {
          name: 'color',
          type: 'group',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'code', type: 'text' },
          ],
        },
        {
          name: 'thickness',
          type: 'group',
          fields: [
            { name: 'code', type: 'text' },
            { name: 'thickness', type: 'number' },
          ],
        },
        { name: 'isDraft', type: 'checkbox' },
        { name: 'colorSideDirection', type: 'checkbox' },
        { name: 'crushFold', type: 'checkbox' },
        { name: 'tapered', type: 'checkbox' },
        { name: 'totalGirth', type: 'number' },
        { name: 'orderIdToBeSaved', type: 'text' },
      ],
    },
    {
      name: 'revisions',
      type: 'array',
      fields: [
        { name: 'revisionId', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'timestamp', type: 'date' },
        {
          name: 'data',
          type: 'group',
          fields: [
            {
              name: 'nodes',
              type: 'array',
              fields: [
                { name: 'node_id', type: 'text' },
                { name: 'left', type: 'number' },
                { name: 'top', type: 'number' },
                { name: 'next_node_id', type: 'text' },
                { name: 'prev_node_id', type: 'text' },
                { name: 'next_line_bside_length', type: 'number' },
              ],
            },
            { name: 'startCrushFold', type: 'checkbox' },
            { name: 'endCrushFold', type: 'checkbox' },
            { name: 'crushFoldDir', type: 'checkbox' },
            { name: 'material', type: 'text' },
            {
              name: 'color',
              type: 'group',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'code', type: 'text' },
              ],
            },
            {
              name: 'thickness',
              type: 'group',
              fields: [
                { name: 'code', type: 'text' },
                { name: 'thickness', type: 'number' },
              ],
            },
            { name: 'isDraft', type: 'checkbox' },
            { name: 'colorSideDirection', type: 'checkbox' },
          ],
        },
      ],
    },
    // { name: 'status', type: 'select', options: [{ label: 'Drafted', value: 'drafted' }] },
  ],
  timestamps: true,
}
