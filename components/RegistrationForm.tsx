
import React, { useState } from 'react';
import { User, UserRole, InfantTest } from '../types';
import { dataService } from '../services/dataService';

interface RegistrationFormProps {
  user: User;
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    infantName: '',
    motherId: '',
    dob: '',
    prophylaxis: 'NVP' as any,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dob = new Date(formData.dob);
    const calcDate = (days: number) => {
      const d = new Date(dob);
      d.setDate(dob.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    dataService.registerInfant(user, {
      ...formData,
      status: 'Active',
      pcr1: { dueDate: calcDate(42), doneDate: null, result: null },
      pcr2: { dueDate: calcDate(270), doneDate: null, result: null },
      antibody12mo: { dueDate: calcDate(365), doneDate: null, result: null },
      rapidTest18mo: { dueDate: calcDate(540), doneDate: null, result: null },
      antibody24mo: { dueDate: calcDate(730), doneDate: null, result: null },
      finalOutcome: null,
    });

    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Register Exposed Infant</h3>
        <p className="text-sm text-gray-500">Capture initial infant details and auto-generate the complete 24-month testing schedule.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Infant Name</label>
            <input
              required
              type="text"
              value={formData.infantName}
              onChange={(e) => setFormData({ ...formData, infantName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mother/Caregiver ID</label>
            <input
              required
              type="text"
              value={formData.motherId}
              onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="National ID / Hospital ID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
            <input
              required
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">ARV Prophylaxis</label>
            <select
              value={formData.prophylaxis}
              onChange={(e) => setFormData({ ...formData, prophylaxis: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NVP">Daily NVP</option>
              <option value="AZT/NVP">AZT + NVP (High Risk)</option>
              <option value="Other">Other</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Automated Testing Milestones
          </p>
          <ul className="mt-2 text-xs text-blue-600 grid grid-cols-2 gap-x-4 gap-y-1 list-disc list-inside">
            <li>PCR 1 (6 Weeks)</li>
            <li>PCR 2 (9 Months)</li>
            <li>Antibody Test (12 Months)</li>
            <li>Rapid Antibody (18 Months)</li>
            <li>Antibody Test (24 Months)</li>
            <li>Final Conclusion (24 Months)</li>
          </ul>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
          >
            Confirm & Register Infant
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
