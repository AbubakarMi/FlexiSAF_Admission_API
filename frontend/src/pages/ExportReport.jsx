import React, { useState, useEffect } from 'react';
import applicantService from '../services/applicantService';
import Sidebar from '../components/Sidebar';
import {
  FileDown,
  FileText,
  FileSpreadsheet,
  FileType,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Eye,
  XCircle,
  Award,
  Brain,
  RefreshCw,
  File
} from 'lucide-react';

const ExportReport = () => {
  const [loading, setLoading] = useState(false);
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
  const [alert, setAlert] = useState(null);
  const [exportFormat, setExportFormat] = useState('CSV');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await applicantService.getApplicants({ size: 1000 });
      const applicants = response.content || [];

      const stats = {
        total: applicants.length,
        pending: applicants.filter(a => a.status === 'PENDING').length,
        inReview: applicants.filter(a => a.status === 'IN_REVIEW').length,
        accepted: applicants.filter(a => a.status === 'ACCEPTED').length,
        rejected: applicants.filter(a => a.status === 'REJECTED').length,
        avgGpa: applicants.length > 0 ? applicants.reduce((sum, a) => sum + parseFloat(a.gpa || 0), 0) / applicants.length : 0,
        avgTestScore: applicants.length > 0 ? applicants.reduce((sum, a) => sum + parseInt(a.testScore || 0), 0) / applicants.length : 0,
        avgAiScore: applicants.length > 0 ? applicants.reduce((sum, a) => sum + parseFloat(a.aiScore || 0), 0) / applicants.length : 0
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = {
        size: 1000,
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      };

      const response = await applicantService.getApplicants(params);
      const applicants = response.content || [];

      // Filter by date range if provided
      let filteredApplicants = applicants;
      if (dateRange.startDate || dateRange.endDate) {
        filteredApplicants = applicants.filter(applicant => {
          const createdDate = new Date(applicant.createdAt);
          const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
          const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

          if (start && end) {
            return createdDate >= start && createdDate <= end;
          } else if (start) {
            return createdDate >= start;
          } else if (end) {
            return createdDate <= end;
          }
          return true;
        });
      }

      if (filteredApplicants.length === 0) {
        showAlert('No data to export with the selected filters', 'error');
        return;
      }

      if (exportFormat === 'CSV') {
        exportToCSV(filteredApplicants);
      } else if (exportFormat === 'JSON') {
        exportToJSON(filteredApplicants);
      } else if (exportFormat === 'TXT') {
        exportToTXT(filteredApplicants);
      } else if (exportFormat === 'PDF') {
        exportToPDF(filteredApplicants);
      }

      showAlert(`Successfully exported ${filteredApplicants.length} records as ${exportFormat}`, 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showAlert('Failed to export data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data) => {
    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Program',
      'GPA',
      'Test Score',
      'AI Score',
      'Status',
      'Created At'
    ];

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

    downloadFile(csvContent, 'applicants_export.csv', 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'applicants_export.json', 'application/json');
  };

  const exportToTXT = (data) => {
    const txtContent = data.map(applicant =>
      `ID: ${applicant.id}
Name: ${applicant.firstName} ${applicant.lastName}
Email: ${applicant.email}
Program: ${applicant.program}
GPA: ${applicant.gpa}
Test Score: ${applicant.testScore}
AI Score: ${applicant.aiScore || 'N/A'}
Status: ${applicant.status}
Created: ${new Date(applicant.createdAt).toLocaleString()}
${'='.repeat(60)}`
    ).join('\n\n');

    downloadFile(txtContent, 'applicants_export.txt', 'text/plain');
  };

  const exportToPDF = (data) => {
    // Create PDF content as HTML for print
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FlexiSAF Admissions Report</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #1a1a1a;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          .header h1 {
            font-size: 28pt;
            color: #2563eb;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .header h2 {
            font-size: 16pt;
            color: #64748b;
            font-weight: normal;
          }
          .metadata {
            margin-bottom: 30px;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
          }
          .metadata-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
          }
          .metadata-item {
            text-align: center;
          }
          .metadata-label {
            font-size: 8pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .metadata-value {
            font-size: 18pt;
            font-weight: bold;
            color: #1e293b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
          }
          thead {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
          }
          th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 9pt;
          }
          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }
          tbody tr:hover {
            background-color: #f1f5f9;
          }
          .status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-PENDING {
            background: #fef3c7;
            color: #92400e;
          }
          .status-IN_REVIEW {
            background: #ddd6fe;
            color: #5b21b6;
          }
          .status-ACCEPTED {
            background: #d1fae5;
            color: #065f46;
          }
          .status-REJECTED {
            background: #fee2e2;
            color: #991b1b;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 8pt;
            color: #64748b;
          }
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FlexiSAF Admissions</h1>
          <h2>Application Report</h2>
        </div>

        <div class="metadata">
          <div class="metadata-grid">
            <div class="metadata-item">
              <div class="metadata-label">Total Applications</div>
              <div class="metadata-value">${data.length}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Accepted</div>
              <div class="metadata-value" style="color: #059669;">${data.filter(a => a.status === 'ACCEPTED').length}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Average GPA</div>
              <div class="metadata-value" style="color: #2563eb;">${(data.reduce((sum, a) => sum + parseFloat(a.gpa || 0), 0) / data.length).toFixed(2)}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Generated</div>
              <div class="metadata-value" style="font-size: 10pt;">${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 22%;">Name</th>
              <th style="width: 24%;">Email</th>
              <th style="width: 22%;">Program</th>
              <th style="width: 10%;">GPA</th>
              <th style="width: 10%;">Test</th>
              <th style="width: 12%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(applicant => `
              <tr>
                <td><strong>${applicant.firstName} ${applicant.lastName}</strong></td>
                <td>${applicant.email}</td>
                <td>${applicant.program}</td>
                <td><strong>${applicant.gpa}</strong></td>
                <td><strong>${applicant.testScore}</strong></td>
                <td><span class="status status-${applicant.status}">${applicant.status.replace('_', ' ')}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>FlexiSAF Admissions</strong> • Generated ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download as PDF-ready HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    // Open in new window for printing
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Clean up the URL after a delay
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }, 500);
      };
    }
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

  const getFormatIcon = (format) => {
    switch (format) {
      case 'CSV':
        return FileSpreadsheet;
      case 'JSON':
        return FileType;
      case 'TXT':
        return FileText;
      case 'PDF':
        return File;
      default:
        return FileDown;
    }
  };

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
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-primary">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Export & Reports</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Generate reports and export application data
                </p>
              </div>
              <button
                onClick={fetchStats}
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto">
          {/* Statistics Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-primary" />
              Application Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-600 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Applications</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md border-l-4 border-yellow-600 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md border-l-4 border-purple-600 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">In Review</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.inReview}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md border-l-4 border-green-600 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Accepted</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
            </div>

            {/* Academic Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-blue-600 rounded-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Average GPA</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgGpa.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-green-600 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg Test Score</h3>
                    <p className="text-3xl font-bold text-gray-900">{Math.round(stats.avgTestScore)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-purple-600 rounded-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avg AI Score</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgAiScore.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Configuration */}
          <div className="bg-white rounded-lg shadow-md border p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileDown className="w-6 h-6 mr-2 text-primary" />
              Export Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['CSV', 'JSON', 'TXT', 'PDF'].map((format) => {
                    const Icon = getFormatIcon(format);
                    return (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                          exportFormat === format
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 ${exportFormat === format ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-sm font-bold ${exportFormat === format ? 'text-primary' : 'text-gray-600'}`}>
                          {format}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-6 h-6" />
              <span>{loading ? 'Exporting...' : `Export as ${exportFormat}`}</span>
            </button>
          </div>

          {/* Export Information */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">Export Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>CSV</strong> - Compatible with Excel and Google Sheets</li>
                  <li>• <strong>JSON</strong> - Suitable for programmatic data processing</li>
                  <li>• <strong>TXT</strong> - Human-readable plain text output</li>
                  <li>• <strong>PDF</strong> - Professional report with statistics and formatted tables (opens print dialog)</li>
                  <li>• All exports include applicant details, status, and timestamps</li>
                  <li>• Use filters to export specific subsets of data</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExportReport;
