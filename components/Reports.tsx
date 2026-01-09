
import React from 'react';
import { User, Infant, UserRole } from '../types';

interface ReportsProps {
  user: User;
  infants: Infant[];
}

const Reports: React.FC<ReportsProps> = ({ user, infants }) => {
  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Facility', 'District', 'DOB', 'Status', 'PCR1', 'PCR2', 'Ab12mo', 'Ab18mo', 'Ab24mo', 'FinalOutcome'];
    const rows = infants.map(i => [
      i.id,
      i.facility,
      i.district,
      i.dob,
      i.status,
      i.pcr1.result || 'N/A',
      i.pcr2.result || 'N/A',
      i.antibody12mo.result || 'N/A',
      i.rapidTest18mo.result || 'N/A',
      i.antibody24mo.result || 'N/A',
      i.finalOutcome || 'N/A',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EMTCT_Expanded_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 no-print">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reports & Exports</h3>
        <p className="text-sm text-gray-500 mb-8">Generate comprehensive tracking reports including the full 24-month schedule.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={handlePrint}
            className="p-6 border-2 border-blue-50 bg-white rounded-xl hover:bg-blue-50 transition text-left flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div>
              <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider">Print Official Summary</h4>
              <p className="text-xs text-gray-500 mt-1">Generate a high-resolution PDF report of all infant outcomes.</p>
            </div>
          </button>
          
          <button 
            onClick={exportCSV}
            className="p-6 border-2 border-emerald-50 bg-white rounded-xl hover:bg-emerald-50 transition text-left flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider">Export Full Dataset</h4>
              <p className="text-xs text-gray-500 mt-1">Download raw CSV with all 24-month milestones for research.</p>
            </div>
          </button>
        </div>
      </div>

      <div className="hidden print:block p-8 bg-white">
        <div className="flex justify-between items-start mb-10 border-b-4 border-red-600 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase">EMTCT Tracking Report</h1>
            <p className="text-lg text-gray-600 font-bold uppercase tracking-widest">{user.facility || user.district || 'National'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400">REPORT ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white font-black uppercase">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Mother ID</th>
              <th className="p-2 text-left">DOB</th>
              <th className="p-2 text-left">PCR1</th>
              <th className="p-2 text-left">PCR2</th>
              <th className="p-2 text-left">Ab12</th>
              <th className="p-2 text-left">Ab18</th>
              <th className="p-2 text-left">Ab24</th>
              <th className="p-2 text-left">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {infants.map(i => (
              <tr key={i.id} className="border-b">
                <td className="p-2 font-bold">{i.id}</td>
                <td className="p-2">{i.motherId}</td>
                <td className="p-2">{i.dob}</td>
                <td className="p-2">{i.pcr1.result || '-'}</td>
                <td className="p-2">{i.pcr2.result || '-'}</td>
                <td className="p-2">{i.antibody12mo.result || '-'}</td>
                <td className="p-2">{i.rapidTest18mo.result || '-'}</td>
                <td className="p-2">{i.antibody24mo.result || '-'}</td>
                <td className="p-2 font-black">{i.finalOutcome || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-10">
           <div>
              <p className="text-[10px] font-black uppercase mb-8">Generated By:</p>
              <div className="border-b border-gray-400 w-48 mb-2"></div>
              <p className="text-[10px] font-bold">{user.name}</p>
              <p className="text-[10px] text-gray-500">{user.role}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-gray-400">END OF REPORT</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
