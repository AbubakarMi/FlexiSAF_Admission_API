import React, { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import Sidebar from '../components/Sidebar';
import {
  Search,
  GraduationCap,
  Users,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CoursesCalendar = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [alert, setAlert] = useState(null);
  const [expandedPrograms, setExpandedPrograms] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [programFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = programFilter
        ? await courseService.getCoursesByProgram(programFilter)
        : await courseService.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      showAlert('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const filteredCourses = courses.filter(course =>
    (course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group courses by program
  const coursesByProgram = filteredCourses.reduce((acc, course) => {
    const program = course.program || 'Other';
    if (!acc[program]) {
      acc[program] = [];
    }
    acc[program].push(course);
    return acc;
  }, {});

  const toggleProgram = (program) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [program]: !prev[program]
    }));
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty days for padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getCoursesForDate = (date) => {
    if (!date) return [];
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return filteredCourses.filter(course => {
      const schedule = course.schedule || '';
      return schedule.includes(dayOfWeek.substring(0, 3));
    });
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Courses & Calendar</h1>
                <p className="text-sm text-gray-500 mt-1">
                  View courses and their schedules
                </p>
              </div>
              <button
                onClick={fetchCourses}
                className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Courses List Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Courses</h2>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Filter by program..."
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Cards - Grouped by Program */}
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {Object.keys(coursesByProgram).length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No courses found</p>
                  </div>
                ) : (
                  Object.entries(coursesByProgram).map(([program, programCourses]) => (
                    <div key={program} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      {/* Program Header */}
                      <button
                        onClick={() => toggleProgram(program)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-primary bg-opacity-5 hover:bg-opacity-10 transition-colors border-b"
                      >
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-primary" />
                          <span className="font-bold text-gray-900">{program}</span>
                          <span className="px-2 py-0.5 bg-primary bg-opacity-20 text-primary rounded text-xs font-bold">
                            {programCourses.length} course{programCourses.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedPrograms[program] ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Program Courses */}
                      {expandedPrograms[program] && (
                        <div className="divide-y">
                          {programCourses.map((course) => (
                            <div
                              key={course.id}
                              onClick={() => setSelectedCourse(course)}
                              className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                                selectedCourse?.id === course.id ? 'bg-primary bg-opacity-5 border-l-4 border-l-primary' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-bold text-gray-900">{course.name}</h3>
                                    <span className="px-2 py-0.5 bg-primary bg-opacity-10 text-primary rounded text-xs font-bold">
                                      {course.code}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="w-4 h-4 mr-2" />
                                  <span>{course.enrolledStudents || course.enrolled || 0}/{course.capacity || 'N/A'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  <span>{course.credits || 0} Credits</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-700">
                                  <Clock className="w-4 h-4 mr-2 text-primary" />
                                  <span className="font-medium">{course.schedule || 'TBA'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                                  <span className="font-medium">{course.location || course.room || 'TBA'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                                  <span className="font-medium">{course.instructor || 'TBA'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calendar Section */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    <CalendarIcon className="inline w-6 h-6 mr-2" />
                    Course Schedule
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={previousMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-900 min-w-[180px] text-center">
                      {formatMonth(currentDate)}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="mb-4">
                  {/* Week day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => {
                      const coursesOnDate = getCoursesForDate(date);
                      const hasClasses = coursesOnDate.length > 0;
                      const isTodayDate = isToday(date);

                      return (
                        <div
                          key={index}
                          className={`aspect-square border rounded-lg p-1 text-center ${
                            !date
                              ? 'bg-gray-50 border-gray-100'
                              : isTodayDate
                              ? 'bg-primary text-white border-primary font-bold'
                              : hasClasses
                              ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {date && (
                            <>
                              <div className="text-xs font-semibold mb-0.5">
                                {date.getDate()}
                              </div>
                              {hasClasses && (
                                <div className={`text-[10px] ${isTodayDate ? 'text-white' : 'text-blue-600'} font-bold`}>
                                  {coursesOnDate.length} class{coursesOnDate.length !== 1 ? 'es' : ''}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Course Info */}
                {selectedCourse && (
                  <div className="mt-6 p-4 bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary" />
                      {selectedCourse.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span>{selectedCourse.schedule || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span>{selectedCourse.location || selectedCourse.room || 'TBA'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        <span>{selectedCourse.enrolledStudents || 0} students enrolled</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                        <span>{selectedCourse.instructor || 'TBA'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 mb-2">LEGEND</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary rounded mr-2"></div>
                      <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                      <span className="text-gray-600">Has Classes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesCalendar;
