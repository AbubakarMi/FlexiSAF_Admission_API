import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  User,
  CreditCard,
  GraduationCap,
  LogOut,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

const EnrolledStudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/student-dashboard',
      badge: null
    },
    {
      name: 'Course Enrollment',
      icon: BookOpen,
      path: '/enrolled/courses',
      badge: null
    },
    {
      name: 'Academic Calendar',
      icon: Calendar,
      path: '/enrolled/calendar',
      badge: null
    },
    {
      name: 'Grades & Results',
      icon: FileText,
      path: '/enrolled/grades',
      badge: null
    },
    {
      name: 'Fee Payment',
      icon: CreditCard,
      path: '/enrolled/payments',
      badge: null
    },
    {
      name: 'My Profile',
      icon: User,
      path: '/enrolled/profile',
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-600">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">FlexiSAF</h1>
            <p className="text-xs text-white/80 font-medium">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Enrollment Status Badge */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Status</p>
            <p className="text-sm font-bold text-blue-900">Enrolled Student</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 font-medium">Student ID: {user?.id || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full group relative text-left px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} strokeWidth={2.5} />
                <span className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-700'}`}>
                  {item.name}
                </span>
              </div>
              {active && (
                <ChevronRight className="w-4 h-4 text-white" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default EnrolledStudentSidebar;
