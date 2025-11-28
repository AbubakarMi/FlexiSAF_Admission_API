import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  GraduationCap
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@flexisaf.com',
    phone: '+1 234 567 8900',
    role: 'Administrator'
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    systemAlerts: true,
    weeklyReports: true
  });
  const [systemSettings, setSystemSettings] = useState({
    academicYear: '2023-2024',
    semester: 'Spring',
    gradingScale: 'Standard',
    applicationDeadline: '2024-03-31'
  });

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      showAlert('Profile updated successfully', 'success');
    }, 500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }
    if (securityData.newPassword.length < 6) {
      showAlert('Password must be at least 6 characters', 'error');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      showAlert('Password changed successfully', 'success');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 500);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      showAlert('Notification settings updated', 'success');
    }, 500);
  };

  const handleSaveSystem = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      showAlert('System settings updated', 'success');
    }, 500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert Messages */}
        {alert && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in ${
            alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
          <div className="px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account and system preferences
              </p>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        activeTab === tab.id
                          ? 'text-primary border-b-2 border-primary bg-primary/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={profileData.role}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <form onSubmit={handleChangePassword}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <p className="text-sm text-blue-800">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Lock className="w-5 h-5" />
                        <span>Change Password</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleSaveNotifications}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                          { key: 'applicationUpdates', label: 'Application Updates', description: 'Get notified when applications are submitted or updated' },
                          { key: 'systemAlerts', label: 'System Alerts', description: 'Receive important system alerts and announcements' },
                          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{setting.label}</p>
                              <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={notificationSettings[setting.key]}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [setting.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <form onSubmit={handleSaveSystem}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <GraduationCap className="w-4 h-4 inline mr-1" />
                          Academic Year
                        </label>
                        <input
                          type="text"
                          value={systemSettings.academicYear}
                          onChange={(e) => setSystemSettings({ ...systemSettings, academicYear: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Semester
                        </label>
                        <select
                          value={systemSettings.semester}
                          onChange={(e) => setSystemSettings({ ...systemSettings, semester: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Fall">Fall</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Grading Scale
                        </label>
                        <select
                          value={systemSettings.gradingScale}
                          onChange={(e) => setSystemSettings({ ...systemSettings, gradingScale: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Standard">Standard (A-F)</option>
                          <option value="Percentage">Percentage (0-100)</option>
                          <option value="GPA">GPA (0.0-4.0)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Application Deadline
                        </label>
                        <input
                          type="date"
                          value={systemSettings.applicationDeadline}
                          onChange={(e) => setSystemSettings({ ...systemSettings, applicationDeadline: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
