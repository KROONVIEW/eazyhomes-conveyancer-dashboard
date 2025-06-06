import React, { useState } from 'react';
import { FiShield, FiLock, FiSmartphone, FiMonitor, FiEye, FiEyeOff } from 'react-icons/fi';

const SecuritySettings = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Login</h2>
        <p className="text-gray-600">Manage your account security and authentication settings</p>
      </div>

      <div className="space-y-8">
        {/* Change Password Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiLock className="w-5 h-5 mr-2 text-blue-600" />
            Change Password
          </h3>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input 
                  type={showPasswords.current ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPasswords.new ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-500">Password strength: <span className="text-orange-600 font-medium">Medium</span></div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-orange-500 h-1 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showPasswords.confirm ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiSmartphone className="w-5 h-5 mr-2 text-blue-600" />
            Two-Factor Authentication
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Authenticator App</h4>
              <p className="text-sm text-gray-600 mt-1">
                {twoFactorEnabled 
                  ? "Two-factor authentication is enabled and protecting your account"
                  : "Add an extra layer of security to your account"
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Backup codes:</strong> Make sure you have saved your backup codes in a secure location.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline">
                View backup codes
              </button>
            </div>
          )}
        </div>

        {/* Active Sessions Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiMonitor className="w-5 h-5 mr-2 text-blue-600" />
            Active Sessions
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <FiMonitor className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Windows PC - Chrome</h4>
                  <p className="text-sm text-gray-600">Johannesburg, South Africa • Current session</p>
                  <p className="text-xs text-gray-500">Last active: Now</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Current</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <FiSmartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">iPhone - Safari</h4>
                  <p className="text-sm text-gray-600">Cape Town, South Africa</p>
                  <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                </div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Sign out of all other devices
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiShield className="w-5 h-5 mr-2 text-blue-600" />
            Recent Security Activity
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Successful login</p>
                <p className="text-xs text-gray-500">Today at 09:15 AM from Johannesburg, SA</p>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Password changed</p>
                <p className="text-xs text-gray-500">Yesterday at 02:30 PM</p>
              </div>
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Failed login attempt</p>
                <p className="text-xs text-gray-500">3 days ago at 11:45 PM from Unknown location</p>
              </div>
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 