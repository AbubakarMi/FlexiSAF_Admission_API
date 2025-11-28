import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import courseService from '../services/courseService';
import resultService from '../services/resultService';
import { CheckCircle, X, AlertCircle, Award, Eye, EyeOff, Search, Lock, Unlock, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

const ResultPublisher = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [resultsStatus, setResultsStatus] = useState({});
  const [courseResults, setCourseResults] = useState({});
  const [expandedPrograms, setExpandedPrograms] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [selectedProgram]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = selectedProgram
        ? await courseService.getCoursesByProgram(selectedProgram)
        : await courseService.getAllCourses();
      const coursesArray = Array.isArray(data) ? data : [];
      setCourses(coursesArray);

      // Fetch results status for each course
      const statusMap = {};
      for (const course of coursesArray) {
        try {
          const results = await resultService.getResultsByCourse(course.id);
          statusMap[course.id] = results.published || false;
        } catch (error) {
          statusMap[course.id] = false;
        }
      }
      setResultsStatus(statusMap);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseResults = async (courseId) => {
    try {
      const results = await resultService.getResultsByCourse(courseId);
      setCourseResults(prev => ({ ...prev, [courseId]: results.students || [] }));
    } catch (error) {
      console.error('Error fetching course results:', error);
      setCourseResults(prev => ({ ...prev, [courseId]: [] }));
    }
  };

  // Get unique programs from courses
  const programs = [...new Set(courses.map(c => c.program).filter(Boolean))];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePublishResults = async (courseId, courseName) => {
    try {
      await resultService.publishResults(courseId);
      await fetchCourses();
      showAlert(`Results published for ${courseName}. Students can now view their grades!`, 'success');
    } catch (error) {
      console.error('Error publishing results:', error);
      showAlert('Failed to publish results', 'error');
    }
  };

  const handleUnpublishResults = async (courseId, courseName) => {
    try {
      await resultService.unpublishResults(courseId);
      await fetchCourses();
      showAlert(`Results unpublished for ${courseName}.`, 'success');
    } catch (error) {
      console.error('Error unpublishing results:', error);
      showAlert('Failed to unpublish results', 'error');
    }
  };

  const handleBatchPublish = async () => {
    let count = 0;
    const promises = [];

    for (const course of filteredCourses) {
      if (!areResultsPublished(course.id)) {
        promises.push(resultService.publishResults(course.id));
        count++;
      }
    }

    try {
      await Promise.all(promises);
      await fetchCourses();
      if (count > 0) {
        showAlert(`Published results for ${count} courses!`, 'success');
      } else {
        showAlert(`All results already published.`, 'info');
      }
    } catch (error) {
      console.error('Error in batch publish:', error);
      showAlert('Failed to publish some results', 'error');
    }
  };

  const areResultsPublished = (courseId) => {
    return resultsStatus[courseId] || false;
  };

  const getPublicationStats = () => {
    const totalCourses = courses.length;
    const published = courses.filter(c => areResultsPublished(c.id)).length;

    return {
      totalCourses,
      published,
      pending: totalCourses - published
    };
  };

  const stats = getPublicationStats();

  const handleExpandCourse = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
      if (!courseResults[courseId]) {
        await fetchCourseResults(courseId);
      }
    }
  };

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

  // Mock student data for demonstration
  const getMockStudentResults = (courseCode) => {
    return [
      { id: 1, name: 'John Doe', studentId: 'STU-001', assignments: 85, tests: 88, midterm: 82, final: 90, overall: 86, grade: 'B+' },
      { id: 2, name: 'Jane Smith', studentId: 'STU-002', assignments: 92, tests: 90, midterm: 95, final: 93, overall: 92, grade: 'A' },
      { id: 3, name: 'Mike Johnson', studentId: 'STU-003', assignments: 78, tests: 75, midterm: 80, final: 77, overall: 77, grade: 'B' },
      { id: 4, name: 'Sarah Williams', studentId: 'STU-004', assignments: 95, tests: 93, midterm: 97, final: 96, overall: 95, grade: 'A' },
      { id: 5, name: 'David Brown', studentId: 'STU-005', assignments: 70, tests: 72, midterm: 68, final: 75, overall: 71, grade: 'B-' }
    ];
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const toggleProgram = (program) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [program]: !prev[program]
    }));
  };

  const groupCoursesByProgram = () => {
    const grouped = {};
    filteredCourses.forEach(course => {
      if (!grouped[course.program]) {
        grouped[course.program] = [];
      }
      grouped[course.program].push(course);
    });
    return grouped;
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert */}
        {alert && (
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
            alert.type === 'success' ? 'bg-green-600' : alert.type === 'info' ? 'bg-blue-600' : 'bg-red-600'
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
                <h1 className="text-2xl font-black text-text">Result Publisher</h1>
                <p className="text-sm text-text-secondary font-medium">
                  Review and publish student grades and results
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchCourses}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <div className="px-3 py-1.5 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
                  <p className="text-xs font-bold text-primary">{stats.totalCourses} Courses</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Info Banner */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-purple-900 mb-1">Result Publication Control</h4>
                <p className="text-xs text-purple-800">
                  Students can only view grades for courses where results have been published by you. Use this
                  dashboard to review grade distributions and publish results when ready. You can unpublish
                  results if corrections are needed.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Total Courses</p>
              <p className="text-3xl font-black text-text">{stats.totalCourses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-5">
              <p className="text-xs font-bold text-green-700 uppercase mb-1">Results Published</p>
              <p className="text-3xl font-black text-green-600">{stats.published}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-orange-500 p-5">
              <p className="text-xs font-bold text-orange-700 uppercase mb-1">Pending Publication</p>
              <p className="text-3xl font-black text-orange-600">{stats.pending}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Filter by Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {programs.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2">Search Courses</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Batch Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-bold text-text mb-3">Batch Actions for {selectedProgram}</h3>
            <button
              onClick={handleBatchPublish}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Publish All Results
            </button>
          </div>

          {/* Courses List - Grouped by Program */}
          <div>
            <h2 className="text-lg font-bold text-text mb-3">
              Courses ({filteredCourses.length})
            </h2>

            <div className="space-y-3">
              {Object.entries(groupCoursesByProgram()).map(([program, programCourses]) => {
                const isProgramExpanded = expandedPrograms[program];
                const publishedCount = programCourses.filter(c => areResultsPublished(c.id)).length;

                return (
                  <div key={program} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Program Header - Clickable Accordion */}
                    <div
                      onClick={() => toggleProgram(program)}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {isProgramExpanded ? (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-text">{program}</h3>
                          <p className="text-xs text-text-secondary">{programCourses.length} courses</p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        Published: {publishedCount}/{programCourses.length}
                      </div>
                    </div>

                    {/* Expanded Course List */}
                    {isProgramExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-3">
                        {programCourses.map(course => {
                const isPublished = areResultsPublished(course.id);
                const isExpanded = expandedCourse === course.id;
                const mockResults = getMockStudentResults(course.code);

                // Calculate grade distribution
                const gradeDistribution = mockResults.reduce((acc, student) => {
                  acc[student.grade] = (acc[student.grade] || 0) + 1;
                  return acc;
                }, {});

                const averageScore = Math.round(mockResults.reduce((sum, s) => sum + s.overall, 0) / mockResults.length);

                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Course Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-base text-text">{course.name}</h3>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                                {course.code}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mb-2">{course.description}</p>
                            <div className="flex items-center space-x-3 text-xs text-text-secondary">
                              <span>{mockResults.length} Students</span>
                              <span>•</span>
                              <span>Average: {averageScore}%</span>
                              <span>•</span>
                              <span>{course.instructor}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPublished ? (
                            <>
                              <Eye className="w-5 h-5 text-green-600" />
                              <span className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">
                                PUBLISHED
                              </span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-5 h-5 text-gray-500" />
                              <span className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold">
                                UNPUBLISHED
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Grade Distribution */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {Object.entries(gradeDistribution).map(([grade, count]) => (
                          <div key={grade} className={`${getGradeColor(grade)} rounded-lg p-2 text-center`}>
                            <p className="text-lg font-black">{grade}</p>
                            <p className="text-xs font-bold">{count} students</p>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleExpandCourse(course.id)}
                          className="flex-1 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors text-sm"
                        >
                          {isExpanded ? 'Hide' : 'Review'} Student Results
                        </button>
                        {isPublished ? (
                          <button
                            onClick={() => handleUnpublishResults(course.id, course.name)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Unpublish Results
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishResults(course.id, course.name)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                          >
                            <Unlock className="w-4 h-4" />
                            Publish Results
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Student Results Table */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-5 bg-gray-50">
                        <h4 className="text-sm font-bold text-text mb-3">Student Results Breakdown</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-200 text-text-secondary">
                                <th className="px-3 py-2 text-left font-bold">Student ID</th>
                                <th className="px-3 py-2 text-left font-bold">Name</th>
                                <th className="px-3 py-2 text-center font-bold">Assignments</th>
                                <th className="px-3 py-2 text-center font-bold">Tests</th>
                                <th className="px-3 py-2 text-center font-bold">Midterm</th>
                                <th className="px-3 py-2 text-center font-bold">Final</th>
                                <th className="px-3 py-2 text-center font-bold">Overall</th>
                                <th className="px-3 py-2 text-center font-bold">Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockResults.map((student, idx) => (
                                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-3 py-2 font-semibold">{student.studentId}</td>
                                  <td className="px-3 py-2 font-semibold">{student.name}</td>
                                  <td className="px-3 py-2 text-center">{student.assignments}%</td>
                                  <td className="px-3 py-2 text-center">{student.tests}%</td>
                                  <td className="px-3 py-2 text-center">{student.midterm}%</td>
                                  <td className="px-3 py-2 text-center">{student.final}%</td>
                                  <td className="px-3 py-2 text-center font-bold">{student.overall}%</td>
                                  <td className="px-3 py-2 text-center">
                                    <span className={`px-2 py-1 rounded font-bold ${getGradeColor(student.grade)}`}>
                                      {student.grade}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                        );
                      })}
                      </div>
                    )}
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

export default ResultPublisher;
