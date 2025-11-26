import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicantService from '../services/applicantService';
import Modal from '../components/Modal';

// Comprehensive list of 100+ academic programs worldwide
const ACADEMIC_PROGRAMS = [
  // Computer Science & IT
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Computer Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Information Systems',
  'Web Development',
  'Mobile App Development',
  'Game Development',
  'Network Engineering',
  'Cloud Computing',
  'DevOps Engineering',

  // Engineering
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Environmental Engineering',
  'Industrial Engineering',
  'Petroleum Engineering',
  'Marine Engineering',
  'Agricultural Engineering',
  'Mining Engineering',
  'Structural Engineering',
  'Automotive Engineering',
  'Robotics Engineering',
  'Nuclear Engineering',
  'Materials Engineering',
  'Telecommunications Engineering',

  // Business & Management
  'Business Administration',
  'Business Management',
  'Accounting',
  'Finance',
  'Marketing',
  'Human Resource Management',
  'International Business',
  'Entrepreneurship',
  'Economics',
  'Business Analytics',
  'Supply Chain Management',
  'Project Management',
  'Real Estate Management',
  'Hospitality Management',
  'Tourism Management',
  'Sports Management',

  // Natural Sciences
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Statistics',
  'Biochemistry',
  'Microbiology',
  'Biotechnology',
  'Genetics',
  'Molecular Biology',
  'Environmental Science',
  'Marine Biology',
  'Astronomy',
  'Geology',
  'Meteorology',
  'Zoology',
  'Botany',

  // Health Sciences & Medicine
  'Medicine (MBBS/MD)',
  'Nursing',
  'Pharmacy',
  'Dentistry',
  'Public Health',
  'Physiotherapy',
  'Occupational Therapy',
  'Radiography',
  'Medical Laboratory Science',
  'Nutrition and Dietetics',
  'Veterinary Medicine',
  'Speech Therapy',
  'Optometry',
  'Health Information Management',

  // Social Sciences
  'Psychology',
  'Sociology',
  'Political Science',
  'International Relations',
  'Social Work',
  'Anthropology',
  'Geography',
  'Criminology',
  'Public Administration',
  'Development Studies',

  // Arts & Humanities
  'English Language and Literature',
  'History',
  'Philosophy',
  'Linguistics',
  'Religious Studies',
  'Fine Arts',
  'Graphic Design',
  'Fashion Design',
  'Interior Design',
  'Music',
  'Theater Arts',
  'Film and Media Studies',
  'Creative Writing',
  'Art History',

  // Law
  'Law (LLB)',
  'Corporate Law',
  'Criminal Law',
  'International Law',
  'Human Rights Law',

  // Education
  'Education',
  'Early Childhood Education',
  'Special Education',
  'Educational Psychology',
  'Curriculum and Instruction',
  'Educational Technology',

  // Architecture & Planning
  'Architecture',
  'Urban Planning',
  'Landscape Architecture',
  'Quantity Surveying',
  'Building Technology',

  // Agriculture
  'Agriculture',
  'Agricultural Economics',
  'Animal Science',
  'Crop Science',
  'Food Science and Technology',
  'Fisheries',
  'Forestry',

  // Communication & Media
  'Mass Communication',
  'Journalism',
  'Public Relations',
  'Broadcasting',
  'Digital Media',
  'Advertising',

  // Other Programs
  'Library and Information Science',
  'Aviation',
  'Actuarial Science',
  'Insurance',
  'Banking and Finance',
  'Logistics and Transportation'
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    program: '',
    gpa: '',
    testScore: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingApplication, setFetchingApplication] = useState(true);
  const [success, setSuccess] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing application on mount
  useEffect(() => {
    const fetchMyApplication = async () => {
      try {
        setFetchingApplication(true);
        const application = await applicantService.getMyApplication();
        setExistingApplication(application);
      } catch (err) {
        // No existing application found, that's okay
        console.log('No existing application found');
      } finally {
        setFetchingApplication(false);
      }
    };

    fetchMyApplication();
  }, []);

  // Pre-fill user data from context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.program.trim()) newErrors.program = 'Program is required';

    const gpa = parseFloat(formData.gpa);
    if (!formData.gpa) {
      newErrors.gpa = 'GPA is required';
    } else if (isNaN(gpa) || gpa < 0 || gpa > 5) {
      newErrors.gpa = 'GPA must be between 0.0 and 5.0';
    }

    const testScore = parseInt(formData.testScore);
    if (!formData.testScore) {
      newErrors.testScore = 'Test score is required';
    } else if (isNaN(testScore) || testScore < 0 || testScore > 100) {
      newErrors.testScore = 'Test score must be between 0 and 100';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await applicantService.createApplicant({
        ...formData,
        gpa: parseFloat(formData.gpa),
        testScore: parseInt(formData.testScore)
      });

      setSuccess(true);
      setAiResult(response);
      setExistingApplication(response);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setSuccess(false);
        setAiResult(null);
      }, 10000);
    } catch (err) {
      const apiErrors = {};
      if (err.response?.data?.errors) {
        Object.assign(apiErrors, err.response.data.errors);
      } else {
        const errorMsg = err.response?.data?.detail || 'Failed to submit application. Please try again.';
        apiErrors.submit = errorMsg;
        setErrorMessage(errorMsg);
        setShowErrorModal(true);
      }
      setErrors(apiErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Loading state while fetching application
  if (fetchingApplication) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-xl font-semibold text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Clean Design */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Left Side - Branding */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FlexiSAF Admissions</h1>
                <p className="text-xs text-gray-500 font-medium">Student Application Portal</p>
              </div>
            </div>

            {/* Right Side - User Info & Actions */}
            <div className="flex items-center gap-3">
              {/* User Profile Card */}
              <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md">
                  {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Student Account</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Existing Application View */}
        {existingApplication ? (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-text mb-1">Your Application Status</h2>
                  <p className="text-lg text-text-secondary font-medium">Track your admission application progress below</p>
                </div>
              </div>
            </div>

            {/* Application Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-slate-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-text">Application Details</h3>
                  <span className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 shadow-sm ${getStatusBadgeColor(existingApplication.status)}`}>
                    {existingApplication.status || 'PENDING'}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Full Name</p>
                      </div>
                      <p className="text-xl font-bold text-text ml-11">
                        {existingApplication.firstName} {existingApplication.lastName}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Email Address</p>
                      </div>
                      <p className="text-lg font-bold text-text ml-11 break-all">{existingApplication.email}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Program</p>
                      </div>
                      <p className="text-lg font-bold text-text ml-11">{existingApplication.program}</p>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">GPA</p>
                        </div>
                        <p className="text-xs text-blue-700 font-semibold">Weight: 40%</p>
                      </div>
                      <p className="text-5xl font-black text-blue-700 mb-1">{existingApplication.gpa.toFixed(2)}</p>
                      <p className="text-sm text-blue-600 font-bold">out of 5.0</p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-sm font-bold text-purple-900 uppercase tracking-wide">Test Score</p>
                        </div>
                        <p className="text-xs text-purple-700 font-semibold">Weight: 60%</p>
                      </div>
                      <p className="text-5xl font-black text-purple-700 mb-1">{existingApplication.testScore}</p>
                      <p className="text-sm text-purple-600 font-bold">out of 100</p>
                    </div>

                    {existingApplication.aiScore !== null && existingApplication.aiScore !== undefined && (
                      <div className="bg-primary rounded-xl p-6 border-2 border-primary shadow-xl hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <p className="text-sm font-bold text-white uppercase tracking-wide">AI Score</p>
                        </div>
                        <p className="text-5xl font-black text-white mb-1">{existingApplication.aiScore.toFixed(1)}</p>
                        <p className="text-sm text-blue-100 font-bold">out of 100</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Hint */}
                {existingApplication.aiHint && (
                  <div className="mt-8 bg-amber-50 rounded-xl p-6 border-2 border-amber-300 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-black text-amber-900 mb-2 uppercase tracking-wide">AI Recommendation</p>
                        <p className="text-text font-medium leading-relaxed">{existingApplication.aiHint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer Notes */}
              {existingApplication.reviewerNotes && existingApplication.reviewerNotes.length > 0 && (
                <div className="mt-6 bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                  <h4 className="text-lg font-bold text-text mb-4 flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Reviewer Notes
                  </h4>
                  <div className="space-y-3">
                    {existingApplication.reviewerNotes.map((note, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-yellow-300">
                        <p className="text-sm text-text-secondary mb-1">
                          <span className="font-semibold">Reviewer:</span> {note.reviewerName || 'Anonymous'}
                          {note.createdAt && (
                            <span className="ml-2 text-xs">
                              • {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                        <p className="text-text">{note.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Date */}
              {existingApplication.createdAt && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-text-secondary">
                    Application submitted on {new Date(existingApplication.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Information Card */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-blue-900 mb-1">Application Received</p>
                  <p className="text-sm text-blue-700">
                    Your application has been submitted and is being reviewed. You will be notified via email once a decision has been made.
                    If you have any questions, please contact our admissions office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Application Form (shown only if no existing application)
          <>
            {/* Welcome Banner - Premium Design */}
            <div className="mb-10">
              <div className="relative overflow-hidden bg-primary rounded-2xl p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl font-extrabold text-white mb-2">Submit Your Application</h2>
                      <p className="text-lg text-blue-100">Fill in your academic details and get instant AI-powered evaluation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">AI Evaluation</p>
                          <p className="text-blue-100 text-xs">Instant results</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">150+ Programs</p>
                          <p className="text-blue-100 text-xs">Global universities</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Fast Processing</p>
                          <p className="text-blue-100 text-xs">Results in seconds</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Application Form - 2 columns */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {errors.submit && (
                    <div className="m-8 mb-0 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{errors.submit}</span>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="bg-blue-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text">Personal Information</h3>
                        <p className="text-sm text-text-secondary font-medium">Your identity details</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pb-0">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-bold text-text mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          readOnly
                          className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 bg-opacity-30 rounded-xl text-text font-medium focus:outline-none"
                        />
                        {errors.firstName && (
                          <p className="mt-2 text-sm text-danger flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-bold text-text mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          readOnly
                          className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 bg-opacity-30 rounded-xl text-text font-medium focus:outline-none"
                        />
                        {errors.lastName && (
                          <p className="mt-2 text-sm text-danger flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="email" className="block text-sm font-bold text-text mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-blue-200 bg-blue-50 bg-opacity-30 rounded-xl text-text font-medium focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-danger flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label htmlFor="program" className="block text-sm font-bold text-text mb-2">
                        Desired Program *
                      </label>
                      <div className="relative">
                        <select
                          id="program"
                          name="program"
                          value={formData.program}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white ${errors.program ? 'border-danger' : 'border-gray-300'}`}
                        >
                          <option value="">Select a program...</option>
                          {ACADEMIC_PROGRAMS.map((program) => (
                            <option key={program} value={program}>
                              {program}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                          <svg className="fill-current h-5 w-5" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                      {errors.program && (
                        <p className="mt-2 text-sm text-danger flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.program}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-text-secondary">Choose from over 150 academic programs worldwide</p>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="bg-green-50 px-8 py-6 border-y border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text">Academic Information</h3>
                        <p className="text-sm text-text-secondary font-medium">Your academic credentials</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-8 pb-0">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="gpa" className="block text-sm font-bold text-text mb-2">
                          GPA (0.0 - 5.0) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          id="gpa"
                          name="gpa"
                          value={formData.gpa}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.gpa ? 'border-danger' : 'border-gray-300'}`}
                          placeholder="4.50"
                          min="0"
                          max="5"
                        />
                        {errors.gpa && (
                          <p className="mt-2 text-sm text-danger flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.gpa}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-text-secondary">Weight: 40% of total score</p>
                      </div>

                      <div>
                        <label htmlFor="testScore" className="block text-sm font-bold text-text mb-2">
                          Test Score (0 - 100) *
                        </label>
                        <input
                          type="number"
                          id="testScore"
                          name="testScore"
                          value={formData.testScore}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.testScore ? 'border-danger' : 'border-gray-300'}`}
                          placeholder="85"
                          min="0"
                          max="100"
                        />
                        {errors.testScore && (
                          <p className="mt-2 text-sm text-danger flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.testScore}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-text-secondary">Weight: 60% of total score</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="p-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-white py-5 px-8 rounded-xl font-bold text-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform active:scale-100"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Application...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Submit Application
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* AI Information Sidebar - 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-28">
                  {/* Header */}
                  <div className="bg-primary p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <svg className="w-11 h-11 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-2">AI Evaluation</h3>
                      <p className="text-sm text-blue-100 font-semibold">Powered by Advanced Analytics</p>
                    </div>
                  </div>

                  <div className="p-6">
                    {aiResult ? (
                      <div className="space-y-5">
                        {/* AI Score Card */}
                        <div className="bg-primary rounded-xl p-6 text-center shadow-xl border-2 border-primary transform hover:scale-105 transition-all">
                          <p className="text-white text-opacity-90 text-xs font-bold uppercase tracking-widest mb-3">Your AI Score</p>
                          <div className="relative inline-block">
                            <p className="text-6xl font-black text-white mb-1">{aiResult.aiScore || 'N/A'}</p>
                            <p className="text-sm text-white text-opacity-90 font-bold">out of 100</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="bg-green-50 rounded-xl p-5 border-2 border-success text-center shadow-md">
                          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Application Status</p>
                          <p className="text-2xl font-black text-success">{aiResult.status || 'PENDING'}</p>
                        </div>

                        {/* AI Recommendation */}
                        {aiResult.aiHint && (
                          <div className="bg-amber-50 rounded-xl p-5 border-2 border-warning shadow-md">
                            <div className="flex items-center mb-3">
                              <div className="w-9 h-9 bg-warning rounded-xl flex items-center justify-center mr-3 shadow-md">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm font-black text-warning uppercase tracking-wide">AI Recommendation</p>
                            </div>
                            <p className="text-sm text-text leading-relaxed font-medium">{aiResult.aiHint}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* Info Box */}
                        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
                          <p className="text-text font-black text-base mb-5 uppercase tracking-wide">How AI Evaluates Your Application</p>

                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-text text-sm mb-1">GPA Analysis</p>
                                <p className="text-xs text-text-secondary font-semibold">Accounts for 40% of your final score</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3">
                              <div className="w-11 h-11 bg-success rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-text text-sm mb-1">Test Score Review</p>
                                <p className="text-xs text-text-secondary font-semibold">Accounts for 60% of your final score</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3">
                              <div className="w-11 h-11 bg-warning rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-text text-sm mb-1">Instant Decision</p>
                                <p className="text-xs text-text-secondary font-semibold">Accept, Review, or Reject recommendation</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-slate-50 rounded-xl p-6 border-2 border-gray-300 text-center shadow-sm">
                          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <p className="text-base text-text font-black mb-2 uppercase tracking-wide">Submit to Get Results</p>
                          <p className="text-sm text-text-secondary font-medium leading-relaxed">
                            Complete the form and submit your application to receive instant AI-powered evaluation and personalized feedback.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Success Modal */}
      <Modal isOpen={success && aiResult !== null} onClose={() => setSuccess(false)} type="success">
        <h3 className="text-2xl font-bold text-success mb-3">Application Submitted Successfully!</h3>
        <p className="text-text-secondary mb-6">
          Your application has been received and is being processed by our AI system.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-success text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} type="error">
        <h3 className="text-2xl font-bold text-danger mb-3">Submission Failed</h3>
        <p className="text-text-secondary mb-6">
          {errorMessage}
        </p>
        <button
          onClick={() => setShowErrorModal(false)}
          className="px-8 py-3 bg-danger text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutConfirm} onClose={cancelLogout} type="confirm" showCloseButton={false}>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Confirm Logout</h3>
        <p className="text-text-secondary mb-8">
          Are you sure you want to logout? You will need to login again to access your dashboard.
        </p>
        <div className="flex gap-4 justify-center w-full">
          <button
            onClick={cancelLogout}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
