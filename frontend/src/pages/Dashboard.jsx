import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicantService from '../services/applicantService';
import ApplicantTable from '../components/ApplicantTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
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

  useEffect(() => {
    fetchApplicants();
  }, [currentPage, searchFilters]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await applicantService.getApplicants({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt',
        direction: 'desc',
        ...searchFilters
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

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">FlexiSAF Admissions Dashboard</h1>
              <p className="text-primary-100 text-sm mt-1">
                Welcome, {user?.username || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text">Total Applicants</h2>
                <p className="text-3xl font-bold text-primary mt-1">{totalElements}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">
                  Page {currentPage + 1} of {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading applicants...</p>
          </div>
        ) : (
          <>
            {/* Applicants Table */}
            <ApplicantTable applicants={applicants} />

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
    </div>
  );
};

export default Dashboard;
