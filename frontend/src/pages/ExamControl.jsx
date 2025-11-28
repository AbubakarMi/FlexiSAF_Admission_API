import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import courseService from '../services/courseService';
import examService from '../services/examService';
import { CheckCircle, X, AlertCircle, ClipboardCheck, Lock, Unlock, Search, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

const ExamControl = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const [examStatus, setExamStatus] = useState({});
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

      // Fetch exam status for each course
      const statusMap = {};
      for (const course of coursesArray) {
        try {
          const status = await examService.getExamStatus(course.id);
          statusMap[course.id] = status;
        } catch (error) {
          statusMap[course.id] = { midtermPublished: false, finalPublished: false };
        }
      }
      setExamStatus(statusMap);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
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

  const handlePublishMidterm = async (courseId, courseName) => {
    try {
      await examService.publishExam(courseId);
      await fetchCourses();
      showAlert(`Midterm exam published for ${courseName}. Students can now take it!`, 'success');
    } catch (error) {
      console.error('Error publishing midterm:', error);
      showAlert('Failed to publish midterm exam', 'error');
    }
  };

  const handleUnpublishMidterm = async (courseId, courseName) => {
    try {
      await examService.unpublishExam(courseId);
      await fetchCourses();
      showAlert(`Midterm exam unpublished for ${courseName}.`, 'success');
    } catch (error) {
      console.error('Error unpublishing midterm:', error);
      showAlert('Failed to unpublish midterm exam', 'error');
    }
  };

  const handlePublishFinal = async (courseId, courseName) => {
    try {
      await examService.publishExam(courseId);
      await fetchCourses();
      showAlert(`Final exam published for ${courseName}. Students can now take it!`, 'success');
    } catch (error) {
      console.error('Error publishing final:', error);
      showAlert('Failed to publish final exam', 'error');
    }
  };

  const handleUnpublishFinal = async (courseId, courseName) => {
    try {
      await examService.unpublishExam(courseId);
      await fetchCourses();
      showAlert(`Final exam unpublished for ${courseName}.`, 'success');
    } catch (error) {
      console.error('Error unpublishing final:', error);
      showAlert('Failed to unpublish final exam', 'error');
    }
  };

  const handleBatchPublish = async (examType) => {
    let count = 0;
    const promises = [];

    for (const course of filteredCourses) {
      const status = examStatus[course.id] || {};
      if (examType === 'midterm' && !status.midtermPublished) {
        promises.push(examService.publishExam(course.id));
        count++;
      } else if (examType === 'final' && !status.finalPublished) {
        promises.push(examService.publishExam(course.id));
        count++;
      }
    }

    try {
      await Promise.all(promises);
      await fetchCourses();
      if (count > 0) {
        showAlert(`Published ${examType} exams for ${count} courses!`, 'success');
      } else {
        showAlert(`All ${examType} exams already published.`, 'info');
      }
    } catch (error) {
      console.error('Error in batch publish:', error);
      showAlert('Failed to publish some exams', 'error');
    }
  };

  const isMidtermPublished = (courseId) => {
    return examStatus[courseId]?.midtermPublished || false;
  };

  const isFinalPublished = (courseId) => {
    return examStatus[courseId]?.finalPublished || false;
  };

  const getPublicationStats = () => {
    const totalCourses = courses.length;
    const midtermPublished = courses.filter(c => isMidtermPublished(c.id)).length;
    const finalPublished = courses.filter(c => isFinalPublished(c.id)).length;

    return {
      totalCourses,
      midtermPublished,
      midtermPending: totalCourses - midtermPublished,
      finalPublished,
      finalPending: totalCourses - finalPublished
    };
  };

  const stats = getPublicationStats();

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
                <h1 className="text-2xl font-black text-text">Exam Control Center</h1>
                <p className="text-sm text-text-secondary font-medium">
                  Publish and manage exam availability for students
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
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Exam Publication Control</h4>
                <p className="text-xs text-blue-800">
                  Students can only access exams that you have published. Use this dashboard to control when
                  midterm and final exams become available to students. Unpublishing an exam will immediately
                  hide it from students.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Total Courses</p>
              <p className="text-3xl font-black text-text">{stats.totalCourses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-5">
              <p className="text-xs font-bold text-green-700 uppercase mb-1">Midterms Published</p>
              <p className="text-3xl font-black text-green-600">{stats.midtermPublished}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-purple-500 p-5">
              <p className="text-xs font-bold text-purple-700 uppercase mb-1">Finals Published</p>
              <p className="text-3xl font-black text-purple-600">{stats.finalPublished}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Pending</p>
              <p className="text-3xl font-black text-orange-600">{stats.midtermPending + stats.finalPending}</p>
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
            <h3 className="text-sm font-bold text-text mb-3">Batch Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBatchPublish('midterm')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Publish All Midterms
              </button>
              <button
                onClick={() => handleBatchPublish('final')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Publish All Finals
              </button>
            </div>
          </div>

          {/* Courses List - Grouped by Program */}
          <div>
            <h2 className="text-lg font-bold text-text mb-3">
              Courses ({filteredCourses.length})
            </h2>

            <div className="space-y-3">
              {Object.entries(groupCoursesByProgram()).map(([program, programCourses]) => {
                const isExpanded = expandedPrograms[program];
                const midtermCount = programCourses.filter(c => isMidtermPublished(c.id)).length;
                const finalCount = programCourses.filter(c => isFinalPublished(c.id)).length;

                return (
                  <div key={program} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Program Header - Clickable Accordion */}
                    <div
                      onClick={() => toggleProgram(program)}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                          <ClipboardCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-text">{program}</h3>
                          <p className="text-xs text-text-secondary">{programCourses.length} courses</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                          Midterm: {midtermCount}/{programCourses.length}
                        </div>
                        <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                          Final: {finalCount}/{programCourses.length}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Course List */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-3">
                        {programCourses.map(course => {
                          const midtermPub = isMidtermPublished(course.id);
                          const finalPub = isFinalPublished(course.id);

                          return (
                            <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-bold text-sm text-text">{course.name}</h4>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                                      {course.code}
                                    </span>
                                  </div>
                                  <p className="text-xs text-text-secondary mb-2">{course.description}</p>
                                  <div className="flex items-center space-x-3 text-xs text-text-secondary">
                                    <span>{course.credits} Credits</span>
                                    <span>•</span>
                                    <span>{course.instructor}</span>
                                    <span>•</span>
                                    <span>{course.schedule}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Midterm Exam Control */}
                                <div className={`border-2 rounded-lg p-3 ${
                                  midtermPub ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xs font-bold text-text">Midterm Exam</h5>
                                    <div className="flex items-center gap-1">
                                      {midtermPub ? (
                                        <>
                                          <Unlock className="w-3 h-3 text-green-600" />
                                          <span className="px-2 py-0.5 bg-green-600 text-white rounded text-xs font-bold">
                                            PUBLISHED
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="w-3 h-3 text-gray-500" />
                                          <span className="px-2 py-0.5 bg-gray-500 text-white rounded text-xs font-bold">
                                            UNPUBLISHED
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {midtermPub ? (
                                    <button
                                      onClick={() => handleUnpublishMidterm(course.id, course.name)}
                                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors text-xs flex items-center justify-center gap-2"
                                    >
                                      <Lock className="w-3 h-3" />
                                      Unpublish
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublishMidterm(course.id, course.name)}
                                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-xs flex items-center justify-center gap-2"
                                    >
                                      <Unlock className="w-3 h-3" />
                                      Publish
                                    </button>
                                  )}
                                </div>

                                {/* Final Exam Control */}
                                <div className={`border-2 rounded-lg p-3 ${
                                  finalPub ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xs font-bold text-text">Final Exam</h5>
                                    <div className="flex items-center gap-1">
                                      {finalPub ? (
                                        <>
                                          <Unlock className="w-3 h-3 text-purple-600" />
                                          <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs font-bold">
                                            PUBLISHED
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="w-3 h-3 text-gray-500" />
                                          <span className="px-2 py-0.5 bg-gray-500 text-white rounded text-xs font-bold">
                                            UNPUBLISHED
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {finalPub ? (
                                    <button
                                      onClick={() => handleUnpublishFinal(course.id, course.name)}
                                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors text-xs flex items-center justify-center gap-2"
                                    >
                                      <Lock className="w-3 h-3" />
                                      Unpublish
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublishFinal(course.id, course.name)}
                                      className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors text-xs flex items-center justify-center gap-2"
                                    >
                                      <Unlock className="w-3 h-3" />
                                      Publish
                                    </button>
                                  )}
                                </div>
                              </div>
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

export default ExamControl;
