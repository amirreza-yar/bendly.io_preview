// 'use client'

import * as React from 'react'

import AdminDashboardCustomers from '../../(admin dashboard)/ff-admin/customer/page'
import CustomerDetails from '../../(admin dashboard)/ff-admin/customer/customerdetails/page'
import FlashingSVG from '@/components/utils/flashingSVG'

const test2 = [
  { node_id: '0ab2h6', left: 1350, top: 650, next_node_id: 'cy4wsx' },
  { node_id: 'cy4wsx', left: 1800, top: 1300, prev_node_id: '0ab2h6', next_node_id: 'oi3d54' },
  { node_id: 'oi3d54', left: 2400, top: 1200, prev_node_id: 'cy4wsx', next_node_id: 'bch84z' },
  { node_id: 'bch84z', left: 2250, top: 950, prev_node_id: 'oi3d54', next_node_id: 'ghmg13' },
  { node_id: 'ghmg13', left: 2050, top: 850, prev_node_id: 'bch84z' },
]

const flashing = {
  // nodes: [
  //   {
  //     node_id: 'gwomd9',
  //     left: 100,
  //     top: 350,
  //     next_node_id: '9rnao4',
  //   },
  //   {
  //     node_id: '9rnao4',
  //     left: 50,
  //     top: 500,
  //     prev_node_id: 'gwomd9',
  //     next_node_id: 'jeq3bi',
  //   },
  //   {
  //     node_id: 'jeq3bi',
  //     left: 150,
  //     top: 500,
  //     prev_node_id: '9rnao4',
  //     next_node_id: '6jagob',
  //   },
  //   {
  //     node_id: '6jagob',
  //     left: 200,
  //     top: 400,
  //     prev_node_id: 'jeq3bi',
  //     next_node_id: 'b7lk16',
  //   },
  //   {
  //     node_id: 'b7lk16',
  //     left: 150,
  //     top: 350,
  //     prev_node_id: '6jagob',
  //   },
  // ],
  // nodes: [
  //   { node_id: 'wgsx15', left: 300, top: 450, next_node_id: '99tko0' },
  //   { node_id: '99tko0', left: 200, top: 800, prev_node_id: 'wgsx15', next_node_id: 'bx148b' },
  //   { node_id: 'bx148b', left: 750, top: 950, prev_node_id: '99tko0', next_node_id: 'fx6vat' },
  //   { node_id: 'fx6vat', left: 750, top: 550, prev_node_id: 'bx148b', next_node_id: 'kyausl' },
  //   { node_id: 'kyausl', left: 650, top: 550, prev_node_id: 'fx6vat' },
  // ],
  nodes: [
    { node_id: '0ab2h6', left: 1350, top: 650, next_node_id: 'cy4wsx' },
    { node_id: 'cy4wsx', left: 1800, top: 1300, prev_node_id: '0ab2h6', next_node_id: 'oi3d54' },
    { node_id: 'oi3d54', left: 2400, top: 1200, prev_node_id: 'cy4wsx', next_node_id: 'bch84z' },
    { node_id: 'bch84z', left: 2250, top: 950, prev_node_id: 'oi3d54', next_node_id: 'ghmg13' },
    { node_id: 'ghmg13', left: 2050, top: 850, prev_node_id: 'bch84z' },
  ],
  startCrushFold: false,
  endCrushFold: false,
  crushFoldDir: false,
  material: 'Stainless steel',
  createdAt: 1755368254753,
  updatedAt: 1755368273619,
  isDraft: false,
  colorSideDirection: false,
  thickness: {
    code: 'SS304-08',
    thickness: 0.8,
  },
  crushFold: false,
  tapered: false,
  totalGirth: 441,
}

export default function test() {
  return (
    <>
      {/* <CustomerDetails /> */}
      <FlashingSVG className="h-20" flashing={flashing} />
    </>
  )
}
