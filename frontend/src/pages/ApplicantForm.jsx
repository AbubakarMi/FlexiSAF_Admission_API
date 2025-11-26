import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import applicantService from '../services/applicantService';

const ApplicantForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
    // Clear error for this field
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
        email: '',
        program: '',
        gpa: '',
        testScore: ''
      });

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(false), 3000);
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

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FlexiSAF Admissions System</h1>
          <p className="mt-2 text-text-secondary">Submit your application</p>
        </div>

        {success && (
          <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded">
            Application submitted successfully! We'll review your application soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          {errors.submit && (
            <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input-field ${errors.firstName ? 'border-danger' : ''}`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-danger">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input-field ${errors.lastName ? 'border-danger' : ''}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-danger">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-danger' : ''}`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="program" className="block text-sm font-medium text-text mb-1">
              Program *
            </label>
            <input
              type="text"
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={`input-field ${errors.program ? 'border-danger' : ''}`}
              placeholder="e.g., Computer Science, Engineering, Mathematics"
            />
            {errors.program && (
              <p className="mt-1 text-sm text-danger">{errors.program}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="gpa" className="block text-sm font-medium text-text mb-1">
                GPA (0.0 - 4.0) *
              </label>
              <input
                type="number"
                step="0.01"
                id="gpa"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className={`input-field ${errors.gpa ? 'border-danger' : ''}`}
                placeholder="3.75"
                min="0"
                max="4"
              />
              {errors.gpa && (
                <p className="mt-1 text-sm text-danger">{errors.gpa}</p>
              )}
            </div>

            <div>
              <label htmlFor="testScore" className="block text-sm font-medium text-text mb-1">
                Test Score (0 - 100) *
              </label>
              <input
                type="number"
                id="testScore"
                name="testScore"
                value={formData.testScore}
                onChange={handleChange}
                className={`input-field ${errors.testScore ? 'border-danger' : ''}`}
                placeholder="85"
                min="0"
                max="100"
              />
              {errors.testScore && (
                <p className="mt-1 text-sm text-danger">{errors.testScore}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>

            <a href="/login" className="text-primary hover:text-primary-800 font-medium text-sm">
              Reviewer Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantForm;
