import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  ClipboardCheck,
  Award,
  DollarSign,
  Calendar,
  BarChart3,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ReviewerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/reviewer/dashboard'
    },
    {
      id: 'students',
      label: 'Student Management',
      icon: Users,
      path: '/reviewer/students'
    },
    {
      id: 'applications',
      label: 'Application Review',
      icon: FileText,
      path: '/reviewer/applications'
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      path: '/reviewer/courses'
    },
    {
      id: 'exams',
      label: 'Exam Control Center',
      icon: ClipboardCheck,
      path: '/reviewer/exams',
      badge: 'New'
    },
    {
      id: 'results',
      label: 'Result Publisher',
      icon: Award,
      path: '/reviewer/results',
      badge: 'New'
    },
    {
      id: 'payments',
      label: 'Payment Oversight',
      icon: DollarSign,
      path: '/reviewer/payments'
    },
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: Calendar,
      path: '/reviewer/calendar'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      path: '/reviewer/reports'
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Bell,
      path: '/reviewer/announcements'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-text">FlexiSAF</h2>
                <p className="text-xs text-text-secondary font-semibold">Reviewer Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-secondary font-semibold">Reviewer</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-600'}`} />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-semibold flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          active ? 'bg-white text-primary' : 'bg-primary text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-text mb-3">Confirm Logout</h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to logout? You will need to login again to access the reviewer portal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-text rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewerSidebar;
