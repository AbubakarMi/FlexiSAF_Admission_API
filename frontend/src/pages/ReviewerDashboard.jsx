import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewerSidebar from '../components/ReviewerSidebar';
import { useAuth } from '../context/AuthContext';
import { useReviewer } from '../context/ReviewerContext';
import { getAllPrograms, getCoursesByProgram } from '../data/courseData';
import { Users, BookOpen, ClipboardCheck, Award, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { examPublications, resultPublications } = useReviewer();

  // Calculate statistics
  const programs = getAllPrograms();
  const totalCourses = programs.reduce((sum, program) => sum + getCoursesByProgram(program).length, 0);

  const examPubs = Object.values(examPublications);
  const midtermsPublished = examPubs.filter(p => p.midtermPublished).length;
  const finalsPublished = examPubs.filter(p => p.finalPublished).length;

  const resultPubs = Object.values(resultPublications);
  const resultsPublished = resultPubs.filter(r => r.published).length;

  const quickStats = [
    { label: 'Total Programs', value: programs.length, icon: BookOpen, color: 'bg-blue-500', link: null },
    { label: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'bg-purple-500', link: null },
    { label: 'Midterms Published', value: midtermsPublished, icon: ClipboardCheck, color: 'bg-green-500', link: '/reviewer/exams' },
    { label: 'Finals Published', value: finalsPublished, icon: ClipboardCheck, color: 'bg-purple-600', link: '/reviewer/exams' },
    { label: 'Results Published', value: resultsPublished, icon: Award, color: 'bg-green-600', link: '/reviewer/results' },
    { label: 'Total Students', value: '150+', icon: Users, color: 'bg-primary', link: null }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ReviewerSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-text">Reviewer Dashboard</h1>
                <p className="text-sm text-text-secondary font-medium">
                  Welcome back, {user?.firstName}! Manage students, exams, and results.
                </p>
              </div>
              <div className="px-3 py-1.5 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
                <p className="text-xs font-bold text-success">ACTIVE</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                onClick={() => stat.link && navigate(stat.link)}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 ${
                  stat.link ? 'cursor-pointer hover:shadow-md transition-all' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-text-secondary uppercase mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-text">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/reviewer/exams')}
                className="px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                Publish Exams
              </button>
              <button
                onClick={() => navigate('/reviewer/results')}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                Publish Results
              </button>
              <button
                onClick={() => navigate('/reviewer/students')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Students
              </button>
              <button
                onClick={() => navigate('/reviewer/reports')}
                className="px-4 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                View Reports
              </button>
            </div>
          </div>

          {/* Programs Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-text mb-4">Programs Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program) => {
                const courses = getCoursesByProgram(program);
                return (
                  <div key={program} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-sm text-text mb-2">{program}</h3>
                    <p className="text-xs text-text-secondary">{courses.length} Courses</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
