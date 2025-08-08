'use client'

import { useEffect, useState } from 'react'
import { listEntities, getEntity, createEntity, updateEntity, deleteEntity } from '@/lib/api'

const ENTITY = 'user'
const FIELDS = ['id', 'email', 'role', 'status']

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [newItem, setNewItem] = useState({ email: '', role: 'user', status: 'active' })

  async function refresh() {
    const data = await listEntities(ENTITY, FIELDS)
    setUsers(data[`list${ENTITY[0].toUpperCase() + ENTITY.slice(1)}s`] || [])
  }

  async function viewItem(id: string) {
    const data = await getEntity(ENTITY, id, FIELDS)
    setSelected(data[`get${ENTITY[0].toUpperCase() + ENTITY.slice(1)}`])
  }

  async function addItem() {
    await createEntity(ENTITY, newItem, FIELDS)
    setNewItem({ email: '', role: 'user', status: 'active' })
    refresh()
  }

  async function saveItem() {
    if (!selected?.id) return
    const { id, ...rest } = selected
    await updateEntity(ENTITY, id, rest, FIELDS)
    setSelected(null)
    refresh()
  }

  async function removeItem(id: string) {
    await deleteEntity(ENTITY, id)
    refresh()
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            {FIELDS.map((f) => (
              <th key={f} className="border p-2 text-left">
                {f}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              {FIELDS.map((f) => (
                <td key={f} className="border p-2">
                  {String(u[f])}
                </td>
              ))}
              <td className="border p-2">
                <button
                  onClick={() => viewItem(u.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeItem(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create */}
      <div className="p-4 border rounded space-y-2">
        <h2 className="font-semibold">Create User</h2>
        {FIELDS.filter((f) => f !== 'id').map((f) => (
          <input
            key={f}
            className="border p-2 w-full rounded"
            placeholder={f}
            value={(newItem as any)[f] || ''}
            onChange={(e) => setNewItem({ ...newItem, [f]: e.target.value })}
          />
        ))}
        <button onClick={addItem} className="px-4 py-2 bg-green-500 text-white rounded">
          Create
        </button>
      </div>

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow space-y-4 w-96">
            <h2 className="font-semibold text-lg">Edit User #{selected.id}</h2>
            {FIELDS.filter((f) => f !== 'id').map((f) => (
              <input
                key={f}
                className="border p-2 w-full rounded"
                value={selected[f] || ''}
                onChange={(e) => setSelected({ ...selected, [f]: e.target.value })}
              />
            ))}
            <div className="flex space-x-2">
              <button
                onClick={saveItem}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
