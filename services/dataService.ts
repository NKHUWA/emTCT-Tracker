
import { Infant, User, UserRole, DashboardStats, AuditLogEntry } from '../types';
import { generateInitialInfants } from '../constants';

class DataService {
  private infants: Infant[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    const savedInfants = localStorage.getItem('emtct_infants');
    if (savedInfants) {
      this.infants = JSON.parse(savedInfants);
    } else {
      this.infants = generateInitialInfants();
      this.saveInfants();
    }
  }

  private saveInfants() {
    localStorage.setItem('emtct_infants', JSON.stringify(this.infants));
  }

  getFilteredInfants(user: User): Infant[] {
    if (user.role === UserRole.ADMIN) {
      return this.infants;
    }
    if (user.role === UserRole.DISTRICT) {
      return this.infants.filter(i => i.district === user.district);
    }
    if (user.role === UserRole.FACILITY) {
      return this.infants.filter(i => i.facility === user.facility);
    }
    return [];
  }

  updateInfant(user: User, infantId: string, updates: Partial<Infant>) {
    const idx = this.infants.findIndex(i => i.id === infantId);
    if (idx === -1) return;

    const current = this.infants[idx];
    
    if (user.role === UserRole.FACILITY && current.facility !== user.facility) return;
    if (user.role === UserRole.DISTRICT && current.district !== user.district) return;

    Object.keys(updates).forEach((key) => {
      const field = key as keyof Infant;
      const oldValue = JSON.stringify(current[field]);
      const newValue = JSON.stringify(updates[field]);
      
      if (oldValue !== newValue) {
        this.auditLogs.push({
          timestamp: new Date().toISOString(),
          user: user.email,
          infantId: current.id,
          field,
          oldValue,
          newValue
        });
      }
    });

    this.infants[idx] = { ...current, ...updates };
    this.saveInfants();
  }

  getDashboardStats(user: User): DashboardStats {
    const filtered = this.getFilteredInfants(user);
    const today = new Date();
    
    let dueSoon = 0;
    let overdue = 0;
    let positives = 0;
    let totalTested = 0;

    filtered.forEach(i => {
      const tests = [i.pcr1, i.pcr2, i.antibody12mo, i.rapidTest18mo, i.antibody24mo];
      tests.forEach(t => {
        if (!t.doneDate) {
          const dueDate = new Date(t.dueDate);
          const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 0) overdue++;
          else if (diffDays <= 14) dueSoon++; // Increased window for reminder awareness
        } else {
          totalTested++;
          if (t.result === 'Positive') positives++;
        }
      });
    });

    return {
      totalInfants: filtered.length,
      dueSoon,
      overdue,
      positivityRate: totalTested > 0 ? (positives / totalTested) * 100 : 0
    };
  }

  registerInfant(user: User, infant: Omit<Infant, 'id' | 'district' | 'facility'>) {
    if (!user.facility && user.role === UserRole.FACILITY) return;
    
    const newId = `INF-${Math.floor(Math.random() * 9000) + 1000}`;
    const fullInfant: Infant = {
      ...infant,
      id: newId,
      facility: user.facility || 'Central Hub',
      district: user.district || 'National',
    };

    this.infants.push(fullInfant);
    this.saveInfants();
    return fullInfant;
  }
}

export const dataService = new DataService();
