import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicantService from '../services/applicantService';

const SubmitApplication = () => {
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
  const [success, setSuccess] = useState(false);

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
    } else if (isNaN(gpa) || gpa < 0 || gpa > 4) {
      newErrors.gpa = 'GPA must be between 0.0 and 4.0';
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
      await applicantService.createApplicant({
        ...formData,
        gpa: parseFloat(formData.gpa),
        testScore: parseInt(formData.testScore)
      });

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        program: '',
        gpa: '',
        testScore: ''
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const apiErrors = {};
      if (err.response?.data?.errors) {
        Object.assign(apiErrors, err.response.data.errors);
      } else {
        apiErrors.submit = err.response?.data?.detail || 'Failed to submit application. Please try again.';
      }
      setErrors(apiErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with Logout */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">FlexiSAF Admissions</h1>
            <p className="text-sm text-text-secondary">Welcome, {user?.username || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">Submit Your Application</h2>
          <p className="text-lg text-text-secondary">Fill in your academic details below</p>
        </div>

        {success && (
          <div className="mb-6 bg-success bg-opacity-10 border-l-4 border-success text-success px-6 py-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Success!</p>
                <p className="text-sm">Application submitted successfully! Our AI is evaluating your application.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
          {errors.submit && (
            <div className="mb-6 bg-danger bg-opacity-10 border-l-4 border-danger text-danger px-6 py-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text mb-2">Personal Information</h3>
            <div className="h-1 w-20 bg-primary rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-text mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.firstName ? 'border-danger' : 'border-gray-300'}`}
                placeholder="John"
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
              <label htmlFor="lastName" className="block text-sm font-semibold text-text mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.lastName ? 'border-danger' : 'border-gray-300'}`}
                placeholder="Doe"
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

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-danger' : 'border-gray-300'}`}
              placeholder="john.doe@example.com"
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

          <div className="mb-8">
            <label htmlFor="program" className="block text-sm font-semibold text-text mb-2">
              Desired Program *
            </label>
            <input
              type="text"
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.program ? 'border-danger' : 'border-gray-300'}`}
              placeholder="e.g., Computer Science, Engineering, Mathematics"
            />
            {errors.program && (
              <p className="mt-2 text-sm text-danger flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.program}
              </p>
            )}
          </div>

          {/* Academic Information Section */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-text mb-2">Academic Information</h3>
            <div className="h-1 w-20 bg-success rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="gpa" className="block text-sm font-semibold text-text mb-2">
                GPA (0.0 - 4.0) *
              </label>
              <input
                type="number"
                step="0.01"
                id="gpa"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.gpa ? 'border-danger' : 'border-gray-300'}`}
                placeholder="3.75"
                min="0"
                max="4"
              />
              {errors.gpa && (
                <p className="mt-2 text-sm text-danger flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.gpa}
                </p>
              )}
              <p className="mt-2 text-xs text-text-secondary">Weighted: 40% of total score</p>
            </div>

            <div>
              <label htmlFor="testScore" className="block text-sm font-semibold text-text mb-2">
                Test Score (0 - 100) *
              </label>
              <input
                type="number"
                id="testScore"
                name="testScore"
                value={formData.testScore}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.testScore ? 'border-danger' : 'border-gray-300'}`}
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
              <p className="mt-2 text-xs text-text-secondary">Weighted: 60% of total score</p>
            </div>
          </div>

          {/* AI Info Box */}
          <div className="mb-8 bg-primary bg-opacity-5 border border-primary border-opacity-30 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">AI-Powered Evaluation</p>
                <p className="text-xs text-text-secondary">
                  Your application will be automatically evaluated using our advanced AI algorithm. You'll receive an instant preliminary assessment based on your GPA and test score.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Application...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Application
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitApplication;
