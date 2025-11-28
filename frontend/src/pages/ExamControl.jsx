import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useReviewer } from '../context/ReviewerContext';
import { getAllPrograms, getCoursesByProgram } from '../data/courseData';
import { CheckCircle, X, AlertCircle, ClipboardCheck, Lock, Unlock, Search } from 'lucide-react';

const ExamControl = () => {
  const {
    publishMidtermExam,
    unpublishMidtermExam,
    publishFinalExam,
    unpublishFinalExam,
    isMidtermPublished,
    isFinalPublished
  } = useReviewer();

  const [selectedProgram, setSelectedProgram] = useState('Web Development');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  const programs = getAllPrograms();
  const courses = getCoursesByProgram(selectedProgram);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePublishMidterm = (courseId, courseName) => {
    const result = publishMidtermExam(courseId);
    showAlert(`Midterm exam published for ${courseName}. Students can now take it!`, 'success');
  };

  const handleUnpublishMidterm = (courseId, courseName) => {
    const result = unpublishMidtermExam(courseId);
    showAlert(`Midterm exam unpublished for ${courseName}.`, 'success');
  };

  const handlePublishFinal = (courseId, courseName) => {
    const result = publishFinalExam(courseId);
    showAlert(`Final exam published for ${courseName}. Students can now take it!`, 'success');
  };

  const handleUnpublishFinal = (courseId, courseName) => {
    const result = unpublishFinalExam(courseId);
    showAlert(`Final exam unpublished for ${courseName}.`, 'success');
  };

  const handleBatchPublish = (examType) => {
    let count = 0;
    filteredCourses.forEach(course => {
      if (examType === 'midterm') {
        if (!isMidtermPublished(course.id)) {
          publishMidtermExam(course.id);
          count++;
        }
      } else {
        if (!isFinalPublished(course.id)) {
          publishFinalExam(course.id);
          count++;
        }
      }
    });

    if (count > 0) {
      showAlert(`Published ${examType} exams for ${count} courses in ${selectedProgram}!`, 'success');
    } else {
      showAlert(`All ${examType} exams already published for ${selectedProgram}.`, 'info');
    }
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
            <h3 className="text-sm font-bold text-text mb-3">Batch Actions for {selectedProgram}</h3>
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

          {/* Courses List */}
          <div>
            <h2 className="text-lg font-bold text-text mb-3">
              Courses in {selectedProgram} ({filteredCourses.length})
            </h2>

            <div className="space-y-3">
              {filteredCourses.map(course => {
                const midtermPub = isMidtermPublished(course.id);
                const finalPub = isFinalPublished(course.id);

                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                          <ClipboardCheck className="w-6 h-6 text-primary" />
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
                            <span>{course.credits} Credits</span>
                            <span>•</span>
                            <span>{course.instructor}</span>
                            <span>•</span>
                            <span>{course.schedule}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Midterm Exam Control */}
                      <div className={`border-2 rounded-lg p-4 ${
                        midtermPub ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-text">Midterm Exam</h4>
                          <div className="flex items-center gap-2">
                            {midtermPub ? (
                              <>
                                <Unlock className="w-4 h-4 text-green-600" />
                                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">
                                  PUBLISHED
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 text-gray-500" />
                                <span className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold">
                                  UNPUBLISHED
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {midtermPub ? (
                          <button
                            onClick={() => handleUnpublishMidterm(course.id, course.name)}
                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Unpublish Midterm
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishMidterm(course.id, course.name)}
                            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Unlock className="w-4 h-4" />
                            Publish Midterm
                          </button>
                        )}
                      </div>

                      {/* Final Exam Control */}
                      <div className={`border-2 rounded-lg p-4 ${
                        finalPub ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-text">Final Exam</h4>
                          <div className="flex items-center gap-2">
                            {finalPub ? (
                              <>
                                <Unlock className="w-4 h-4 text-purple-600" />
                                <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-bold">
                                  PUBLISHED
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 text-gray-500" />
                                <span className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold">
                                  UNPUBLISHED
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {finalPub ? (
                          <button
                            onClick={() => handleUnpublishFinal(course.id, course.name)}
                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Unpublish Final
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublishFinal(course.id, course.name)}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <Unlock className="w-4 h-4" />
                            Publish Final
                          </button>
                        )}
                      </div>
                    </div>
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
