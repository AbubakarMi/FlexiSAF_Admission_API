import React, { useState } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

const AcademicCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterType, setFilterType] = useState('all');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const academicEvents = [
    {
      id: 1,
      title: 'Spring Semester Begins',
      date: 'January 15, 2025',
      month: 'January',
      time: '8:00 AM',
      location: 'Campus-wide',
      type: 'semester',
      description: 'First day of classes for Spring 2025 semester'
    },
    {
      id: 2,
      title: 'Course Registration Deadline',
      date: 'January 22, 2025',
      month: 'January',
      time: '11:59 PM',
      location: 'Online Portal',
      type: 'deadline',
      description: 'Last day to add or drop courses without penalty'
    },
    {
      id: 3,
      title: 'CS101 - First Test',
      date: 'February 5, 2025',
      month: 'February',
      time: '9:00 AM - 10:30 AM',
      location: 'Lecture Hall A',
      type: 'test',
      description: 'Introduction to Programming - Test 1'
    },
    {
      id: 4,
      title: 'MATH201 - Quiz 1',
      date: 'February 8, 2025',
      month: 'February',
      time: '10:00 AM - 11:00 AM',
      location: 'Mathematics Building',
      type: 'test',
      description: 'Calculus II - First Quiz'
    },
    {
      id: 5,
      title: 'CS201 - First Test',
      date: 'February 12, 2025',
      month: 'February',
      time: '2:00 PM - 3:30 PM',
      location: 'Computer Lab 3',
      type: 'test',
      description: 'Object-Oriented Programming - Test 1'
    },
    {
      id: 6,
      title: 'CS202 - First Test',
      date: 'February 19, 2025',
      month: 'February',
      time: '10:00 AM - 11:30 AM',
      location: 'Lecture Hall B',
      type: 'test',
      description: 'Database Management Systems - Test 1'
    },
    {
      id: 7,
      title: 'ENG102 - Assignment Deadline',
      date: 'February 26, 2025',
      month: 'February',
      time: '11:59 PM',
      location: 'Online Portal',
      type: 'deadline',
      description: 'Technical Writing - Essay submission deadline'
    },
    {
      id: 8,
      title: 'CS301 - Midterm Test',
      date: 'March 5, 2025',
      month: 'March',
      time: '1:00 PM - 2:30 PM',
      location: 'Examination Hall 1',
      type: 'test',
      description: 'Software Engineering - Midterm examination'
    },
    {
      id: 9,
      title: 'Midterm Examinations Begin',
      date: 'March 10, 2025',
      month: 'March',
      time: 'Various',
      location: 'Examination Halls',
      type: 'exam',
      description: 'Midterm examination period begins for all courses'
    },
    {
      id: 10,
      title: 'CS101 - Midterm Exam',
      date: 'March 11, 2025',
      month: 'March',
      time: '9:00 AM - 11:00 AM',
      location: 'Examination Hall 2',
      type: 'exam',
      description: 'Introduction to Programming - Midterm examination'
    },
    {
      id: 11,
      title: 'MATH201 - Midterm Exam',
      date: 'March 12, 2025',
      month: 'March',
      time: '10:00 AM - 12:00 PM',
      location: 'Examination Hall 3',
      type: 'exam',
      description: 'Calculus II - Midterm examination'
    },
    {
      id: 12,
      title: 'CS201 - Midterm Exam',
      date: 'March 13, 2025',
      month: 'March',
      time: '2:00 PM - 4:00 PM',
      location: 'Examination Hall 1',
      type: 'exam',
      description: 'Object-Oriented Programming - Midterm examination'
    },
    {
      id: 13,
      title: 'CS202 - Midterm Exam',
      date: 'March 14, 2025',
      month: 'March',
      time: '10:00 AM - 12:00 PM',
      location: 'Examination Hall 2',
      type: 'exam',
      description: 'Database Management Systems - Midterm examination'
    },
    {
      id: 14,
      title: 'Midterm Examinations End',
      date: 'March 14, 2025',
      month: 'March',
      time: '5:00 PM',
      location: 'Campus-wide',
      type: 'exam',
      description: 'Midterm examination period ends'
    },
    {
      id: 15,
      title: 'Spring Break',
      date: 'March 17-21, 2025',
      month: 'March',
      time: 'All Day',
      location: 'N/A',
      type: 'holiday',
      description: 'No classes - Spring break vacation'
    },
    {
      id: 16,
      title: 'Course Withdrawal Deadline',
      date: 'April 1, 2025',
      month: 'April',
      time: '11:59 PM',
      location: 'Online Portal',
      type: 'deadline',
      description: 'Last day to withdraw from courses with a "W" grade'
    },
    {
      id: 17,
      title: 'CS301 - Second Test',
      date: 'April 8, 2025',
      month: 'April',
      time: '1:00 PM - 2:30 PM',
      location: 'Lecture Hall C',
      type: 'test',
      description: 'Software Engineering - Test 2'
    },
    {
      id: 18,
      title: 'CS302 - Second Test',
      date: 'April 10, 2025',
      month: 'April',
      time: '3:00 PM - 4:30 PM',
      location: 'Computer Lab 5',
      type: 'test',
      description: 'Computer Networks - Test 2'
    },
    {
      id: 19,
      title: 'MATH301 - Quiz 2',
      date: 'April 15, 2025',
      month: 'April',
      time: '10:00 AM - 11:00 AM',
      location: 'Mathematics Building',
      type: 'test',
      description: 'Linear Algebra - Second Quiz'
    },
    {
      id: 20,
      title: 'CS303 - Second Test',
      date: 'April 17, 2025',
      month: 'April',
      time: '3:00 PM - 4:30 PM',
      location: 'Lecture Hall A',
      type: 'test',
      description: 'Operating Systems - Test 2'
    },
    {
      id: 21,
      title: 'Final Project Submission Deadline',
      date: 'April 30, 2025',
      month: 'April',
      time: '11:59 PM',
      location: 'Online Portal',
      type: 'deadline',
      description: 'Last day to submit final course projects'
    },
    {
      id: 22,
      title: 'Final Examinations Begin',
      date: 'May 5, 2025',
      month: 'May',
      time: 'Various',
      location: 'Examination Halls',
      type: 'exam',
      description: 'Final examination period begins for Spring semester'
    },
    {
      id: 23,
      title: 'CS101 - Final Exam',
      date: 'May 6, 2025',
      month: 'May',
      time: '9:00 AM - 12:00 PM',
      location: 'Examination Hall 1',
      type: 'exam',
      description: 'Introduction to Programming - Final examination'
    },
    {
      id: 24,
      title: 'MATH201 - Final Exam',
      date: 'May 7, 2025',
      month: 'May',
      time: '10:00 AM - 1:00 PM',
      location: 'Examination Hall 2',
      type: 'exam',
      description: 'Calculus II - Final examination'
    },
    {
      id: 25,
      title: 'CS201 - Final Exam',
      date: 'May 8, 2025',
      month: 'May',
      time: '2:00 PM - 5:00 PM',
      location: 'Examination Hall 3',
      type: 'exam',
      description: 'Object-Oriented Programming - Final examination'
    },
    {
      id: 26,
      title: 'CS202 - Final Exam',
      date: 'May 9, 2025',
      month: 'May',
      time: '9:00 AM - 12:00 PM',
      location: 'Examination Hall 1',
      type: 'exam',
      description: 'Database Management Systems - Final examination'
    },
    {
      id: 27,
      title: 'CS301 - Final Exam',
      date: 'May 10, 2025',
      month: 'May',
      time: '1:00 PM - 4:00 PM',
      location: 'Examination Hall 2',
      type: 'exam',
      description: 'Software Engineering - Final examination'
    },
    {
      id: 28,
      title: 'CS302 - Final Exam',
      date: 'May 11, 2025',
      month: 'May',
      time: '10:00 AM - 1:00 PM',
      location: 'Examination Hall 3',
      type: 'exam',
      description: 'Computer Networks - Final examination'
    },
    {
      id: 29,
      title: 'Final Examinations End',
      date: 'May 12, 2025',
      month: 'May',
      time: '5:00 PM',
      location: 'Campus-wide',
      type: 'exam',
      description: 'Final examination period ends for Spring semester'
    },
    {
      id: 30,
      title: 'Spring Semester Ends',
      date: 'May 15, 2025',
      month: 'May',
      time: '5:00 PM',
      location: 'Campus-wide',
      type: 'semester',
      description: 'Last day of Spring 2025 semester'
    },
    {
      id: 31,
      title: 'Graduation Ceremony',
      date: 'May 20, 2025',
      month: 'May',
      time: '10:00 AM',
      location: 'University Auditorium',
      type: 'special',
      description: 'Commencement ceremony for graduating students'
    }
  ];

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
        return 'bg-primary';
      case 'deadline':
        return 'bg-red-500';
      case 'exam':
        return 'bg-purple-500';
      case 'test':
        return 'bg-orange-500';
      case 'holiday':
        return 'bg-green-500';
      case 'special':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const eventTypeCounts = {
    all: academicEvents.length,
    exam: academicEvents.filter(e => e.type === 'exam').length,
    test: academicEvents.filter(e => e.type === 'test').length,
    deadline: academicEvents.filter(e => e.type === 'deadline').length,
    semester: academicEvents.filter(e => e.type === 'semester').length,
    holiday: academicEvents.filter(e => e.type === 'holiday').length,
    special: academicEvents.filter(e => e.type === 'special').length
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
                <p className="text-sm text-text-secondary font-medium">Spring 2025 - Important dates, tests and examinations</p>
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
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg shadow-sm p-5 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Academic Year 2024-2025</h2>
                <p className="text-sm text-blue-100 font-medium">Spring Semester - January to May 2025</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <p className="text-xs font-semibold text-text-secondary mb-1">Total Exams</p>
              <p className="text-2xl font-black text-purple-600">{eventTypeCounts.exam}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <p className="text-xs font-semibold text-text-secondary mb-1">Tests & Quizzes</p>
              <p className="text-2xl font-black text-orange-600">{eventTypeCounts.test}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <p className="text-xs font-semibold text-text-secondary mb-1">Deadlines</p>
              <p className="text-2xl font-black text-red-600">{eventTypeCounts.deadline}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <p className="text-xs font-semibold text-text-secondary mb-1">Holidays</p>
              <p className="text-2xl font-black text-green-600">{eventTypeCounts.holiday}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getEventTypeColor(event.type)} transition-all hover:shadow-md`}
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
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
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
