import React, { useState, useEffect } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';
import { getEventsByProgram } from '../data/calendarData';

const AcademicCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [studentProgram, setStudentProgram] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load student program from localStorage
  useEffect(() => {
    const cachedApplication = localStorage.getItem('studentApplication');
    if (cachedApplication) {
      const appData = JSON.parse(cachedApplication);
      if (appData.program) {
        setStudentProgram(appData.program);
      }
    }
  }, []);

  // Get program-specific events
  const academicEvents = studentProgram ? getEventsByProgram(studentProgram) : [];

  const filteredEvents = academicEvents.filter(event => {
    const matchesMonth = selectedMonth === '' || event.month === selectedMonth;
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesMonth && matchesType;
  });

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'semester':
        return 'border-primary bg-blue-50';
      case 'deadline':
        return 'border-red-500 bg-red-50';
      case 'exam':
        return 'border-purple-500 bg-purple-50';
      case 'test':
        return 'border-orange-500 bg-orange-50';
      case 'holiday':
        return 'border-green-500 bg-green-50';
      case 'special':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'semester':
      case 'orientation':
        return 'bg-primary';
      case 'deadline':
        return 'bg-red-500';
      case 'exam':
      case 'capstone':
        return 'bg-purple-500';
      case 'test':
      case 'assessment':
        return 'bg-orange-500';
      case 'holiday':
        return 'bg-green-500';
      case 'special':
      case 'project':
      case 'review':
      case 'workshop':
      case 'demo':
      case 'challenge':
      case 'simulation':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const eventTypeCounts = {
    all: academicEvents.length,
    exam: academicEvents.filter(e => ['exam', 'capstone'].includes(e.type)).length,
    test: academicEvents.filter(e => ['test', 'assessment'].includes(e.type)).length,
    deadline: academicEvents.filter(e => e.type === 'deadline').length,
    semester: academicEvents.filter(e => ['semester', 'orientation'].includes(e.type)).length,
    holiday: academicEvents.filter(e => e.type === 'holiday').length,
    special: academicEvents.filter(e => ['special', 'project', 'review', 'workshop', 'demo', 'challenge', 'simulation'].includes(e.type)).length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EnrolledStudentSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-text">Academic Calendar</h1>
                <p className="text-sm text-text-secondary font-medium">
                  {studentProgram || 'Loading...'} - Spring 2025 - Important dates and deadlines
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1.5 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
                  <p className="text-xs font-bold text-primary">{filteredEvents.length} Events</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Academic Year Info */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-primary p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text mb-1">Academic Year 2024-2025</h2>
                <p className="text-sm text-text-secondary font-medium">
                  {studentProgram || 'All Programs'} - Spring Semester - January to May 2025
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold text-text-secondary mb-1">Total Exams</p>
              <p className="text-2xl font-black text-purple-600">{eventTypeCounts.exam}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold text-text-secondary mb-1">Tests & Assessments</p>
              <p className="text-2xl font-black text-orange-600">{eventTypeCounts.test}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold text-text-secondary mb-1">Deadlines</p>
              <p className="text-2xl font-black text-red-600">{eventTypeCounts.deadline}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold text-text-secondary mb-1">Projects & Events</p>
              <p className="text-2xl font-black text-yellow-600">{eventTypeCounts.special}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Filter by Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Months</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Types ({eventTypeCounts.all})</option>
                  <option value="exam">Exams ({eventTypeCounts.exam})</option>
                  <option value="test">Tests & Quizzes ({eventTypeCounts.test})</option>
                  <option value="deadline">Deadlines ({eventTypeCounts.deadline})</option>
                  <option value="semester">Semester Events ({eventTypeCounts.semester})</option>
                  <option value="holiday">Holidays ({eventTypeCounts.holiday})</option>
                  <option value="special">Special Events ({eventTypeCounts.special})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Events Timeline */}
          <div>
            <h2 className="text-lg font-bold text-text mb-3">Events Timeline ({filteredEvents.length})</h2>

            <div className="space-y-3">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${getEventTypeColor(event.type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getEventTypeIcon(event.type)}`}>
                      {event.type === 'test' || event.type === 'exam' ? (
                        <FileText className="w-5 h-5 text-white" />
                      ) : (
                        <Calendar className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-bold text-text">{event.title}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-gray-100 text-gray-700 whitespace-nowrap ml-2">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-1">Important Note</h4>
                <p className="text-xs text-yellow-800">
                  All dates are subject to change. Please check the calendar regularly for updates.
                  Students will be notified via email of any schedule changes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AcademicCalendar;
