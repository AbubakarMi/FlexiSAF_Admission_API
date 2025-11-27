import React, { useState, useEffect } from 'react';
import applicantService from '../services/applicantService';
import Sidebar from '../components/Sidebar';
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  RotateCcw,
  Ban,
  GraduationCap
} from 'lucide-react';

const AdmittedStudents = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await applicantService.getApplicants({
        page: 0,
        size: 1000,
        sort: 'createdAt',
        direction: 'desc'
      });
      const acceptedApplicants = response.content.filter(a => a.status === 'ACCEPTED');
      setApplicants(acceptedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = (applicant.firstName + ' ' + applicant.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = !programFilter || applicant.program?.toLowerCase().includes(programFilter.toLowerCase());
    return matchesSearch && matchesProgram;
  });

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const handleMoveToReview = async () => {
    if (!selectedApplicant) return;

    setUpdatingStatus(true);
    try {
      await applicantService.updateApplicant(selectedApplicant.id, {
        status: 'IN_REVIEW',
        version: selectedApplicant.version
      });
      await fetchApplicants();
      setShowModal(false);
      setSelectedApplicant(null);
      showAlert('Student moved back to Review', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Failed to move student to review', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplicant) return;

    setUpdatingStatus(true);
    try {
      await applicantService.updateApplicant(selectedApplicant.id, {
        status: 'REJECTED',
        version: selectedApplicant.version
      });
      await fetchApplicants();
      setShowModal(false);
      setSelectedApplicant(null);
      showAlert('Student has been rejected', 'success');
    } catch (error) {
      console.error('Error rejecting student:', error);
      showAlert('Failed to reject student', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedApplicant) return;

    setUpdatingStatus(true);
    try {
      await applicantService.updateApplicant(selectedApplicant.id, {
        status: 'PENDING',
        version: selectedApplicant.version
      });
      await fetchApplicants();
      setShowModal(false);
      setSelectedApplicant(null);
      showAlert('Student has been suspended', 'success');
    } catch (error) {
      console.error('Error suspending student:', error);
      showAlert('Failed to suspend student', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (applicantId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await applicantService.deleteApplicant(applicantId);
      await fetchApplicants();
      setShowModal(false);
      setSelectedApplicant(null);
      showAlert('Student deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting student:', error);
      showAlert('Failed to delete student', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading admitted students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert Messages */}
        {alert && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admitted Students</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Students who have been accepted into programs - {filteredApplicants.length} total
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={fetchApplicants}
                  className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">

          {/* Search & Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by program..."
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Students Table */}
          {filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admitted Students</h3>
              <p className="text-gray-500">There are currently no students with ACCEPTED status</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GPA</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Test Score</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplicants.map((applicant) => (
                      <tr key={applicant.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                              {applicant.firstName?.charAt(0)}{applicant.lastName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{applicant.firstName} {applicant.lastName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-600">{applicant.email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900 font-medium">{applicant.program}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{applicant.gpa}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{applicant.testScore}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleViewDetails(applicant)}
                            className="inline-flex items-center space-x-1 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Details Modal */}
      {showModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-white text-green-600 flex items-center justify-center font-bold text-2xl shadow-lg">
                  {selectedApplicant.firstName?.charAt(0)}{selectedApplicant.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </h2>
                  <p className="text-white/80 text-sm">{selectedApplicant.email}</p>
                  <span className="inline-flex items-center space-x-1 mt-1 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>ACCEPTED</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Personal Info */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900 text-lg">
                      {selectedApplicant.firstName} {selectedApplicant.lastName}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{selectedApplicant.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedApplicant.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{selectedApplicant.dateOfBirth || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Program</p>
                    <p className="font-semibold text-gray-900">{selectedApplicant.program}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">GPA</p>
                    <p className="font-semibold text-gray-900 text-xl">{selectedApplicant.gpa}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Test Score</p>
                    <p className="font-semibold text-gray-900 text-xl">{selectedApplicant.testScore}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI Score</p>
                    <p className="font-semibold text-gray-900 text-xl">{selectedApplicant.aiScore || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Statement */}
              {selectedApplicant.personalStatement && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">Personal Statement</h3>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-600">
                    <p className="text-gray-700 leading-relaxed">{selectedApplicant.personalStatement}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                    Student Actions
                  </h3>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleSuspend}
                    disabled={updatingStatus}
                    className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <Ban className="w-6 h-6" />
                    <span>Suspend Student</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t px-8 py-4 flex justify-end rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmittedStudents;
