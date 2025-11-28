import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import applicantService from '../services/applicantService';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Ban,
  Users,
  UserCheck,
  UserX,
  Award,
  BookOpen
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, title: '', message: '', type: 'warning' });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [currentPage, activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (activeTab === 'admitted') {
        // Fetch admitted applicants from applicant service
        const response = await applicantService.getApplicants({
          page: currentPage,
          size: 20,
          status: 'ACCEPTED',
          sort: 'createdAt',
          direction: 'desc'
        });
        setStudents(response.content);
        setTotalPages(response.totalPages);
      } else {
        // Fetch real students based on status
        const response = activeTab === 'all'
          ? await studentService.getAllStudents({ page: currentPage, size: 20 })
          : await studentService.getStudentsByStatus(activeTab.toUpperCase());

        setStudents(Array.isArray(response) ? response : response.content || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback to empty array
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const studentId = student.studentId || student.id || '';
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                           studentId.toString().includes(searchTerm.toLowerCase());
      const matchesProgram = !programFilter ||
                            (student.program || '').toLowerCase().includes(programFilter.toLowerCase());
      return matchesSearch && matchesProgram;
    });
  };

  const filteredStudents = getFilteredStudents();

  // Get counts for each tab
  const allCount = students.length;
  const activeCount = students.filter(s => s.status === 'ACTIVE').length;
  const suspendedCount = students.filter(s => s.status === 'SUSPENDED').length;
  const admittedCount = activeTab === 'admitted' ? students.length : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'SUSPENDED': return 'bg-red-100 text-red-800 border-red-200';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'SUSPENDED': return <Ban className="w-4 h-4" />;
      case 'ACCEPTED': return <UserCheck className="w-4 h-4" />;
      default: return null;
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleSuspend = () => {
    if (!selectedStudent) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Suspend Student',
      message: 'Are you sure you want to suspend this student? They will lose access to courses and services.',
      type: 'danger',
      action: async () => {
        setUpdatingStatus(true);
        try {
          await studentService.suspendStudent(selectedStudent.id);
          await fetchStudents();
          setShowModal(false);
          setSelectedStudent(null);
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

  const handleReactivate = () => {
    if (!selectedStudent) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Reactivate Student',
      message: 'Are you sure you want to reactivate this student? They will regain access to courses and services.',
      type: 'success',
      action: async () => {
        setUpdatingStatus(true);
        try {
          await studentService.reactivateStudent(selectedStudent.id);
          await fetchStudents();
          setShowModal(false);
          setSelectedStudent(null);
          showAlert('Student has been reactivated', 'success');
        } catch (error) {
          console.error('Error reactivating student:', error);
          showAlert('Failed to reactivate student', 'error');
        } finally {
          setUpdatingStatus(false);
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
            <p className="mt-4 text-gray-600 font-medium">Loading students...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage enrolled students and admitted applicants
                </p>
              </div>
              <button
                onClick={fetchStudents}
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
                <span>All Students</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'all'
                    ? 'bg-white text-primary'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {allCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'active'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Active</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'active'
                    ? 'bg-white text-green-600'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('suspended')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'suspended'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>Suspended</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'suspended'
                    ? 'bg-white text-red-600'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {suspendedCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('admitted')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === 'admitted'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Admitted</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'admitted'
                    ? 'bg-white text-blue-600'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or student ID..."
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

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Student Avatar */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-16 h-16 rounded-lg ${
                      activeTab === 'active' ? 'bg-green-600' :
                      activeTab === 'suspended' ? 'bg-red-600' :
                      activeTab === 'admitted' ? 'bg-blue-600' :
                      'bg-primary'
                    } text-white flex items-center justify-center font-bold text-xl`}>
                      {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {student.studentId || `ID: ${student.id}`}
                      </p>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span className="font-medium">{student.program || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-700 mb-1 font-semibold">GPA</div>
                      <p className="font-bold text-gray-900 text-xl">
                        {student.gpa || student.currentGPA || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-xs text-purple-700 mb-1 font-semibold">Credits</div>
                      <p className="font-bold text-gray-900 text-xl">
                        {student.creditsEarned || student.credits || '0'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span>{(student.status || 'ACTIVE').replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(student)}
                    className={`w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors ${
                      activeTab === 'active' ? 'bg-green-600 hover:bg-green-700' :
                      activeTab === 'suspended' ? 'bg-red-600 hover:bg-red-700' :
                      activeTab === 'admitted' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-primary hover:bg-primary-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No students found</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'active' && 'No active students'}
                {activeTab === 'suspended' && 'No suspended students'}
                {activeTab === 'admitted' && 'No admitted applicants'}
                {activeTab === 'all' && 'Try adjusting your filters'}
              </p>
            </div>
          )}

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

      {/* Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-5 flex items-center justify-between border-b-4 ${
              activeTab === 'active' ? 'bg-green-600 border-green-700' :
              activeTab === 'suspended' ? 'bg-red-600 border-red-700' :
              activeTab === 'admitted' ? 'bg-blue-600 border-blue-700' :
              'bg-primary border-primary-700'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-lg bg-white text-primary flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedStudent.firstName?.charAt(0)}{selectedStudent.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <p className="text-white/90 text-sm flex items-center mt-0.5">
                    <Mail className="w-3 h-3 mr-1" />
                    {selectedStudent.email}
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
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(selectedStudent.status)}`}>
                  {getStatusIcon(selectedStudent.status)}
                  <span>{(selectedStudent.status || 'ACTIVE').replace('_', ' ')}</span>
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
                      <p className="font-semibold text-gray-900">{selectedStudent.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 font-semibold">Student ID</div>
                      <p className="font-semibold text-gray-900">{selectedStudent.studentId || selectedStudent.id}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <div className="w-1 h-4 bg-primary mr-2"></div>
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center text-xs text-blue-700 mb-1 font-semibold">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Program
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{selectedStudent.program || 'N/A'}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center text-xs text-green-700 mb-1 font-semibold">
                        <Award className="w-3 h-3 mr-1" />
                        GPA
                      </div>
                      <p className="font-bold text-gray-900 text-2xl">{selectedStudent.gpa || selectedStudent.currentGPA || 'N/A'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center text-xs text-purple-700 mb-1 font-semibold">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Credits
                      </div>
                      <p className="font-bold text-gray-900 text-2xl">{selectedStudent.creditsEarned || selectedStudent.credits || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
                    Actions
                  </h3>
                </div>

                {selectedStudent.status === 'ACTIVE' && (
                  <button
                    onClick={handleSuspend}
                    disabled={updatingStatus}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <Ban className="w-6 h-6" />
                    <span>Suspend Student</span>
                  </button>
                )}

                {selectedStudent.status === 'SUSPENDED' && (
                  <button
                    onClick={handleReactivate}
                    disabled={updatingStatus}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Reactivate Student</span>
                  </button>
                )}

                {selectedStudent.status === 'ACCEPTED' && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <UserCheck className="w-6 h-6 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-lg font-bold text-blue-900 mb-2">Admitted Applicant</h4>
                        <p className="text-sm text-blue-800">
                          This applicant has been admitted and will become an active student upon enrollment.
                        </p>
                      </div>
                    </div>
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

export default Students;
