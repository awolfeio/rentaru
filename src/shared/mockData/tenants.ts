import { Tenant } from '@/shared/types/tenant';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0101',
    propertyId: 'p1',
    propertyName: 'Oak Street Apartments',
    unitId: 'u6',
    unitNumber: '3B',
    leaseStatus: 'active',
    leaseStartDate: '2023-02-15',
    leaseEndDate: '2024-02-15',
    moveInDate: '2023-02-15',
    rentAmount: 1450,
    rentStatus: 'overdue',
    balance: 1450,
    autopayEnabled: false,
    paymentMethod: 'ach',
    maintenanceRequestCount: 1,
    lastMaintenanceRequestDate: '2024-01-05',
    communicationStatus: 'responsive',
    portalStatus: 'accepted',
    documentStatus: 'complete',
    tags: ['renewal_risk'],
    vehicles: [
      {
        id: 't1-v1',
        title: 'Tesla Model 3',
        year: 2022,
        color: 'Pearl White',
        licensePlate: '8JSM102',
        powertrain: 'electric',
        parkingAssignment: 'covered_carport'
      },
      {
        id: 't1-v2',
        title: 'Honda CR-V',
        year: 2019,
        color: 'Slate Gray',
        licensePlate: '7QKP441',
        powertrain: 'non_electric',
        parkingAssignment: 'parking_garage'
      }
    ],
    insurancePolicies: [
      {
        id: 't1-i1',
        policyNumber: 'RS-481920',
        provider: 'State Farm',
        coverageStartDate: '2024-01-01',
        coverageEndDate: '2024-12-31',
        liabilityNumbers: ['Bodily Injury: $100,000 / $300,000', 'Property Damage: $50,000']
      }
    ],
    createdAt: '2023-02-01'
  },
  {
    id: 't2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    propertyId: 'p2',
    propertyName: 'Highland Lofts',
    unitId: 'u8',
    unitNumber: '102',
    leaseStatus: 'active',
    leaseStartDate: '2023-08-01',
    leaseEndDate: '2024-08-01',
    rentAmount: 2300,
    rentStatus: 'paid',
    balance: 0,
    autopayEnabled: true,
    paymentMethod: 'credit_card',
    lastPaymentDate: '2024-01-01',
    maintenanceRequestCount: 0,
    communicationStatus: 'responsive',
    portalStatus: 'accepted',
    documentStatus: 'complete',
    tags: ['vip'],
    vehicles: [
      {
        id: 't2-v1',
        title: 'BMW i4',
        year: 2023,
        color: 'Black Sapphire',
        licensePlate: '9MCH288',
        powertrain: 'electric',
        parkingAssignment: 'covered_carport'
      }
    ],
    insurancePolicies: [
      {
        id: 't2-i1',
        policyNumber: 'AL-992184',
        provider: 'Allstate',
        coverageStartDate: '2024-02-01',
        coverageEndDate: '2025-01-31',
        liabilityNumbers: ['Bodily Injury: $250,000 / $500,000', 'Property Damage: $100,000']
      }
    ],
    createdAt: '2023-07-15'
  },
  {
    id: 't3',
    name: 'Sarah Johnson',
    email: 's.johnson@example.com',
    propertyId: 'p2',
    propertyName: 'Highland Lofts',
    unitId: 'u10',
    unitNumber: '201',
    leaseStatus: 'month_to_month',
    leaseStartDate: '2023-06-30',
    leaseEndDate: '2024-06-30', // Originally 1 year, now MTM potentially
    rentAmount: 2100,
    rentStatus: 'partial',
    balance: 450,
    autopayEnabled: false,
    paymentMethod: 'ach',
    lastPaymentDate: '2024-01-03',
    maintenanceRequestCount: 0,
    communicationStatus: 'unread',
    portalStatus: 'invited',
    documentStatus: 'complete',
    tags: [],
    vehicles: [
      {
        id: 't3-v1',
        title: 'Toyota Corolla',
        year: 2020,
        color: 'Silver',
        licensePlate: '8SJH564',
        powertrain: 'non_electric',
        parkingAssignment: 'unassigned_open_lot_parking'
      }
    ],
    insurancePolicies: [
      {
        id: 't3-i1',
        policyNumber: 'GE-105721',
        provider: 'GEICO',
        coverageStartDate: '2023-11-15',
        coverageEndDate: '2024-11-14',
        liabilityNumbers: ['Bodily Injury: $50,000 / $100,000', 'Property Damage: $50,000']
      }
    ],
    createdAt: '2023-06-15'
  },
  {
    id: 't4',
    name: 'David Wilson',
    email: 'dwilson@example.com',
    propertyId: 'p3',
    propertyName: 'Sunset Duplex',
    unitId: 'u11',
    unitNumber: 'A',
    leaseStatus: 'active',
    leaseStartDate: '2023-11-15',
    leaseEndDate: '2024-11-15',
    rentAmount: 1850,
    rentStatus: 'paid',
    balance: 0,
    autopayEnabled: true,
    paymentMethod: 'check',
    lastPaymentDate: '2024-01-01',
    maintenanceRequestCount: 2,
    lastMaintenanceRequestDate: '2023-12-28',
    communicationStatus: 'responsive',
    portalStatus: 'accepted',
    documentStatus: 'complete',
    tags: ['maintenance_heavy'],
    vehicles: [
      {
        id: 't4-v1',
        title: 'Ford F-150',
        year: 2021,
        color: 'Oxford White',
        licensePlate: '7DWL903',
        powertrain: 'non_electric',
        parkingAssignment: 'oversized_vehicle'
      }
    ],
    insurancePolicies: [
      {
        id: 't4-i1',
        policyNumber: 'PR-664810',
        provider: 'Progressive',
        coverageStartDate: '2024-03-01',
        coverageEndDate: '2025-02-28',
        liabilityNumbers: ['Bodily Injury: $100,000 / $300,000', 'Property Damage: $100,000']
      }
    ],
    createdAt: '2023-11-01'
  },
  {
    id: 't5',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    propertyId: 'p1',
    propertyName: 'Oak Street Apartments',
    unitId: 'u1',
    unitNumber: '1A',
    leaseStatus: 'renewal_pending',
    leaseStartDate: '2023-03-01',
    leaseEndDate: '2024-03-01',
    rentAmount: 1200,
    rentStatus: 'paid',
    balance: 0,
    autopayEnabled: true,
    paymentMethod: 'ach',
    lastPaymentDate: '2024-01-02',
    maintenanceRequestCount: 0,
    communicationStatus: 'responsive',
    portalStatus: 'accepted',
    documentStatus: 'lease_signed',
    tags: [],
    vehicles: [
      {
        id: 't5-v1',
        title: 'Nissan Leaf',
        year: 2022,
        color: 'Glacier White',
        licensePlate: '8EMD225',
        powertrain: 'electric',
        parkingAssignment: 'parking_garage'
      }
    ],
    insurancePolicies: [
      {
        id: 't5-i1',
        policyNumber: 'LI-550293',
        provider: 'Liberty Mutual',
        coverageStartDate: '2024-01-20',
        coverageEndDate: '2025-01-19',
        liabilityNumbers: ['Bodily Injury: $100,000 / $300,000', 'Property Damage: $50,000']
      }
    ],
    createdAt: '2023-02-20'
  },
  {
    id: 't6',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    propertyId: 'p1',
    propertyName: 'Oak Street Apartments',
    unitId: 'u2',
    unitNumber: '1B',
    leaseStatus: 'active',
    leaseStartDate: '2023-09-01',
    leaseEndDate: '2024-09-01',
    rentAmount: 1350,
    rentStatus: 'credit',
    balance: -50,
    autopayEnabled: true,
    paymentMethod: 'ach',
    maintenanceRequestCount: 0,
    communicationStatus: 'responsive',
    portalStatus: 'accepted',
    documentStatus: 'complete',
    tags: [],
    vehicles: [
      {
        id: 't6-v1',
        title: 'Subaru Outback',
        year: 2018,
        color: 'Forest Green',
        licensePlate: '7RBB119',
        powertrain: 'non_electric',
        parkingAssignment: 'tandem_parking'
      }
    ],
    insurancePolicies: [
      {
        id: 't6-i1',
        policyNumber: 'FA-338204',
        provider: 'Farmers',
        coverageStartDate: '2024-04-10',
        coverageEndDate: '2025-04-09',
        liabilityNumbers: ['Bodily Injury: $100,000 / $300,000', 'Property Damage: $50,000']
      }
    ],
    createdAt: '2023-08-15'
  },
  {
    id: 't7',
    name: 'Jennifer Wu',
    email: 'j.wu@example.com',
    propertyId: 'p2',
    propertyName: 'Highland Lofts',
    unitId: 'u7',
    unitNumber: '101',
    leaseStatus: 'pending_move_in',
    leaseStartDate: '2024-02-01',
    leaseEndDate: '2025-02-01',
    rentAmount: 2250,
    rentStatus: 'paid', // Deposit paid
    balance: 0,
    autopayEnabled: false,
    maintenanceRequestCount: 0,
    communicationStatus: 'responsive',
    portalStatus: 'invited',
    documentStatus: 'missing_docs',
    tags: ['new_tenant'],
    vehicles: [
      {
        id: 't7-v1',
        title: 'Hyundai Ioniq 5',
        year: 2024,
        color: 'Digital Teal',
        licensePlate: '9JWU611',
        powertrain: 'electric',
        parkingAssignment: 'covered_carport'
      }
    ],
    insurancePolicies: [
      {
        id: 't7-i1',
        policyNumber: 'TR-814509',
        provider: 'Travelers',
        coverageStartDate: '2024-02-01',
        coverageEndDate: '2025-01-31',
        liabilityNumbers: ['Bodily Injury: $100,000 / $300,000', 'Property Damage: $100,000']
      }
    ],
    createdAt: '2024-01-20'
  },
  {
    id: 't8',
    name: 'Kevin O\'Connell',
    email: 'kevin.o@example.com',
    propertyId: 'p3',
    propertyName: 'Sunset Duplex',
    unitId: 'u12',
    unitNumber: 'B',
    leaseStatus: 'eviction',
    leaseStartDate: '2022-05-01',
    leaseEndDate: '2023-05-01', // Held over
    rentAmount: 1900,
    rentStatus: 'overdue',
    balance: 5700, // 3 months
    autopayEnabled: false,
    paymentMethod: 'other',
    maintenanceRequestCount: 5,
    communicationStatus: 'unresponsive',
    portalStatus: 'disabled',
    documentStatus: 'complete',
    tags: ['high_risk', 'legal'],
    vehicles: [
      {
        id: 't8-v1',
        title: 'Chevrolet Malibu',
        year: 2017,
        color: 'Navy Blue',
        licensePlate: '6KOC778',
        powertrain: 'non_electric',
        parkingAssignment: 'motorcycle'
      }
    ],
    insurancePolicies: [
      {
        id: 't8-i1',
        policyNumber: 'NA-207734',
        provider: 'Nationwide',
        coverageStartDate: '2023-09-01',
        coverageEndDate: '2024-08-31',
        liabilityNumbers: ['Bodily Injury: $50,000 / $100,000', 'Property Damage: $25,000']
      }
    ],
    createdAt: '2022-04-15'
  }
];
