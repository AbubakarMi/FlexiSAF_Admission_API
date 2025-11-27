import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useEnrollment } from '../context/EnrollmentContext';
import { FileText, TrendingUp, Award, Download, ChevronDown, ChevronUp } from 'lucide-react';

const GradesResults = () => {
  const navigate = useNavigate();
  const { enrolledCourses, calculateGPA } = useEnrollment();
  const [selectedSemester, setSelectedSemester] = useState('Spring 2025');
  const [expandedCourse, setExpandedCourse] = useState(null);

  const semesters = [
    'Spring 2025',
    'Fall 2024',
    'Spring 2024',
    'Fall 2023'
  ];

  // Use real enrolled courses with calculated grades
  const getGradePoints = (grade) => {
    const gradeMap = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.5, 'B': 3.0, 'B-': 2.7,
      'C+': 2.5, 'C': 2.0, 'C-': 1.7,
      'D+': 1.5, 'D': 1.0,
      'F': 0.0
    };
    return gradeMap[grade] || 0;
  };

  const calculateCourseGrade = (course) => {
    const assignments = course.assignments || [];
    const tests = course.tests || [];
    const midterm = course.midterm || { score: 0, weight: 0 };
    const finalExam = course.finalExam || { score: Math.floor(Math.random() * 16) + 85, weight: 20 };

    const assignmentAvg = assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length;
    const testAvg = tests.reduce((sum, t) => sum + t.score, 0) / tests.length;

    const total = (assignmentAvg * 0.3) + (testAvg * 0.3) + (midterm.score * 0.2) + (finalExam.score * 0.2);

    if (total >= 90) return 'A';
    if (total >= 85) return 'A-';
    if (total >= 80) return 'B+';
    if (total >= 75) return 'B';
    if (total >= 70) return 'B-';
    if (total >= 65) return 'C+';
    if (total >= 60) return 'C';
    return 'D';
  };

  // Format enrolled courses for grades display
  const currentCourses = enrolledCourses.map(course => {
    const grade = course.grade || calculateCourseGrade(course);
    const assignments = course.assignments || [];
    const tests = course.tests || [];
    const midterm = course.midterm || { score: 0, weight: 20 };
    const finalExam = course.finalExam || { score: Math.floor(Math.random() * 16) + 85, weight: 20 };

    const assignmentAvg = assignments.length > 0 ? assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length : 0;
    const testAvg = tests.length > 0 ? tests.reduce((sum, t) => sum + t.score, 0) / tests.length : 0;

    const overall = Math.round((assignmentAvg * 0.3) + (testAvg * 0.3) + (midterm.score * 0.2) + (finalExam.score * 0.2));

    return {
      ...course,
      grade,
      gradePoints: getGradePoints(grade),
      overall,
      breakdown: {
        assignments: course.assignments || [],
        tests: course.tests || [],
        midterm: course.midterm || { score: 0, weight: 20 },
        finalExam: course.finalExam || { score: Math.floor(Math.random() * 16) + 85, weight: 20 }
      }
    };
  });

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 80) return 'text-blue-600 font-semibold';
    if (score >= 70) return 'text-yellow-600 font-semibold';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleDownloadTranscript = () => {
    alert('Transcript download will be available soon!');
  };

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
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
                <h1 className="text-2xl font-black text-text">Grades & Results</h1>
                <p className="text-sm text-text-secondary font-medium">View your academic performance, tests and exam results</p>
              </div>
              <button
                onClick={handleDownloadTranscript}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Download Transcript
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* GPA Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border-2 border-primary p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wide">Current GPA</h3>
                <Award className="w-6 h-6 text-primary" />
              </div>
              <p className="text-5xl font-black text-primary mb-1">{calculateGPA()}</p>
              <p className="text-text-secondary text-xs font-bold">out of 4.0</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wide">Credits Earned</h3>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-5xl font-black text-green-600 mb-1">
                {currentCourses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
              <p className="text-text-secondary text-xs font-bold">this semester</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wide">Courses</h3>
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-5xl font-black text-purple-600 mb-1">{currentCourses.length}</p>
              <p className="text-text-secondary text-xs font-bold">enrolled</p>
            </div>
          </div>

          {/* Semester Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <label className="block text-xs font-bold text-text-secondary mb-2">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          {/* Course Grades */}
          <div>
            <h2 className="text-lg font-bold text-text mb-3">Course Grades - {selectedSemester}</h2>

            {currentCourses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet. Start by browsing available courses.</p>
                <button
                  onClick={() => navigate('/enrolled/courses')}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Course Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCourseExpansion(course.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{course.code.substring(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-sm text-text">{course.name}</p>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">
                              {course.code}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                              {course.credits} Credits
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary">Click to view detailed breakdown</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-xs text-text-secondary mb-0.5">Overall</p>
                          <p className={`text-lg font-black ${getScoreColor(course.overall)}`}>{course.overall}%</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </div>
                        {expandedCourse === course.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedCourse === course.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Assignments */}
                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Assignments</h4>
                          <div className="space-y-2">
                            {course.breakdown.assignments.map((assignment, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white rounded p-2 text-xs">
                                <span className="font-medium text-text">{assignment.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className={getScoreColor(assignment.score)}>{assignment.score}%</span>
                                  <span className="text-text-secondary">({assignment.weight}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tests/Quizzes */}
                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Tests & Quizzes</h4>
                          <div className="space-y-2">
                            {course.breakdown.tests.map((test, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white rounded p-2 text-xs">
                                <span className="font-medium text-text">{test.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className={getScoreColor(test.score)}>{test.score}%</span>
                                  <span className="text-text-secondary">({test.weight}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Exams */}
                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Midterm Exam</h4>
                          <div className="bg-white rounded p-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-text">Midterm Examination</span>
                              <div className="flex items-center space-x-2">
                                <span className={getScoreColor(course.breakdown.midterm.score)}>{course.breakdown.midterm.score}%</span>
                                <span className="text-text-secondary">({course.breakdown.midterm.weight}%)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Final Exam</h4>
                          <div className="bg-white rounded p-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-text">Final Examination</span>
                              <div className="flex items-center space-x-2">
                                <span className={getScoreColor(course.breakdown.finalExam.score)}>{course.breakdown.finalExam.score}%</span>
                                <span className="text-text-secondary">({course.breakdown.finalExam.weight}%)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Semester Summary */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-text mb-3">Semester Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-text-secondary mb-1">Total Credits</p>
                <p className="text-2xl font-black text-text">
                  {currentCourses.reduce((sum, course) => sum + course.credits, 0)}
                </p>
              </div>
              <div className="text-center p-3 bg-primary bg-opacity-10 rounded-lg">
                <p className="text-xs text-primary mb-1">Semester GPA</p>
                <p className="text-2xl font-black text-primary">{calculateGPA()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 mb-1">Average Score</p>
                <p className="text-2xl font-black text-green-700">
                  {Math.round(currentCourses.reduce((sum, course) => sum + course.overall, 0) / currentCourses.length)}%
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700 mb-1">Total Courses</p>
                <p className="text-2xl font-black text-purple-700">{currentCourses.length}</p>
              </div>
            </div>
          </div>

          {/* Grading Scale */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-text mb-3">Grading Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { grade: 'A', range: '90-100', points: '4.0' },
                { grade: 'B', range: '80-89', points: '3.0' },
                { grade: 'C', range: '70-79', points: '2.0' },
                { grade: 'D', range: '60-69', points: '1.0' },
                { grade: 'F', range: '0-59', points: '0.0' }
              ].map(item => (
                <div key={item.grade} className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <p className="text-xl font-black text-text mb-0.5">{item.grade}</p>
                  <p className="text-xs text-text-secondary font-semibold mb-0.5">{item.range}%</p>
                  <p className="text-xs text-text-secondary">{item.points} GPA</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GradesResults;
