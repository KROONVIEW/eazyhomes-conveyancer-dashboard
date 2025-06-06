import React, { useState } from 'react';
import { FiSun, FiMoon, FiGlobe, FiClock, FiCalendar, FiHome, FiSave } from 'react-icons/fi';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLandingPage: 'dashboard'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">General Settings</h2>
        <p className="text-gray-600">Customize your application preferences and display settings</p>
      </div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiSun className="w-5 h-5 mr-2 text-blue-600" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleChange('theme', 'light')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    settings.theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiSun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>
                <button
                  onClick={() => handleChange('theme', 'dark')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    settings.theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiMoon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Localization Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiGlobe className="w-5 h-5 mr-2 text-blue-600" />
            Localization
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
                <option value="xh">Xhosa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Africa/Johannesburg">South Africa (SAST)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time Format Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
            Date & Time Format
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                value={settings.timeFormat}
                onChange={(e) => handleChange('timeFormat', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">24 Hour (14:30)</option>
                <option value="12h">12 Hour (2:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiHome className="w-5 h-5 mr-2 text-blue-600" />
            Navigation
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Landing Page</label>
            <select
              value={settings.defaultLandingPage}
              onChange={(e) => handleChange('defaultLandingPage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dashboard">Dashboard</option>
              <option value="matters">Matters</option>
              <option value="messages">Messages</option>
              <option value="calendar">Calendar</option>
              <option value="tasks">Tasks</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Choose which page loads first when you sign in
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 