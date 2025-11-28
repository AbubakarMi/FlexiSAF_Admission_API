import React, { useState, useEffect } from 'react';
import applicantService from '../services/applicantService';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  CheckCheck,
  AlertCircle,
  Download,
  Ban,
  Users,
  FileCheck,
  UserCheck
} from 'lucide-react';

const AllApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, title: '', message: '', type: 'warning' });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'review', 'admitted'

  useEffect(() => {
    fetchApplicants();
  }, [currentPage]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await applicantService.getApplicants({
        page: currentPage,
        size: 20,
        sort: 'createdAt',
        direction: 'desc'
      });
      setApplicants(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredByTab = () => {
    let filtered = applicants;

    // Filter by tab
    if (activeTab === 'review') {
      filtered = filtered.filter(app => app.status === 'IN_REVIEW');
    } else if (activeTab === 'admitted') {
      filtered = filtered.filter(app => app.status === 'ACCEPTED');
    }

    // Apply search and filters
    filtered = filtered.filter(applicant => {
      const matchesSearch = (applicant.firstName + ' ' + applicant.lastName).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || applicant.status === statusFilter;
      const matchesProgram = !programFilter || applicant.program?.toLowerCase().includes(programFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesProgram;
    });

    return filtered;
  };

  const filteredApplicants = getFilteredByTab();

  // Get counts for each tab
  const allCount = applicants.length;
  const reviewCount = applicants.filter(app => app.status === 'IN_REVIEW').length;
  const admittedCount = applicants.filter(app => app.status === 'ACCEPTED').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'IN_REVIEW': return <Eye className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTabColor = () => {
    switch (activeTab) {
      case 'review': return 'blue';
      case 'admitted': return 'green';
      default: return 'primary';
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedApplicant) return;

    const dialogConfig = {
      'IN_REVIEW': {
        title: 'Move to Review',
        message: 'Are you sure you want to move this applicant to the Review stage?',
        type: 'warning'
      },
      'PENDING': {
        title: 'Update Status',
        message: 'Are you sure you want to update this applicant status to Pending?',
        type: 'warning'
      },
      'REJECTED': {
        title: 'Reject Application',
        message: 'Are you sure you want to reject this application? This action will mark the applicant as rejected.',
        type: 'danger'
      }
    };

    const config = dialogConfig[newStatus];
    setConfirmDialog({
      isOpen: true,
      title: config.title,
      message: config.message,
      type: config.type,
      action: async () => {
        setUpdatingStatus(true);
        try {
          await applicantService.updateApplicant(selectedApplicant.id, {
            status: newStatus,
            version: selectedApplicant.version
          });
          await fetchApplicants();
          setShowModal(false);
          setSelectedApplicant(null);

          const statusMessages = {
            'IN_REVIEW': 'Applicant moved to Review',
            'PENDING': 'Applicant status updated to Pending',
            'REJECTED': 'Applicant has been rejected'
          };
          showAlert(statusMessages[newStatus] || 'Status updated successfully', 'success');
        } catch (error) {
          console.error('Error updating status:', error);
          showAlert('Failed to update status', 'error');
        } finally {
          setUpdatingStatus(false);
        }
      }
    });
  };

  const handleAccept = () => {
    if (!selectedApplicant) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Accept & Admit Application',
      message: 'Are you sure you want to accept this application? The applicant will be admitted.',
      type: 'success',
      action: async () => {
        setUpdatingStatus(true);
        try {
          await applicantService.updateApplicant(selectedApplicant.id, {
            status: 'ACCEPTED',
            version: selectedApplicant.version
          });
          await fetchApplicants();
          setShowModal(false);
          setSelectedApplicant(null);
          showAlert('Applicant has been accepted and admitted', 'success');
        } catch (error) {
          console.error('Error accepting applicant:', error);
          showAlert('Failed to accept applicant', 'error');
        } finally {
          setUpdatingStatus(false);
        }
      }
    });
  };

  const handleSuspend = () => {
    if (!selectedApplicant) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Suspend Student',
      message: 'Are you sure you want to suspend this student? They will be moved to suspended status.',
      type: 'danger',
      action: async () => {
        setUpdatingStatus(true);
        try {
          await applicantService.updateApplicant(selectedApplicant.id, {
            status: 'SUSPENDED',
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
      }
    });
  };

  const handleDelete = (applicantId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Application',
      message: 'Are you sure you want to delete this application? This action cannot be undone.',
      type: 'danger',
      action: async () => {
        try {
          await applicantService.deleteApplicant(applicantId);
          await fetchApplicants();
          setShowModal(false);
          setSelectedApplicant(null);
          showAlert('Applicant deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting applicant:', error);
          showAlert('Failed to delete applicant', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading applicants...</p>
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
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in ${
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
                <h1 className="text-3xl font-bold text-gray-900">All Applicants</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and review all student applications
                </p>
              </div>
              <button
                onClick={fetchApplicants}
                className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-2 mt-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>All Applicants</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'all'
                    ? 'bg-white text-primary'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {allCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('review')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'review'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>In Review</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'review'
                    ? 'bg-white text-blue-600'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {reviewCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('admitted')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'admitted'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Admitted</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'admitted'
                    ? 'bg-white text-green-600'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {admittedCount}
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {activeTab === 'all' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Applicants Table */}
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
                    {activeTab === 'all' && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    )}
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${
                            activeTab === 'review' ? 'bg-blue-600' :
                            activeTab === 'admitted' ? 'bg-green-600' :
                            'bg-primary'
                          } text-white flex items-center justify-center font-bold text-sm`}>
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
                      {activeTab === 'all' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(applicant.status)}`}>
                            {getStatusIcon(applicant.status)}
                            <span>{applicant.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewDetails(applicant)}
                          className={`inline-flex items-center space-x-1 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${
                            activeTab === 'review' ? 'bg-blue-600 hover:bg-blue-700' :
                            activeTab === 'admitted' ? 'bg-green-600 hover:bg-green-700' :
                            'bg-primary hover:bg-primary-700'
                          }`}
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

            {/* No Results */}
            {filteredApplicants.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No applicants found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {activeTab === 'review' && 'No applicants in review stage'}
                  {activeTab === 'admitted' && 'No admitted applicants'}
                  {activeTab === 'all' && 'Try adjusting your filters'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Details Modal - Clean Design */}
      {showModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-5 flex items-center justify-between border-b-4 ${
              activeTab === 'review' ? 'bg-blue-600 border-blue-700' :
              activeTab === 'admitted' ? 'bg-green-600 border-green-700' :
              'bg-primary border-primary-700'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-lg bg-white text-primary flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedApplicant.firstName?.charAt(0)}{selectedApplicant.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </h2>
                  <p className="text-white/90 text-sm flex items-center mt-0.5">
                    <Mail className="w-3 h-3 mr-1" />
                    {selectedApplicant.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(selectedApplicant.status)}`}>
                  {getStatusIcon(selectedApplicant.status)}
                  <span>{selectedApplicant.status.replace('_', ' ')}</span>
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Personal Info */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <div className="w-1 h-4 bg-primary mr-2"></div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Phone className="w-3 h-3 mr-1" />
                        <span className="font-semibold">Phone</span>
                      </div>
                      <p className="font-semibold text-gray-900">{selectedApplicant.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span className="font-semibold">Date of Birth</span>
                      </div>
                      <p className="font-semibold text-gray-900">{selectedApplicant.dateOfBirth || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <div className="w-1 h-4 bg-primary mr-2"></div>
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center text-xs text-blue-700 mb-1 font-semibold">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Program
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{selectedApplicant.program}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center text-xs text-green-700 mb-1 font-semibold">
                        <Award className="w-3 h-3 mr-1" />
                        GPA
                      </div>
                      <p className="font-bold text-gray-900 text-2xl">{selectedApplicant.gpa}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-xs text-purple-700 mb-1 font-semibold">Test Score</div>
                      <p className="font-bold text-gray-900 text-2xl">{selectedApplicant.testScore}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="text-xs text-orange-700 mb-1 font-semibold">AI Score</div>
                      <p className="font-bold text-gray-900 text-2xl">{selectedApplicant.aiScore || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Statement */}
                {selectedApplicant.personalStatement && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                      <div className="w-1 h-4 bg-primary mr-2"></div>
                      Personal Statement
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 border-l-4 border-l-primary">
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedApplicant.personalStatement}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions - Based on Status */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                    Actions
                  </h3>
                </div>

                {/* IN_REVIEW Status - Show Accept & Reject */}
                {selectedApplicant.status === 'IN_REVIEW' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleAccept}
                      disabled={updatingStatus}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>Accept & Admit</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={updatingStatus}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <XCircle className="w-6 h-6" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {/* ACCEPTED Status - Show Suspend Button */}
                {selectedApplicant.status === 'ACCEPTED' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="text-lg font-bold text-green-900 mb-2">Student Admitted</h4>
                          <p className="text-sm text-green-800">
                            This applicant has been admitted and is now a student.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSuspend}
                      disabled={updatingStatus}
                      className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <Ban className="w-6 h-6" />
                      <span>Suspend Student</span>
                    </button>
                  </div>
                )}

                {/* Other Statuses - Show Move to Review & Reject */}
                {selectedApplicant.status !== 'IN_REVIEW' && selectedApplicant.status !== 'ACCEPTED' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleUpdateStatus('IN_REVIEW')}
                      disabled={updatingStatus}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <FileCheck className="w-6 h-6" />
                      <span>Move to Review</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={updatingStatus}
                      className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <XCircle className="w-6 h-6" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default AllApplicants;
