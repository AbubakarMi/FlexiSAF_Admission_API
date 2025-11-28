import React, { useState, useEffect } from 'react';
import applicantService from '../services/applicantService';
import courseService from '../services/courseService';
import Sidebar from '../components/Sidebar';
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  FileDown,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Calendar,
  PieChart,
  Activity,
  Target
} from 'lucide-react';

const AnalyticsReports = () => {
  const [loading, setLoading] = useState(true);
  const [applicantStats, setApplicantStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [programDistribution, setProgramDistribution] = useState([]);
  const [alert, setAlert] = useState(null);
  const [exportFormat, setExportFormat] = useState('CSV');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch applicant data
      const applicantResponse = await applicantService.getApplicants({ size: 1000 });
      const applicants = applicantResponse.content || [];

      // Calculate applicant statistics
      const totalApplicants = applicants.length;
      const acceptedApplicants = applicants.filter(a => a.status === 'ACCEPTED');
      const acceptanceRate = totalApplicants > 0 ? (acceptedApplicants.length / totalApplicants * 100).toFixed(1) : 0;

      setApplicantStats({
        total: totalApplicants,
        pending: applicants.filter(a => a.status === 'PENDING').length,
        inReview: applicants.filter(a => a.status === 'IN_REVIEW').length,
        accepted: acceptedApplicants.length,
        rejected: applicants.filter(a => a.status === 'REJECTED').length,
        acceptanceRate: acceptanceRate,
        avgGpa: totalApplicants > 0 ? (applicants.reduce((sum, a) => sum + parseFloat(a.gpa || 0), 0) / totalApplicants).toFixed(2) : 0,
        avgTestScore: totalApplicants > 0 ? Math.round(applicants.reduce((sum, a) => sum + parseInt(a.testScore || 0), 0) / totalApplicants) : 0,
        avgAiScore: totalApplicants > 0 ? (applicants.reduce((sum, a) => sum + parseFloat(a.aiScore || 0), 0) / totalApplicants).toFixed(1) : 0
      });

      // Calculate program distribution
      const programCounts = {};
      applicants.forEach(applicant => {
        const program = applicant.program || 'Unknown';
        programCounts[program] = (programCounts[program] || 0) + 1;
      });
      const programDist = Object.entries(programCounts).map(([program, count]) => ({
        program,
        count,
        percentage: ((count / totalApplicants) * 100).toFixed(1)
      })).sort((a, b) => b.count - a.count);
      setProgramDistribution(programDist);

      // Fetch course data
      const courses = await courseService.getAllCourses();
      const coursesArray = Array.isArray(courses) ? courses : [];

      const totalEnrolled = coursesArray.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);
      const totalCapacity = coursesArray.reduce((sum, c) => sum + (c.capacity || 0), 0);
      const utilizationRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;

      setCourseStats({
        totalCourses: coursesArray.length,
        totalEnrolled: totalEnrolled,
        totalCapacity: totalCapacity,
        utilizationRate: utilizationRate,
        avgEnrollment: coursesArray.length > 0 ? Math.round(totalEnrolled / coursesArray.length) : 0
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      showAlert('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleExport = async () => {
    try {
      const response = await applicantService.getApplicants({ size: 1000 });
      const applicants = response.content || [];

      if (applicants.length === 0) {
        showAlert('No data to export', 'error');
        return;
      }

      if (exportFormat === 'CSV') {
        exportToCSV(applicants);
      } else if (exportFormat === 'JSON') {
        exportToJSON(applicants);
      }

      showAlert(`Successfully exported ${applicants.length} records as ${exportFormat}`, 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert('Failed to export data', 'error');
    }
  };

  const exportToCSV = (data) => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Program', 'GPA', 'Test Score', 'AI Score', 'Status', 'Created At'];
    const rows = data.map(applicant => [
      applicant.id,
      applicant.firstName,
      applicant.lastName,
      applicant.email,
      applicant.program,
      applicant.gpa,
      applicant.testScore,
      applicant.aiScore || 'N/A',
      applicant.status,
      new Date(applicant.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'analytics_export.csv', 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'analytics_export.json', 'application/json');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-sm text-gray-500 mt-1">
                  View comprehensive analytics and export reports
                </p>
              </div>
              <button
                onClick={fetchAllData}
                className="px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Analytics Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-7 h-7 mr-3 text-primary" />
              Analytics Dashboard
            </h2>

            {/* Applicant Statistics */}
            {applicantStats && (
              <>
                <h3 className="text-lg font-bold text-gray-700 mb-4 ml-1">Application Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Applications</h3>
                    <p className="text-3xl font-bold text-gray-900">{applicantStats.total}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Accepted</h3>
                    <p className="text-3xl font-bold text-gray-900">{applicantStats.accepted}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      {applicantStats.acceptanceRate}% acceptance rate
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Activity className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">In Review</h3>
                    <p className="text-3xl font-bold text-gray-900">{applicantStats.inReview}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Pending</h3>
                    <p className="text-3xl font-bold text-gray-900">{applicantStats.pending}</p>
                  </div>
                </div>

                {/* Academic Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-blue-600 rounded-lg">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Average GPA</h3>
                        <p className="text-3xl font-bold text-gray-900">{applicantStats.avgGpa}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-green-600 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg Test Score</h3>
                        <p className="text-3xl font-bold text-gray-900">{applicantStats.avgTestScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-purple-600 rounded-lg">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg AI Score</h3>
                        <p className="text-3xl font-bold text-gray-900">{applicantStats.avgAiScore}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Course Statistics */}
            {courseStats && (
              <>
                <h3 className="text-lg font-bold text-gray-700 mb-4 ml-1">Course Enrollment Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Courses</h3>
                    <p className="text-3xl font-bold text-gray-900">{courseStats.totalCourses}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Enrolled</h3>
                    <p className="text-3xl font-bold text-gray-900">{courseStats.totalEnrolled}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <Activity className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Avg Enrollment</h3>
                    <p className="text-3xl font-bold text-gray-900">{courseStats.avgEnrollment}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Utilization Rate</h3>
                    <p className="text-3xl font-bold text-gray-900">{courseStats.utilizationRate}%</p>
                  </div>
                </div>
              </>
            )}

            {/* Program Distribution */}
            {programDistribution.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-gray-700 mb-4 ml-1">Program Distribution</h3>
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <div className="space-y-4">
                    {programDistribution.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-48 text-sm font-semibold text-gray-700">{item.program}</div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                            <div
                              className="bg-primary h-full flex items-center justify-end pr-3 text-white text-xs font-bold transition-all"
                              style={{ width: `${item.percentage}%` }}
                            >
                              {item.percentage}%
                            </div>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm font-bold text-gray-900">
                          {item.count} students
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileDown className="w-7 h-7 mr-3 text-primary" />
              Export Reports
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {['CSV', 'JSON'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center space-x-3 ${
                      exportFormat === format
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileSpreadsheet className={`w-6 h-6 ${exportFormat === format ? 'text-primary' : 'text-gray-400'}`} />
                    <span className={`text-base font-bold ${exportFormat === format ? 'text-primary' : 'text-gray-600'}`}>
                      {format}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <Download className="w-6 h-6" />
              <span>Export as {exportFormat}</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">Analytics Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Analytics data is updated in real-time from the database</li>
                  <li>• Acceptance rate is calculated based on accepted vs total applications</li>
                  <li>• Utilization rate shows how full courses are compared to capacity</li>
                  <li>• Export includes all applicant details and status information</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsReports;
