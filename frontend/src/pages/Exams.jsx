import React, { useState } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useEnrollment } from '../context/EnrollmentContext';
import { FileText, CheckCircle, Clock, AlertCircle, Award, BookOpen, X } from 'lucide-react';

const Exams = () => {
  const { enrolledCourses, updateCourseAssessment, updateCourseProgress } = useEnrollment();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [examType, setExamType] = useState(null); // 'midterm' or 'final'
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [alert, setAlert] = useState(null);

  // Generate exam questions for a course
  const generateExamQuestions = (course) => {
    const questions = [
      {
        id: 1,
        question: `What is the primary focus of ${course.name}?`,
        options: [
          'Building foundational skills',
          'Advanced theoretical concepts',
          'Practical application and projects',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 2,
        question: `Which skill is most essential for success in ${course.name}?`,
        options: [
          'Problem-solving abilities',
          'Creative thinking',
          'Technical expertise',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: `What tools or technologies are commonly used in ${course.name}?`,
        options: [
          'Industry-standard software',
          'Open-source frameworks',
          'Commercial platforms',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 4,
        question: `How does completing ${course.name} contribute to your career development?`,
        options: [
          'Builds foundational knowledge',
          'Develops practical, job-ready skills',
          'Enhances your professional portfolio',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 5,
        question: `What type of project is typically required in ${course.name}?`,
        options: [
          'Research paper',
          'Practical hands-on application',
          'Theoretical case study',
          'Group presentation only'
        ],
        correctAnswer: 1
      },
      {
        id: 6,
        question: `Which learning approach is most effective for ${course.name}?`,
        options: [
          'Theory-focused study',
          'Practice-only approach',
          'Balanced theory and hands-on practice',
          'Exam-focused preparation'
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: `What best practice should you follow when studying ${course.name}?`,
        options: [
          'Continuous learning and practice',
          'Last-minute cramming',
          'Memorization only',
          'Skip practical exercises'
        ],
        correctAnswer: 0
      },
      {
        id: 8,
        question: `What is the expected outcome after completing ${course.name}?`,
        options: [
          'Job-ready professional skills',
          'Basic theoretical knowledge only',
          'Certificate of completion only',
          'Networking opportunities'
        ],
        correctAnswer: 0
      },
      {
        id: 9,
        question: `Which industry demand does ${course.name} address?`,
        options: [
          'Current market needs',
          'Future technology trends',
          'Essential professional skills',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: 10,
        question: `Why is ${course.name} important for completing your program?`,
        options: [
          'Required for graduation',
          'Builds essential career skills',
          'Meets industry demand',
          'All of the above'
        ],
        correctAnswer: 3
      }
    ];

    return questions;
  };

  const startExam = (course, type) => {
    // Check if exam already taken
    if (type === 'midterm' && course.midterm) {
      showAlert('You have already completed the midterm exam for this course', 'error');
      return;
    }
    if (type === 'final' && course.finalExam) {
      showAlert('You have already completed the final exam for this course', 'error');
      return;
    }

    // Check prerequisites for final exam
    if (type === 'final') {
      const hasAssignments = (course.assignments || []).length > 0;
      const hasTests = (course.tests || []).length > 0;
      const hasMidterm = !!course.midterm;
      const midtermScore = course.midterm?.score || 0;

      if (!hasAssignments || !hasTests || !hasMidterm) {
        showAlert('You must complete assignments, tests, and midterm before taking the final exam', 'error');
        return;
      }

      // Check if midterm score is at least 75%
      if (midtermScore < 75) {
        showAlert(`You must score at least 75% on the midterm exam to take the final exam. Your current midterm score: ${midtermScore}%`, 'error');
        return;
      }
    }

    setSelectedCourse(course);
    setExamType(type);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitExam = () => {
    const questions = generateExamQuestions(selectedCourse);

    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      showAlert('Please answer all questions before submitting', 'error');
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Save exam results
    const examData = {
      score: score,
      weight: 20,
      submittedAt: new Date().toISOString()
    };

    updateCourseAssessment(selectedCourse.id, examType === 'midterm' ? 'midterm' : 'finalExam', examData);
    updateCourseProgress(selectedCourse.id);

    setExamResults({
      score,
      correctAnswers,
      totalQuestions: questions.length,
      passed: score >= 60
    });
    setShowResults(true);

    showAlert(`Exam submitted successfully! Score: ${score}%`, 'success');
  };

  const closeExam = () => {
    setSelectedCourse(null);
    setExamType(null);
    setAnswers({});
    setShowResults(false);
    setExamResults(null);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const getExamStatus = (course, type) => {
    if (type === 'midterm') {
      return course.midterm ? 'completed' : 'available';
    } else {
      if (course.finalExam) return 'completed';

      const hasAssignments = (course.assignments || []).length > 0;
      const hasTests = (course.tests || []).length > 0;
      const hasMidterm = !!course.midterm;
      const midtermScore = course.midterm?.score || 0;

      if (!hasAssignments || !hasTests || !hasMidterm) {
        return 'locked';
      }

      // Check if midterm score is at least 75%
      if (midtermScore < 75) {
        return 'locked';
      }

      return 'available';
    }
  };

  const getStatusBadge = (status, score = null) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg text-xs font-bold text-success">
              COMPLETED
            </span>
            {score !== null && (
              <span className="px-3 py-1 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg text-xs font-bold text-primary">
                {score}%
              </span>
            )}
          </div>
        );
      case 'available':
        return (
          <span className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold text-blue-700">
            AVAILABLE
          </span>
        );
      case 'locked':
        return (
          <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">
            LOCKED
          </span>
        );
      default:
        return null;
    }
  };

  if (selectedCourse && !showResults) {
    // Exam taking view
    const questions = generateExamQuestions(selectedCourse);

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
                  <h1 className="text-2xl font-black text-text">
                    {examType === 'midterm' ? 'Midterm' : 'Final'} Exam - {selectedCourse.name}
                  </h1>
                  <p className="text-sm text-text-secondary font-medium">
                    {selectedCourse.code} • 10 Questions • 20% of Final Grade
                  </p>
                </div>
                <button
                  onClick={closeExam}
                  className="px-4 py-2 bg-gray-100 text-text rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Exam Instructions</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Answer all 10 questions before submitting</li>
                    <li>• Each question has 4 options, select the best answer</li>
                    <li>• You must score at least 60% to pass</li>
                    <li>• This exam can only be taken once</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text mb-4">{q.question}</h3>
                      <div className="space-y-3">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              answers[q.id] === optionIndex
                                ? 'border-primary bg-blue-50'
                                : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={answers[q.id] === optionIndex}
                              onChange={() => handleAnswerChange(q.id, optionIndex)}
                              className="w-5 h-5 text-primary"
                            />
                            <span className="ml-3 text-sm font-medium text-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={submitExam}
                className="px-8 py-4 bg-primary text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                Submit Exam
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (showResults) {
    // Results view
    return (
      <div className="flex h-screen bg-gray-50">
        <EnrolledStudentSidebar />

        <div className="flex-1 overflow-y-auto">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-black text-text">Exam Results</h1>
            </div>
          </header>

          <main className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="max-w-2xl w-full">
              {/* Results Card */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-primary p-8 text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  examResults.passed ? 'bg-success' : 'bg-warning'
                } bg-opacity-10`}>
                  {examResults.passed ? (
                    <CheckCircle className={`w-12 h-12 ${examResults.passed ? 'text-success' : 'text-warning'}`} />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-warning" />
                  )}
                </div>

                <h2 className="text-3xl font-black text-text mb-2">
                  {examResults.passed ? 'Congratulations!' : 'Keep Trying!'}
                </h2>
                <p className="text-text-secondary mb-6">
                  {examResults.passed
                    ? 'You have successfully completed the exam'
                    : 'You did not pass this time, but keep studying!'}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-bold text-text-secondary uppercase mb-1">Score</p>
                    <p className="text-3xl font-black text-primary">{examResults.score}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-bold text-text-secondary uppercase mb-1">Correct</p>
                    <p className="text-3xl font-black text-success">{examResults.correctAnswers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-bold text-text-secondary uppercase mb-1">Total</p>
                    <p className="text-3xl font-black text-text">{examResults.totalQuestions}</p>
                  </div>
                </div>

                <button
                  onClick={closeExam}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Back to Exams
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Main exams list view
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
                <h1 className="text-2xl font-black text-text">Exams & Assessments</h1>
                <p className="text-sm text-text-secondary font-medium">
                  Take midterm and final exams for your enrolled courses
                </p>
              </div>
              <div className="px-3 py-1.5 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
                <p className="text-xs font-bold text-primary">{enrolledCourses.length} Courses</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
              <p className="text-gray-600">
                You haven't enrolled in any courses yet. Start by browsing available courses.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCourses.map(course => {
                const midtermStatus = getExamStatus(course, 'midterm');
                const finalStatus = getExamStatus(course, 'final');

                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-text mb-1">{course.name}</h3>
                          <p className="text-sm text-text-secondary font-medium">{course.code} • {course.credits} Credits</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-text-secondary" />
                              <span className="text-xs text-text-secondary font-semibold">
                                Progress: {course.progress || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Midterm Exam */}
                      <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-text">Midterm Exam</h4>
                          {getStatusBadge(midtermStatus, course.midterm?.score)}
                        </div>
                        <p className="text-xs text-text-secondary mb-3">10 Questions • 20% of Final Grade</p>
                        {midtermStatus === 'available' && (
                          <button
                            onClick={() => startExam(course, 'midterm')}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm"
                          >
                            Start Midterm
                          </button>
                        )}
                        {midtermStatus === 'completed' && (
                          <div className="px-4 py-2 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg text-center">
                            <p className="text-xs font-bold text-success">Completed</p>
                          </div>
                        )}
                      </div>

                      {/* Final Exam */}
                      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-text">Final Exam</h4>
                          {getStatusBadge(finalStatus, course.finalExam?.score)}
                        </div>
                        <p className="text-xs text-text-secondary mb-3">10 Questions • 20% of Final Grade</p>
                        {finalStatus === 'available' && (
                          <button
                            onClick={() => startExam(course, 'final')}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm"
                          >
                            Start Final Exam
                          </button>
                        )}
                        {finalStatus === 'completed' && (
                          <div className="px-4 py-2 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg text-center">
                            <p className="text-xs font-bold text-success">Completed</p>
                          </div>
                        )}
                        {finalStatus === 'locked' && (
                          <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 text-center">
                              {!course.midterm
                                ? 'Complete assignments, tests & midterm first'
                                : course.midterm.score < 75
                                ? `Midterm score (${course.midterm.score}%) must be ≥ 75%`
                                : 'Complete assignments & tests first'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Exams;
