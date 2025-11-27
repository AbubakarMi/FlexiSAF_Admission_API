import React, { useState, useEffect } from 'react';
import applicantService from '../services/applicantService';
import Sidebar from '../components/Sidebar';
import {
  TrendingUp,
  Users,
  Clock,
  Eye,
  CheckCircle,
  FileText,
  Award,
  Brain,
  Calendar,
  RefreshCw,
  XCircle
} from 'lucide-react';

const DashboardOverview = () => {
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
  const [loading, setLoading] = useState(true);
  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await applicantService.getApplicants({
        page: 0,
        size: 1000,
        sort: 'createdAt',
        direction: 'desc'
      });

      const all = response.content;
      const pending = all.filter(a => a.status === 'PENDING');
      const inReview = all.filter(a => a.status === 'IN_REVIEW');
      const accepted = all.filter(a => a.status === 'ACCEPTED');
      const rejected = all.filter(a => a.status === 'REJECTED');

      const avgGpa = all.length > 0 ? all.reduce((sum, a) => sum + parseFloat(a.gpa), 0) / all.length : 0;
      const avgTestScore = all.length > 0 ? all.reduce((sum, a) => sum + a.testScore, 0) / all.length : 0;
      const avgAiScore = all.length > 0 ? all.reduce((sum, a) => sum + (a.aiScore || 0), 0) / all.length : 0;

      setStats({
        total: all.length,
        pending: pending.length,
        inReview: inReview.length,
        accepted: accepted.length,
        rejected: rejected.length,
        avgGpa,
        avgTestScore,
        avgAiScore
      });

      setRecentApplicants(all.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Clean Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-primary">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto">
          {/* Key Metrics - Clean Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Applications */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-600 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Applications</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All submissions</p>
            </div>

            {/* Pending Review */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-yellow-600 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Review</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
            </div>

            {/* In Review */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-purple-600 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Active</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">In Review</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.inReview}</p>
              <p className="text-xs text-gray-500 mt-1">Being evaluated</p>
            </div>

            {/* Accepted */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-green-600 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Admitted</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Accepted</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.accepted}</p>
              <p className="text-xs text-gray-500 mt-1">Successfully admitted</p>
            </div>
          </div>

          {/* Academic Metrics - Clean Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-600 rounded-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Average GPA</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgGpa.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-600 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Test Score</h3>
                  <p className="text-3xl font-bold text-gray-900">{Math.round(stats.avgTestScore)}</p>
                  <p className="text-xs text-gray-500 mt-1">Out of 100</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-purple-600 rounded-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Score</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgAiScore.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">AI Evaluation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Clean Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-primary border-b-2 border-primary-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Recent Applications</span>
                  </h2>
                  <span className="px-3 py-1 bg-white/20 text-white rounded text-xs font-semibold">
                    {recentApplicants.length} New
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {recentApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-base">
                            {applicant.firstName?.charAt(0)}{applicant.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {applicant.firstName} {applicant.lastName}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">{applicant.program}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            applicant.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                            applicant.status === 'IN_REVIEW' ? 'bg-purple-500 text-white' :
                            applicant.status === 'ACCEPTED' ? 'bg-green-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {applicant.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500 font-medium mt-1">GPA: {applicant.gpa}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-primary border-b-2 border-primary-700">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Application Status</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'Pending', count: stats.pending, color: 'bg-yellow-500', icon: Clock },
                    { label: 'In Review', count: stats.inReview, color: 'bg-purple-500', icon: Eye },
                    { label: 'Accepted', count: stats.accepted, color: 'bg-green-500', icon: CheckCircle },
                    { label: 'Rejected', count: stats.rejected, color: 'bg-red-500', icon: XCircle }
                  ].map((item) => {
                    const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                            <span className="text-sm font-bold text-gray-900">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {item.count} <span className="text-gray-500 font-medium">({percentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardOverview;
