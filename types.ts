
export enum UserRole {
  FACILITY = 'Facility EMTCT Focal Point',
  DISTRICT = 'District EMTCT Focal Point',
  ADMIN = 'System Admin'
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  facility: string | null;
  district: string | null;
  status: 'Active' | 'Inactive';
}

export interface Facility {
  name: string;
  code: string;
  district: string;
}

export interface District {
  name: string;
  province: string;
}

export interface InfantTest {
  dueDate: string;
  doneDate: string | null;
  result: 'Positive' | 'Negative' | 'Pending' | null;
}

export interface Infant {
  id: string;
  infantName: string;
  motherId: string;
  dob: string;
  facility: string;
  district: string;
  prophylaxis: 'NVP' | 'AZT/NVP' | 'Other' | 'None';
  status: 'Active' | 'Discharged' | 'Lost to Follow Up' | 'Deceased';
  pcr1: InfantTest;
  pcr2: InfantTest;
  antibody12mo: InfantTest;
  rapidTest18mo: InfantTest;
  antibody24mo: InfantTest;
  finalOutcome: 'Positive' | 'Negative' | 'Indeterminate' | null;
}

export interface AuditLogEntry {
  timestamp: string;
  user: string;
  infantId: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface DashboardStats {
  totalInfants: number;
  dueSoon: number;
  overdue: number;
  positivityRate: number;
}
