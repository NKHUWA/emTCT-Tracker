
import React, { useState } from 'react';
import { User, UserRole, Infant } from '../types';
import { dataService } from '../services/dataService';

interface InfantListProps {
  user: User;
  infants: Infant[];
  onUpdate: () => void;
}

const InfantList: React.FC<InfantListProps> = ({ user, infants, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInfant, setSelectedInfant] = useState<Infant | null>(null);

  const filtered = infants.filter(i => {
    const matchesSearch = i.infantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateTest = (type: keyof Infant, doneDate: string, result: string) => {
    if (!selectedInfant) return;
    
    if (type === 'finalOutcome') {
      dataService.updateInfant(user, selectedInfant.id, { 
        finalOutcome: result as any,
        status: result === 'Negative' ? 'Discharged' : 'Active'
      });
    } else {
      const currentTest = selectedInfant[type] as any;
      const testUpdate = { ...currentTest, doneDate, result };
      dataService.updateInfant(user, selectedInfant.id, { [type]: testUpdate });
    }
    
    setSelectedInfant(null);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="LTFU">LTFU</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-4">ID</th>
              <th className="px-4 py-4">Infant (DOB)</th>
              <th className="px-4 py-4">PCR1 (6wk)</th>
              <th className="px-4 py-4">PCR2 (9mo)</th>
              <th className="px-4 py-4">Ab (12mo)</th>
              <th className="px-4 py-4">Rapid (18mo)</th>
              <th className="px-4 py-4">Ab (24mo)</th>
              <th className="px-4 py-4">Outcome</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(infant => (
              <tr key={infant.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-xs font-medium text-gray-900">{infant.id}</td>
                <td className="px-4 py-4">
                  <p className="text-xs font-bold text-gray-900">{user.role === UserRole.FACILITY ? infant.infantName : '***'}</p>
                  <p className="text-[10px] text-gray-500">{infant.dob}</p>
                </td>
                <td className="px-2 py-4"><TestStatusBadge test={infant.pcr1} /></td>
                <td className="px-2 py-4"><TestStatusBadge test={infant.pcr2} /></td>
                <td className="px-2 py-4"><TestStatusBadge test={infant.antibody12mo} /></td>
                <td className="px-2 py-4"><TestStatusBadge test={infant.rapidTest18mo} /></td>
                <td className="px-2 py-4"><TestStatusBadge test={infant.antibody24mo} /></td>
                <td className="px-4 py-4">
                   {infant.finalOutcome ? (
                     <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${infant.finalOutcome === 'Negative' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                       {infant.finalOutcome}
                     </span>
                   ) : <span className="text-gray-300 text-[10px]">--</span>}
                </td>
                <td className="px-4 py-4"><StatusBadge status={infant.status} /></td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => setSelectedInfant(infant)}
                    className="text-blue-600 font-bold text-[10px] hover:underline"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInfant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex justify-between items-center">
              Update Health Records: {selectedInfant.id}
              <button onClick={() => setSelectedInfant(null)} className="text-gray-400">&times;</button>
            </h3>
            
            <div className="space-y-6">
              <section className="border-b pb-4">
                 <h4 className="text-sm font-bold text-gray-600 mb-4">Laboratory Tests</h4>
                 <div className="grid grid-cols-1 gap-4">
                    {['pcr1', 'pcr2', 'antibody12mo', 'rapidTest18mo', 'antibody24mo'].map(type => {
                      const t = type as any;
                      const test = selectedInfant[t];
                      if (test.doneDate) return null;
                      return (
                        <div key={type} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="font-bold text-gray-800 uppercase text-[10px] mb-2">{type.replace(/([A-Z])/g, ' $1')}</p>
                          <div className="flex gap-3">
                            <input type="date" className="border rounded p-2 text-xs flex-1" id={`${type}-date`} defaultValue={new Date().toISOString().split('T')[0]} />
                            <div className="flex gap-1">
                              <button 
                                onClick={() => {
                                  const date = (document.getElementById(`${type}-date`) as HTMLInputElement).value;
                                  handleUpdateTest(t, date, 'Negative');
                                }}
                                className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700"
                              >
                                NEGATIVE
                              </button>
                              <button 
                                onClick={() => {
                                  const date = (document.getElementById(`${type}-date`) as HTMLInputElement).value;
                                  handleUpdateTest(t, date, 'Positive');
                                }}
                                className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700"
                              >
                                POSITIVE
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                 </div>
              </section>

              {(!selectedInfant.finalOutcome && selectedInfant.status !== 'Discharged') && (
                <section>
                  <h4 className="text-sm font-bold text-gray-600 mb-4">Final 24 Month Outcome</h4>
                  <p className="text-[10px] text-gray-500 mb-3">Only select once the final status is confirmed.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleUpdateTest('finalOutcome', '', 'Negative')}
                      className="py-3 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100"
                    >
                      Negative (Discharge)
                    </button>
                    <button 
                      onClick={() => handleUpdateTest('finalOutcome', '', 'Positive')}
                      className="py-3 border-2 border-red-100 bg-red-50 text-red-700 font-bold rounded-lg hover:bg-red-100"
                    >
                      Positive (Link to ART)
                    </button>
                  </div>
                </section>
              )}
              
              <button 
                onClick={() => setSelectedInfant(null)}
                className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TestStatusBadge: React.FC<{ test: any }> = ({ test }) => {
  if (test.doneDate) {
    return (
      <div className={`p-1 text-center rounded ${test.result === 'Positive' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
        <p className="text-[8px] font-black uppercase leading-none">{test.result}</p>
        <p className="text-[8px] opacity-70 leading-none mt-1">{test.doneDate}</p>
      </div>
    );
  }
  const isOverdue = new Date(test.dueDate) < new Date();
  const isDueSoon = !isOverdue && (new Date(test.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 14;
  
  return (
    <div className={`p-1 text-center rounded border ${isOverdue ? 'bg-red-50 border-red-200 text-red-600' : isDueSoon ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
       <p className="text-[8px] font-black leading-none">{isOverdue ? 'OVERDUE' : 'DUE'}</p>
       <p className="text-[8px] leading-none mt-1">{test.dueDate}</p>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: any = {
    'Active': 'bg-blue-100 text-blue-700',
    'Discharged': 'bg-emerald-100 text-emerald-700',
    'Lost to Follow Up': 'bg-gray-100 text-gray-700',
    'Deceased': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 text-[9px] font-bold rounded-full ${styles[status] || styles['Active']}`}>
      {status}
    </span>
  );
};

export default InfantList;
