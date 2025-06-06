import React, { useState } from 'react';
import { FiBell, FiMail, FiSmartphone, FiMonitor, FiVolume2 } from 'react-icons/fi';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: {
      newMessage: true,
      statusChange: true,
      documentUploaded: false,
      deadlineReminder: true,
      weeklyReport: false
    },
    push: {
      newMessage: true,
      statusChange: false,
      documentUploaded: false,
      deadlineReminder: true
    },
    inApp: {
      newMessage: true,
      statusChange: true,
      documentUploaded: true,
      deadlineReminder: true,
      systemUpdates: false
    },
    sounds: true
  });

  const handleToggle = (category, setting) => {
    if (category === 'sounds') {
      setNotifications(prev => ({ ...prev, sounds: !prev.sounds }));
    } else {
      setNotifications(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !prev[category][setting]
        }
      }));
    }
  };

  const NotificationToggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
        <p className="text-gray-600">Control how you receive alerts and updates</p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiMail className="w-5 h-5 mr-2 text-blue-600" />
            Email Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">New Messages</h4>
                <p className="text-sm text-gray-600">Get notified when you receive new messages</p>
              </div>
              <NotificationToggle 
                enabled={notifications.email.newMessage}
                onChange={() => handleToggle('email', 'newMessage')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Transaction Status Changes</h4>
                <p className="text-sm text-gray-600">Updates when matter status changes</p>
              </div>
              <NotificationToggle 
                enabled={notifications.email.statusChange}
                onChange={() => handleToggle('email', 'statusChange')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Document Uploaded</h4>
                <p className="text-sm text-gray-600">When clients upload new documents</p>
              </div>
              <NotificationToggle 
                enabled={notifications.email.documentUploaded}
                onChange={() => handleToggle('email', 'documentUploaded')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Deadline Reminders</h4>
                <p className="text-sm text-gray-600">Important deadline notifications</p>
              </div>
              <NotificationToggle 
                enabled={notifications.email.deadlineReminder}
                onChange={() => handleToggle('email', 'deadlineReminder')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                <p className="text-sm text-gray-600">Summary of weekly activity</p>
              </div>
              <NotificationToggle 
                enabled={notifications.email.weeklyReport}
                onChange={() => handleToggle('email', 'weeklyReport')}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiSmartphone className="w-5 h-5 mr-2 text-blue-600" />
            Push Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">New Messages</h4>
                <p className="text-sm text-gray-600">Instant notifications for new messages</p>
              </div>
              <NotificationToggle 
                enabled={notifications.push.newMessage}
                onChange={() => handleToggle('push', 'newMessage')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Status Changes</h4>
                <p className="text-sm text-gray-600">Matter status updates</p>
              </div>
              <NotificationToggle 
                enabled={notifications.push.statusChange}
                onChange={() => handleToggle('push', 'statusChange')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Document Uploads</h4>
                <p className="text-sm text-gray-600">New document notifications</p>
              </div>
              <NotificationToggle 
                enabled={notifications.push.documentUploaded}
                onChange={() => handleToggle('push', 'documentUploaded')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Urgent Deadlines</h4>
                <p className="text-sm text-gray-600">Critical deadline alerts</p>
              </div>
              <NotificationToggle 
                enabled={notifications.push.deadlineReminder}
                onChange={() => handleToggle('push', 'deadlineReminder')}
              />
            </div>
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiMonitor className="w-5 h-5 mr-2 text-blue-600" />
            In-App Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">New Messages</h4>
                <p className="text-sm text-gray-600">Show notifications within the app</p>
              </div>
              <NotificationToggle 
                enabled={notifications.inApp.newMessage}
                onChange={() => handleToggle('inApp', 'newMessage')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Status Changes</h4>
                <p className="text-sm text-gray-600">In-app status update alerts</p>
              </div>
              <NotificationToggle 
                enabled={notifications.inApp.statusChange}
                onChange={() => handleToggle('inApp', 'statusChange')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Document Activity</h4>
                <p className="text-sm text-gray-600">Document upload and update notifications</p>
              </div>
              <NotificationToggle 
                enabled={notifications.inApp.documentUploaded}
                onChange={() => handleToggle('inApp', 'documentUploaded')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">Deadline Reminders</h4>
                <p className="text-sm text-gray-600">Important deadline notifications</p>
              </div>
              <NotificationToggle 
                enabled={notifications.inApp.deadlineReminder}
                onChange={() => handleToggle('inApp', 'deadlineReminder')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">System Updates</h4>
                <p className="text-sm text-gray-600">Application updates and maintenance notices</p>
              </div>
              <NotificationToggle 
                enabled={notifications.inApp.systemUpdates}
                onChange={() => handleToggle('inApp', 'systemUpdates')}
              />
            </div>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiVolume2 className="w-5 h-5 mr-2 text-blue-600" />
            Sound Settings
          </h3>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Notification Sounds</h4>
              <p className="text-sm text-gray-600">Play sound alerts for notifications</p>
            </div>
            <NotificationToggle 
              enabled={notifications.sounds}
              onChange={() => handleToggle('sounds')}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiBell className="w-4 h-4" />
            <span>Save Notification Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 