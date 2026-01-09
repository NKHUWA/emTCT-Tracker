
import { UserRole, User, Facility, District, Infant } from './types';

export const MOCK_FACILITIES: Facility[] = [
  { name: 'Kibuli Health Centre', code: 'KH-001', district: 'Kampala' },
  { name: 'Mulago Hospital', code: 'MH-002', district: 'Kampala' },
  { name: 'Entebbe General', code: 'EG-003', district: 'Wakiso' },
  { name: 'Kira Health Clinic', code: 'KC-004', district: 'Wakiso' },
];

export const MOCK_DISTRICTS: District[] = [
  { name: 'Kampala', province: 'Central' },
  { name: 'Wakiso', province: 'Central' },
];

export const MOCK_USERS: User[] = [
  {
    email: 'admin@emtct.gov',
    name: 'Sarah Drasner',
    role: UserRole.ADMIN,
    facility: null,
    district: null,
    status: 'Active',
  },
  {
    email: 'kampala.lead@emtct.gov',
    name: 'John Doe',
    role: UserRole.DISTRICT,
    facility: null,
    district: 'Kampala',
    status: 'Active',
  },
  {
    email: 'kibuli.focal@emtct.gov',
    name: 'Mary Jane',
    role: UserRole.FACILITY,
    facility: 'Kibuli Health Centre',
    district: 'Kampala',
    status: 'Active',
  },
];

export const generateInitialInfants = (): Infant[] => {
  const infants: Infant[] = [];
  const facilities = MOCK_FACILITIES;
  const today = new Date();

  for (let i = 1; i <= 20; i++) {
    const fIdx = Math.floor(Math.random() * facilities.length);
    const facility = facilities[fIdx];
    const dob = new Date();
    // Generate DOBs spread across last 30 months to see different stages
    dob.setDate(today.getDate() - (Math.floor(Math.random() * 900))); 

    const calcDate = (days: number) => {
      const d = new Date(dob);
      d.setDate(dob.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    infants.push({
      id: `INF-${1000 + i}`,
      infantName: `Infant ${i}`,
      motherId: `MOM-${2000 + i}`,
      dob: dob.toISOString().split('T')[0],
      facility: facility.name,
      district: facility.district,
      prophylaxis: 'NVP',
      status: 'Active',
      pcr1: { dueDate: calcDate(42), doneDate: null, result: null },
      pcr2: { dueDate: calcDate(270), doneDate: null, result: null },
      antibody12mo: { dueDate: calcDate(365), doneDate: null, result: null },
      rapidTest18mo: { dueDate: calcDate(540), doneDate: null, result: null },
      antibody24mo: { dueDate: calcDate(730), doneDate: null, result: null },
      finalOutcome: null,
    });
  }
  return infants;
};
