import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useAuth } from '../context/AuthContext';
import { useEnrollment } from '../context/EnrollmentContext';
import { getCoursesByProgram, getAllPrograms } from '../data/courseData';
import { BookOpen, Clock, Users, CheckCircle, Search, AlertCircle, X } from 'lucide-react';

const CourseEnrollment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enrolledCourses, enrollInMultipleCourses, isEnrolled, unenrollFromCourse } = useEnrollment();

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const [studentProgram, setStudentProgram] = useState('');

  // Get student's program from their application
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // First try to get from localStorage (set by StudentDashboard)
        const cachedApplication = localStorage.getItem('studentApplication');
        if (cachedApplication) {
          const appData = JSON.parse(cachedApplication);
          if (appData.program) {
            console.log('Program loaded from cache:', appData.program);
            setStudentProgram(appData.program);
            return;
          }
        }

        // If not in cache, try API
        const response = await fetch(`http://localhost:8080/api/applications/email/${user?.email}`);
        if (response.ok) {
          const data = await response.json();
          setStudentProgram(data.program);
          // Cache for next time
          localStorage.setItem('studentApplication', JSON.stringify(data));
        } else {
          console.error('API returned error:', response.status);
          // Fallback: Let user select their program
          setStudentProgram('');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentProgram('');
      }
    };

    if (user?.email) {
      fetchStudentData();
    }
  }, [user]);

  // Get available courses for student's program
  const availableCourses = getCoursesByProgram(studentProgram);

  // Debug logging
  console.log('Student Program:', studentProgram);
  console.log('Available Courses:', availableCourses);
  console.log('All Programs in System:', getAllPrograms());

  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const notEnrolled = !isEnrolled(course.id);
    return matchesSearch && notEnrolled;
  });

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = () => {
    if (selectedCourses.length === 0) {
      showAlert('Please select at least one course to enroll', 'error');
      return;
    }

    const coursesToEnroll = availableCourses.filter(c => selectedCourses.includes(c.id));
    const result = enrollInMultipleCourses(coursesToEnroll);

    if (result.success) {
      showAlert(result.message, 'success');
      setSelectedCourses([]);
    } else {
      showAlert(result.message, 'error');
    }
  };

  const handleUnenroll = (courseId) => {
    const result = unenrollFromCourse(courseId);
    if (result.success) {
      showAlert(result.message, 'success');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EnrolledStudentSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert */}
        {alert && (
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
            alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white animate-slide-in`}>
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-4">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-text">Course Enrollment</h1>
                <p className="text-sm text-text-secondary font-medium">
                  {studentProgram || 'Loading...'} - Spring 2025
                </p>
                {!studentProgram && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    No program found. Please check your application.
                  </p>
                )}
                {studentProgram && availableCourses.length === 0 && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    Warning: No courses found for "{studentProgram}". Check program name match.
                  </p>
                )}
              </div>
              {selectedCourses.length > 0 && (
                <button
                  onClick={handleEnroll}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Enroll in {selectedCourses.length} Course{selectedCourses.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Currently Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text mb-3">Currently Enrolled ({enrolledCourses.length})</h2>
              <div className="grid gap-3">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-success bg-opacity-10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-sm text-text">{course.name}</p>
                            {course.grade && (
                              <span className="px-2 py-0.5 bg-success bg-opacity-10 text-success rounded text-xs font-bold">
                                {course.grade}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-text-secondary">
                            <span className="font-semibold">{course.code}</span>
                            <span>•</span>
                            <span>{course.credits} Credits</span>
                            <span>•</span>
                            <span>{course.instructor}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.schedule}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1.5 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
                          <p className="text-xs font-bold text-success">ENROLLED</p>
                        </div>
                        <button
                          onClick={() => handleUnenroll(course.id)}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Drop
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Available Courses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-text">Available Courses ({filteredCourses.length})</h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Courses</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? 'No courses match your search criteria'
                    : 'You are enrolled in all available courses'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => toggleCourseSelection(course.id)}
                    className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedCourses.includes(course.id)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="w-5 h-5 text-primary rounded focus:ring-primary mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                              {course.code}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                              {course.credits} Credits
                            </span>
                            <span className="text-xs text-text-secondary">
                              {course.enrolled}/{course.capacity} Enrolled
                            </span>
                          </div>
                          <p className="font-bold text-sm text-text mb-1">{course.name}</p>
                          {course.description && (
                            <p className="text-xs text-text-secondary mb-2">{course.description}</p>
                          )}
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.schedule}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseEnrollment;
