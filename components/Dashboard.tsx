
import React from 'react';
import { User, UserRole, DashboardStats, Infant } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  stats: DashboardStats | null;
  infants: Infant[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, stats, infants }) => {
  if (!stats) return <div>Loading statistics...</div>;

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  const statusData = [
    { name: 'Active', value: infants.filter(i => i.status === 'Active').length },
    { name: 'LTFU', value: infants.filter(i => i.status === 'Lost to Follow Up').length },
    { name: 'Discharged', value: infants.filter(i => i.status === 'Discharged').length },
    { name: 'Deceased', value: infants.filter(i => i.status === 'Deceased').length },
  ];

  const facilityBreakdown = user.role !== UserRole.FACILITY ? 
    Object.values(infants.reduce((acc, curr) => {
      acc[curr.facility] = acc[curr.facility] || { name: curr.facility, count: 0 };
      acc[curr.facility].count++;
      return acc;
    }, {} as any)) : [];

  const getReminders = () => {
    const reminders: { infant: Infant; testName: string; status: 'overdue' | 'dueSoon'; date: string }[] = [];
    const today = new Date();
    
    infants.forEach(infant => {
      const tests = [
        { name: 'PCR 1 (6wk)', data: infant.pcr1 },
        { name: 'PCR 2 (9mo)', data: infant.pcr2 },
        { name: 'Antibody (12mo)', data: infant.antibody12mo },
        { name: 'Rapid Test (18mo)', data: infant.rapidTest18mo },
        { name: 'Antibody (24mo)', data: infant.antibody24mo },
      ];

      tests.forEach(t => {
        if (!t.data.doneDate) {
          const dueDate = new Date(t.data.dueDate);
          const diffDays = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 0) {
            reminders.push({ infant, testName: t.name, status: 'overdue', date: t.data.dueDate });
          } else if (diffDays <= 14) {
            reminders.push({ infant, testName: t.name, status: 'dueSoon', date: t.data.dueDate });
          }
        }
      });
    });

    return reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const reminders = getReminders();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Exposed Infants" value={stats.totalInfants} icon="users" color="bg-blue-600" />
        <StatCard title="Tests Due (14 Days)" value={stats.dueSoon} icon="clock" color="bg-orange-500" />
        <StatCard title="Overdue Tests" value={stats.overdue} icon="alert-triangle" color="bg-red-600" />
        <StatCard title="HIV Positivity Rate" value={`${stats.positivityRate.toFixed(1)}%`} icon="activity" color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <div>
                <h3 className="text-lg font-bold text-gray-800">Testing & Follow-up Reminders</h3>
                <p className="text-xs text-gray-500">Urgent actions for Facility and District Focal Points</p>
             </div>
             <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
               {reminders.length} Alerts
             </span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {reminders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>All follow-ups up to date.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reminders.map((rem, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rem.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={rem.status === 'overdue' ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {rem.infant.id} • {rem.testName}
                        </p>
                        <p className="text-xs text-gray-500">
                           {user.role === UserRole.FACILITY ? rem.infant.infantName : rem.infant.facility} • 
                           <span className={rem.status === 'overdue' ? 'text-red-500 font-bold' : 'text-orange-500 font-bold'}>
                             {' '}{rem.status.toUpperCase()} ({rem.date})
                           </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] text-gray-400 mb-1">{rem.infant.district}</span>
                       <button className="text-blue-600 font-bold text-xs hover:underline">Process Test</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Status Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {statusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 p-2 bg-gray-50 rounded">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {user.role !== UserRole.FACILITY && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Facility Caseload</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facilityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
