
import React from 'react';
import { MOCK_USERS, MOCK_FACILITIES } from '../constants';

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">User Directory</h3>
            <p className="text-sm text-gray-500">Manage access roles for focal points and admins.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_USERS.map(user => (
                <tr key={user.email} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.facility || user.district || 'All Access'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 font-medium text-sm hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Facility Registry</h3>
          <div className="space-y-3">
            {MOCK_FACILITIES.map(f => (
              <div key={f.code} className="p-3 border border-gray-100 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.district}</p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {f.code}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Email Notifications</p>
                <p className="text-xs text-gray-500">Enable automated overdue alerts via email.</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Audit Logging</p>
                <p className="text-xs text-gray-500">Track all record modifications for compliance.</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
