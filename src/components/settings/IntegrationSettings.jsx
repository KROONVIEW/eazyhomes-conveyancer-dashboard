import React, { useState } from 'react';
import { FiLink, FiCheck, FiX, FiExternalLink } from 'react-icons/fi';

const IntegrationSettings = () => {
  const [integrations] = useState([
    {
      id: 'xero',
      name: 'Xero Accounting',
      description: 'Sync financial data and invoicing',
      icon: '📊',
      connected: true,
      status: 'Active'
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Electronic signature platform',
      icon: '✍️',
      connected: false,
      status: 'Not Connected'
    },
    {
      id: 'sage',
      name: 'Sage Accounting',
      description: 'Financial management integration',
      icon: '💼',
      connected: false,
      status: 'Not Connected'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Email and calendar synchronization',
      icon: '📧',
      connected: true,
      status: 'Active'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Cloud storage and file sharing',
      icon: '☁️',
      connected: false,
      status: 'Not Connected'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: '💬',
      connected: false,
      status: 'Not Connected'
    }
  ]);

  const handleConnect = (integrationId) => {
    console.log(`Connecting to ${integrationId}`);
    // Implement OAuth flow or connection logic
  };

  const handleDisconnect = (integrationId) => {
    console.log(`Disconnecting from ${integrationId}`);
    // Implement disconnection logic
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
        <p className="text-gray-600">Connect with third-party services to enhance your workflow</p>
      </div>

      <div className="space-y-6">
        {/* Available Integrations */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiLink className="w-5 h-5 mr-2 text-blue-600" />
            Available Integrations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration.connected ? (
                      <FiCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    integration.connected ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {integration.status}
                  </span>
                  
                  {integration.connected ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDisconnect(integration.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                      <button className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors flex items-center space-x-1">
                        <span>Settings</span>
                        <FiExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleConnect(integration.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Services */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected Services</h3>
          
          <div className="space-y-4">
            {integrations.filter(i => i.connected).map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600">Connected and syncing</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {integrations.filter(i => i.connected).length === 0 && (
            <div className="text-center py-8">
              <FiLink className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No integrations connected yet</p>
              <p className="text-sm text-gray-400">Connect with services above to get started</p>
            </div>
          )}
        </div>

        {/* API Access */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">API Access</h3>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Developer API Key</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Use this API key to integrate EasyHomes with your custom applications
                </p>
                <div className="bg-gray-100 rounded p-3 font-mono text-sm text-gray-700">
                  eh_live_sk_1234567890abcdef...
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                Regenerate Key
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Webhooks</h3>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Webhook Endpoints</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure webhook URLs to receive real-time notifications
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Matter Status Updates</p>
                  <p className="text-sm text-gray-600">https://your-app.com/webhooks/status</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Document Uploads</p>
                  <p className="text-sm text-gray-600">https://your-app.com/webhooks/documents</p>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Inactive</span>
              </div>
            </div>
            
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Add Webhook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings; 