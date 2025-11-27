import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicantService from '../services/applicantService';
import ApplicantTable from '../components/ApplicantTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import StatsCard from '../components/StatsCard';
import AdvancedFilters from '../components/AdvancedFilters';
import Modal from '../components/Modal';
import PDFExport from '../components/PDFExport';

const EnhancedDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [searchFilters, setSearchFilters] = useState({
    email: '',
    program: '',
    status: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    gpaMin: '',
    gpaMax: '',
    testScoreMin: '',
    testScoreMax: '',
    aiScoreMin: '',
    aiScoreMax: '',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    accepted: 0,
    rejected: 0,
    avgGpa: 0,
    avgTestScore: 0,
    avgAiScore: 0
  });

  useEffect(() => {
    fetchApplicants();
    fetchStats();
  }, [currentPage, searchFilters, advancedFilters]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await applicantService.getApplicants({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt',
        direction: 'desc',
        ...searchFilters,
        ...advancedFilters
      });

      setApplicants(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError('Failed to load applicants. Please try again.');
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch all applicants to calculate stats
      const data = await applicantService.getApplicants({
        page: 0,
        size: 1000,
        sort: 'createdAt',
        direction: 'desc'
      });

      const all = data.content;
      setAllApplicants(all);

      const pending = all.filter(a => a.status === 'PENDING').length;
      const inReview = all.filter(a => a.status === 'IN_REVIEW').length;
      const accepted = all.filter(a => a.status === 'ACCEPTED').length;
      const rejected = all.filter(a => a.status === 'REJECTED').length;

      const avgGpa = all.length > 0 ? all.reduce((sum, a) => sum + parseFloat(a.gpa), 0) / all.length : 0;
      const avgTestScore = all.length > 0 ? all.reduce((sum, a) => sum + a.testScore, 0) / all.length : 0;
      const avgAiScore = all.length > 0 ? all.reduce((sum, a) => sum + (a.aiScore || 0), 0) / all.length : 0;

      setStats({
        total: all.length,
        pending,
        inReview,
        accepted,
        rejected,
        avgGpa: avgGpa.toFixed(2),
        avgTestScore: avgTestScore.toFixed(0),
        avgAiScore: avgAiScore.toFixed(2)
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(0);
  };

  const handleAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setCurrentPage(0);
    setShowAdvancedFilters(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectApplicant = (id) => {
    setSelectedApplicants(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map(a => a.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedApplicants.length === 0) return;

    setProcessingBulk(true);
    try {
      await Promise.all(
        selectedApplicants.map(id => {
          const applicant = applicants.find(a => a.id === id);
          return applicantService.updateApplicant(id, {
            status: bulkAction,
            version: applicant.version
          });
        })
      );

      setShowBulkActions(false);
      setSelectedApplicants([]);
      setBulkAction('');
      fetchApplicants();
      fetchStats();
    } catch (err) {
      alert('Failed to process bulk action: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleExportPDF = async () => {
    const selectedData = applicants.filter(a => selectedApplicants.includes(a.id));
    PDFExport.generateApplicantsPDF(selectedData);
  };

  const handleExportCSV = async () => {
    const selectedData = applicants.filter(a => selectedApplicants.includes(a.id));
    PDFExport.downloadApplicantsCSV(selectedData);
  };

  const handleCompare = () => {
    if (selectedApplicants.length < 2) {
      alert('Please select at least 2 applicants to compare');
      return;
    }
    navigate(`/compare?ids=${selectedApplicants.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-background">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-black tracking-tight">FlexiSAF Admissions Dashboard</h1>
              <p className="text-primary-100 text-sm mt-2 font-medium">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all shadow-md hover:shadow-lg border border-white/20"
              >
                🔍 Advanced Filters
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-5 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon="📊"
            color="blue"
            trend="+12% this month"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon="⏳"
            color="yellow"
            subtitle={`${stats.inReview} in review`}
          />
          <StatsCard
            title="Accepted"
            value={stats.accepted}
            icon="✅"
            color="green"
            percentage={(stats.accepted / stats.total * 100).toFixed(1)}
          />
          <StatsCard
            title="Avg AI Score"
            value={stats.avgAiScore}
            icon="🤖"
            color="purple"
            subtitle="out of 100"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in animation-delay-100">
          <div className="card bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">Average GPA</p>
                <p className="text-3xl font-black text-blue-600">{stats.avgGpa}</p>
                <p className="text-xs text-text-secondary mt-1">out of 5.0</p>
              </div>
              <div className="text-5xl opacity-20">🎓</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">Avg Test Score</p>
                <p className="text-3xl font-black text-green-600">{stats.avgTestScore}</p>
                <p className="text-xs text-text-secondary mt-1">out of 100</p>
              </div>
              <div className="text-5xl opacity-20">📝</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-white to-red-50 border-2 border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">Rejected</p>
                <p className="text-3xl font-black text-red-600">{stats.rejected}</p>
                <p className="text-xs text-text-secondary mt-1">{((stats.rejected / stats.total * 100) || 0).toFixed(1)}% of total</p>
              </div>
              <div className="text-5xl opacity-20">❌</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedApplicants.length > 0 && (
          <div className="mb-6 card bg-primary-50 border-2 border-primary-200 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-primary">
                  {selectedApplicants.length} applicant(s) selected
                </p>
                <p className="text-sm text-text-secondary mt-1">Choose an action to apply</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="btn-primary"
                >
                  📋 Bulk Actions
                </button>
                <button
                  onClick={handleCompare}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  disabled={selectedApplicants.length < 2}
                >
                  🔄 Compare
                </button>
                <button
                  onClick={handleExportPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  📄 Export PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  📊 Export CSV
                </button>
                <button
                  onClick={() => setSelectedApplicants([])}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-danger-50 border-2 border-danger-200 text-danger-700 px-4 py-3 rounded-lg animate-shake">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="card text-center py-16 animate-pulse">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-6 text-text-secondary font-medium text-lg">Loading applicants...</p>
          </div>
        ) : (
          <>
            {/* Enhanced Applicants Table with Selection */}
            <div className="card overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-primary-50 to-primary-100">
                    <tr>
                      <th className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApplicants.length === applicants.length && applicants.length > 0}
                          onChange={handleSelectAll}
                          className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Program</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">GPA</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Test</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">AI Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applicants.map((applicant, index) => (
                      <tr
                        key={applicant.id}
                        className={`hover:bg-primary-50 transition-colors duration-150 ${
                          selectedApplicants.includes(applicant.id) ? 'bg-primary-50' : ''
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplicants.includes(applicant.id)}
                            onChange={() => handleSelectApplicant(applicant.id)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-text">
                            {applicant.firstName} {applicant.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {applicant.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-text">{applicant.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-blue-600">{applicant.gpa}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-green-600">{applicant.testScore}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            applicant.status === 'ACCEPTED' ? 'bg-success-100 text-success-800' :
                            applicant.status === 'REJECTED' ? 'bg-danger-100 text-danger-800' :
                            applicant.status === 'IN_REVIEW' ? 'bg-primary-100 text-primary-800' :
                            'bg-warning-100 text-warning-800'
                          }`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-purple-600">
                            {applicant.aiScore ? applicant.aiScore.toFixed(1) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => navigate(`/applicants/${applicant.id}`)}
                            className="text-primary hover:text-primary-700 font-semibold hover:underline"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {applicants.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-text-secondary text-lg">No applicants found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <AdvancedFilters
          filters={advancedFilters}
          onApply={handleAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
        />
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <Modal isOpen={showBulkActions} onClose={() => setShowBulkActions(false)} type="confirm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Bulk Action</h3>
          <p className="text-text-secondary mb-6">
            Change status for {selectedApplicants.length} selected applicant(s)
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text mb-2">
              Select New Status
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">-- Select Status --</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowBulkActions(false)}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || processingBulk}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingBulk ? 'Processing...' : 'Apply to All'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EnhancedDashboard;
