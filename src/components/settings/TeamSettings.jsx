import React, { useState } from 'react';
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiMail, FiShield, FiMoreVertical } from 'react-icons/fi';

const TeamSettings = () => {
  const [users] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@lawfirm.co.za',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-15T10:30:00Z',
      avatar: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lawfirm.co.za',
      role: 'Senior Conveyancer',
      status: 'Active',
      lastLogin: '2024-01-14T16:45:00Z',
      avatar: null
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@lawfirm.co.za',
      role: 'Junior Conveyancer',
      status: 'Active',
      lastLogin: '2024-01-13T09:15:00Z',
      avatar: null
    },
    {
      id: 4,
      name: 'Lisa Davis',
      email: 'lisa.davis@lawfirm.co.za',
      role: 'Secretary',
      status: 'Inactive',
      lastLogin: '2024-01-10T14:20:00Z',
      avatar: null
    }
  ]);

  const [roles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Full access to all features and settings',
      permissions: ['manage_users', 'manage_settings', 'view_all_matters', 'manage_billing'],
      userCount: 1
    },
    {
      id: 2,
      name: 'Senior Conveyancer',
      description: 'Can manage matters and view reports',
      permissions: ['manage_matters', 'view_reports', 'manage_clients'],
      userCount: 1
    },
    {
      id: 3,
      name: 'Junior Conveyancer',
      description: 'Can work on assigned matters',
      permissions: ['view_assigned_matters', 'update_matter_status'],
      userCount: 1
    },
    {
      id: 4,
      name: 'Secretary',
      description: 'Administrative support role',
      permissions: ['view_calendar', 'manage_documents'],
      userCount: 1
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Management</h2>
        <p className="text-gray-600">Manage users, roles, and permissions for your firm</p>
      </div>

      <div className="space-y-8">
        {/* Team Members */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
              Team Members
            </h3>
            <button 
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {getInitials(user.name)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatLastLogin(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <FiMail className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiShield className="w-5 h-5 mr-2 text-blue-600" />
              Roles & Permissions
            </h3>
            <button 
              onClick={() => setShowAddRole(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h5>
                  <div className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Firm Settings */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Firm Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-medium text-gray-900 mb-4">User Limits</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Users</span>
                  <span className="font-medium">{users.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plan Limit</span>
                  <span className="font-medium">25 users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(users.length / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-medium text-gray-900 mb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Require 2FA</p>
                    <p className="text-xs text-gray-500">Force all users to enable 2FA</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                    <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                  </div>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>8 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          
          <div className="bg-white rounded-lg border">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUsers className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New user added</p>
                    <p className="text-xs text-gray-500">Michael Brown was added to the team</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FiShield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Role permissions updated</p>
                    <p className="text-xs text-gray-500">Senior Conveyancer role modified</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User deactivated</p>
                    <p className="text-xs text-gray-500">Lisa Davis account was deactivated</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings; 