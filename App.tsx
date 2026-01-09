
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Infant, DashboardStats } from './types';
import { MOCK_USERS, MOCK_FACILITIES } from './constants';
import { dataService } from './services/dataService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InfantList from './components/InfantList';
import UserManagement from './components/UserManagement';
import RegistrationForm from './components/RegistrationForm';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [infants, setInfants] = useState<Infant[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Simulation: Auto-login as an admin for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('emtct_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const refreshData = useCallback(() => {
    if (currentUser) {
      setInfants(dataService.getFilteredInfants(currentUser));
      setStats(dataService.getDashboardStats(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleLogin = (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('emtct_user', JSON.stringify(user));
    } else {
      alert('Unauthorized email. Please use a mock email (e.g., admin@emtct.gov)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('emtct_user');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-8.228-9.917c-.198-.215-.46-.35-.742-.383a1 1 0 01-.892-.892c-.033-.283-.168-.544-.383-.742L12 3l9.228 9.917c.198.215.46.35.742.383a1 1 0 01.892.892c.033.283.168.544.383.742L12 21z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">EMTCT Track Pro</h1>
          <p className="text-gray-500 text-center mb-8">Role-Based Access Control Login</p>
          
          <div className="space-y-4">
            {MOCK_USERS.map(user => (
              <button
                key={user.email}
                onClick={() => handleLogin(user.email)}
                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} stats={stats} infants={infants} />;
      case 'registry':
        return <InfantList user={currentUser} infants={infants} onUpdate={refreshData} />;
      case 'registration':
        return <RegistrationForm user={currentUser} onSuccess={() => { setActiveTab('registry'); refreshData(); }} />;
      case 'users':
        return currentUser.role === UserRole.ADMIN ? <UserManagement /> : <div className="p-8 text-center text-red-500">Access Denied</div>;
      case 'reports':
        return <Reports user={currentUser} infants={infants} />;
      default:
        return <Dashboard user={currentUser} stats={stats} infants={infants} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center no-print">
          <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {currentUser.role}
            </span>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.facility || currentUser.district || 'National'}</p>
            </div>
          </div>
        </header>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
