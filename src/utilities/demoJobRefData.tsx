export type JobReference = {
  code: string
  projectName: string
  addresses: {
    title: string
    streetAddress: string
    suburb: string
    state: string
    stateAbbreviation: string
    postcode: string
    recipientName: string
    recipientMobile: number
  }[]
}

export function searchJobReferences(data: JobReference[], query: string): JobReference[] {
  const normalizedQuery = query.toLowerCase()

  return data.filter((job) => {
    const valuesToSearch: string[] = []

    const extractValues = (obj: any) => {
      if (typeof obj === 'string' || typeof obj === 'number') {
        valuesToSearch.push(String(obj).toLowerCase())
      } else if (Array.isArray(obj)) {
        obj.forEach(extractValues)
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(extractValues)
      }
    }

    extractValues(job)

    return valuesToSearch.some((value) => value.includes(normalizedQuery))
  })
}

export const jobReferences = [
  {
    code: '3568',
    projectName: 'Downtown Office Renovation',
    addresses: [
      {
        id: 'a1b2c',
        title: 'Map Building',
        streetAddress: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '4601',
        recipientName: 'Don Joe',
        recipientMobile: '+610401234567',
      },
      {
        id: 'd3e4f',
        title: 'Map Building',
        streetAddress: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '4601',
        recipientName: 'Don Joe',
        recipientMobile: '+610401234567',
      },
      {
        id: 'g5h6i',
        title: 'Sunrise Plaza',
        streetAddress: '45 King Street',
        suburb: 'Sydney',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '2000',
        recipientName: 'Don Joe',
        recipientMobile: '+610401234567',
      },
    ],
  },
  {
    code: '4921',
    projectName: 'Eastside Mall Extension',
    addresses: [
      {
        id: 'j7k8l',
        title: 'Sunrise Plaza',
        streetAddress: '45 King Street',
        suburb: 'Sydney',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '2000',
        recipientName: 'Jane Smith',
        recipientMobile: '+610412345678',
      },
      {
        id: 'm9n0o',
        title: 'Logistics Hub',
        streetAddress: '78 Industrial Rd',
        suburb: 'Brisbane',
        state: 'Queensland',
        stateAbbreviation: 'QLD',
        postcode: '4000',
        recipientName: 'Jane Smith',
        recipientMobile: '+610412345678',
      },
    ],
  },
  {
    code: '5782',
    projectName: 'Northern Warehouse Development',
    addresses: [
      {
        id: 'p1q2r',
        title: 'Logistics Hub',
        streetAddress: '78 Industrial Rd',
        suburb: 'Brisbane',
        state: 'Queensland',
        stateAbbreviation: 'QLD',
        postcode: '4000',
        recipientName: 'Alex Brown',
        recipientMobile: '+610423456789',
      },
    ],
  },
  {
    code: '6413',
    projectName: 'Southwest Residential Complex',
    addresses: [
      {
        id: 's3t4u',
        title: 'Willow Apartments',
        streetAddress: '91 Grove Lane',
        suburb: 'Adelaide',
        state: 'South Australia',
        stateAbbreviation: 'SA',
        postcode: '5000',
        recipientName: 'Chris Green',
        recipientMobile: '+610434567890',
      },
      {
        id: 'v5w6x',
        title: 'Map Building',
        streetAddress: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '4601',
        recipientName: 'Chris Green',
        recipientMobile: '+610434567890',
      },
      {
        id: 'y7z8a',
        title: 'Map Building',
        streetAddress: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '4601',
        recipientName: 'Chris Green',
        recipientMobile: '+610434567890',
      },
      {
        id: 'b9c0d',
        title: 'Sunrise Plaza',
        streetAddress: '45 King Street',
        suburb: 'Sydney',
        state: 'New South Wales',
        stateAbbreviation: 'NSW',
        postcode: '2000',
        recipientName: 'Chris Green',
        recipientMobile: '+610434567890',
      },
    ],
  },
  {
    code: '7205',
    projectName: 'Central Hospital Upgrade',
    addresses: [
      {
        id: 'e1f2g',
        title: 'HealthCare HQ',
        streetAddress: '16 Hospital Rd',
        suburb: 'Perth',
        state: 'Western Australia',
        stateAbbreviation: 'WA',
        postcode: '6000',
        recipientName: 'Pat Taylor',
        recipientMobile: '+610445678901',
      },
    ],
  },
  {
    code: '8390',
    projectName: 'City Park Redevelopment',
    addresses: [
      {
        id: 'h3i4j',
        title: 'Park Central',
        streetAddress: '2 Greenview Drive',
        suburb: 'Canberra',
        state: 'Australian Capital Territory',
        stateAbbreviation: 'ACT',
        postcode: '2600',
        recipientName: 'Jordan White',
        recipientMobile: '+610456789012',
      },
    ],
  },
  {
    code: '9102',
    projectName: 'University Science Building',
    addresses: [
      {
        id: 'k5l6m',
        title: 'Campus East',
        streetAddress: '89 Scholar Avenue',
        suburb: 'Hobart',
        state: 'Tasmania',
        stateAbbreviation: 'TAS',
        postcode: '7000',
        recipientName: 'Taylor Gray',
        recipientMobile: '+610467890123',
      },
    ],
  },
  {
    code: '1024',
    projectName: 'Airport Terminal Expansion',
    addresses: [
      {
        id: 'n7o8p',
        title: 'Terminal 2',
        streetAddress: '1 Airport Drive',
        suburb: 'Darwin',
        state: 'Northern Territory',
        stateAbbreviation: 'NT',
        postcode: '0800',
        recipientName: 'Morgan Black',
        recipientMobile: '+610478901234',
      },
    ],
  },
  {
    code: '1198',
    projectName: 'Seaside Hotel Renovation',
    addresses: [
      {
        id: 'q9r0s',
        title: 'Ocean View Resort',
        streetAddress: '12 Beachside Blvd',
        suburb: 'Gold Coast',
        state: 'Queensland',
        stateAbbreviation: 'QLD',
        postcode: '4217',
        recipientName: 'Jamie Lee',
        recipientMobile: '+610489012345',
      },
    ],
  },
  {
    code: '1275',
    projectName: 'Highway Overpass Construction',
    addresses: [
      {
        id: 't1u2v',
        title: 'West Junction',
        streetAddress: '450 Ring Road',
        suburb: 'Geelong',
        state: 'Victoria',
        stateAbbreviation: 'VIC',
        postcode: '3220',
        recipientName: 'Casey Ford',
        recipientMobile: '+610490123456',
      },
    ],
  },
]
