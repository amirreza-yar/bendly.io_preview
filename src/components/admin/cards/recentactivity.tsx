'use client'

import React from 'react'
import { Factory, BoxDeliverd, Checked, Delivery } from '@/components/uikit/icons'

interface Activity {
  id: number
  icon: React.ComponentType<{ className?: string }>
  message: string
  timestamp: string
  by?: string
  bgColor: string
}

export default function RecentActivity() {
  const [activities, setActivities] = React.useState<Activity[]>([
    {
      id: 1,
      icon: Factory,
      message: 'Order 20250156 moved to Production',
      timestamp: '2 minutes ago',
      by: 'Farzam Azari',
      bgColor: '#FACCCC',
    },
    {
      id: 2,
      icon: BoxDeliverd,
      message: 'Order 20250158 ready for delivery',
      timestamp: '18 minutes ago',
      by: 'John Doe',
      bgColor: '#D9E2FF',
    },
    {
      id: 3,
      icon: Delivery,
      message: 'Order 20250159 shipped to customer',
      timestamp: '25 minutes ago',
      by: 'Emily Chen',
      bgColor: '#D9E2FF',
    },
    {
      id: 4,
      icon: Checked,
      message: 'Order 20250160 Completed',
      timestamp: '30 minutes ago',
      bgColor: '#D7F7E1',
    },
  ])

  return (
    <div className="w-[529px] h-[376px] bg-white mt-4">
      <h5 className="text-md py-6 pl-6">Recent Activity</h5>
      <div className="ml-6 h-[calc(376px-3.5rem)] overflow-y-auto space-y-5 pr-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className="border w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: activity.bgColor }}
            >
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-body m-0">{activity.message}</p>
              <p className="text-subtitle m-0">
                {activity.timestamp}
                {activity.by ? ` - By ${activity.by}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
