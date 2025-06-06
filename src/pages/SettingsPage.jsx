import React, { useState } from "react";
import { 
  FiUser, 
  FiShield, 
  FiBell, 
  FiSettings, 
  FiCreditCard, 
  FiUsers, 
  FiLink 
} from "react-icons/fi";

// Import setting components
import ProfileSettings from "../components/settings/ProfileSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import GeneralSettings from "../components/settings/GeneralSettings";
import BillingSettings from "../components/settings/BillingSettings";
import TeamSettings from "../components/settings/TeamSettings";
import IntegrationSettings from "../components/settings/IntegrationSettings";

const SettingsPage = () => {
  const [activeCategory, setActiveCategory] = useState('profile');

  const settingsCategories = [
    {
      id: 'general',
      name: 'General',
      icon: FiSettings,
      description: 'Application preferences and display settings'
    },
    {
      id: 'profile',
      name: 'User Profile',
      icon: FiUser,
      description: 'Personal information and firm details'
    },
    {
      id: 'security',
      name: 'Security & Login',
      icon: FiShield,
      description: 'Password, 2FA, and account security'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: FiBell,
      description: 'Email, push, and in-app notification preferences'
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: FiLink,
      description: 'Third-party services and API connections'
    },
    {
      id: 'billing',
      name: 'Billing & Subscription',
      icon: FiCreditCard,
      description: 'Plan details, payment methods, and invoices'
    },
    {
      id: 'team',
      name: 'Team Management',
      icon: FiUsers,
      description: 'Manage users, roles, and permissions'
    }
  ];

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case 'general':
        return <GeneralSettings />;
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'team':
        return <TeamSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and application settings</p>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Navigation - Categories */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Settings Categories</h2>
            </div>
            <nav className="p-2">
              {settingsCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 mb-1 group ${
                      isActive
                        ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent 
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {category.name}
                        </div>
                        <div className={`text-sm mt-1 ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              Contact our support team for assistance with your settings.
            </p>
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 