import React, { useState, useEffect } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Book, Award, CheckCircle } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: 'Nigerian',
    stateOfOrigin: '',
    program: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: ''
  });

  // Load saved profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(formData));
    setIsEditing(false);
    showAlert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
        nationality: 'Nigerian',
        stateOfOrigin: '',
        program: '',
        emergencyContact: '',
        emergencyPhone: '',
        emergencyRelationship: ''
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EnrolledStudentSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert */}
        {alert && (
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg bg-green-600 text-white animate-slide-in">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{alert}</span>
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
                <h1 className="text-2xl font-black text-text">My Profile</h1>
                <p className="text-sm text-text-secondary font-medium">Manage your personal information and settings</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-primary p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl font-black text-white">
                  {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-text mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-text-secondary text-sm font-semibold">Student ID: STU-{user?.id || '00000'}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg text-xs font-bold text-success">
                    Enrolled Student
                  </span>
                  {formData.program && (
                    <span className="px-3 py-1 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg text-xs font-bold text-primary">
                      {formData.program}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Program</p>
                <Book className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-black text-text">{formData.program || 'Not Set'}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Student ID</p>
                <User className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-black text-text">STU-{user?.id || '00000'}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 rounded-t-xl">
              <h2 className="text-lg font-bold text-text">Personal Information</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <User className="w-3 h-3" />
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <User className="w-3 h-3" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </label>
                  <p className="px-3 py-2 bg-gray-100 rounded-lg text-text-secondary font-semibold text-sm">
                    {formData.email}
                    <span className="text-xs ml-2">(cannot be changed)</span>
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <Phone className="w-3 h-3" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <Calendar className="w-3 h-3" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {new Date(formData.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <MapPin className="w-3 h-3" />
                    Nationality
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.nationality}
                    </p>
                  )}
                </div>

                {/* State of Origin */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <MapPin className="w-3 h-3" />
                    State of Origin
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="stateOfOrigin"
                      value={formData.stateOfOrigin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.stateOfOrigin}
                    </p>
                  )}
                </div>

                {/* Program */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <Book className="w-3 h-3" />
                    Program of Study
                  </label>
                  <p className="px-3 py-2 bg-gray-100 rounded-lg text-text-secondary font-semibold text-sm">
                    {formData.program}
                    <span className="text-xs ml-2">(cannot be changed)</span>
                  </p>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <MapPin className="w-3 h-3" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="bg-red-50 px-5 py-4 border-b border-red-200 rounded-t-xl">
              <h2 className="text-lg font-bold text-text">Emergency Contact</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Emergency Contact Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <User className="w-3 h-3" />
                    Contact Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.emergencyContact}
                    </p>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <Phone className="w-3 h-3" />
                    Contact Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.emergencyPhone}
                    </p>
                  )}
                </div>

                {/* Emergency Contact Relationship */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-2">
                    <User className="w-3 h-3" />
                    Relationship
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-text font-semibold text-sm">
                      {formData.emergencyRelationship}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
