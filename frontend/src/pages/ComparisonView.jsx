import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import applicantService from '../services/applicantService';
import { formatGPA, formatDate } from '../utils/formatters';

const ComparisonView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      fetchApplicants(ids.split(','));
    } else {
      setError('No applicants selected for comparison');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchApplicants = async (ids) => {
    setLoading(true);
    try {
      const promises = ids.map(id => applicantService.getApplicantById(id));
      const data = await Promise.all(promises);
      setApplicants(data);
    } catch (err) {
      setError('Failed to load applicants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getComparisonValue = (field, values) => {
    if (field === 'gpa' || field === 'testScore' || field === 'aiScore') {
      const nums = values.filter(v => v !== null && v !== undefined);
      if (nums.length === 0) return null;

      const max = Math.max(...nums);
      const min = Math.min(...nums);

      return { max, min, values };
    }
    return { values };
  };

  const ComparisonRow = ({ label, field, format }) => {
    const values = applicants.map(a => a[field]);
    const comparison = getComparisonValue(field, values);

    return (
      <div className="border-b border-gray-200 hover:bg-gray-50">
        <div className="py-4 px-6 font-semibold text-text-secondary bg-gray-50">{label}</div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${applicants.length}, 1fr)` }}>
          {applicants.map((applicant, index) => {
            const value = values[index];
            const isMax = comparison.max !== undefined && value === comparison.max;
            const isMin = comparison.min !== undefined && value === comparison.min && comparison.min !== comparison.max;

            return (
              <div
                key={applicant.id}
                className={`py-4 px-6 text-center border-l border-gray-200 ${
                  isMax ? 'bg-green-50 font-bold text-green-700' :
                  isMin ? 'bg-red-50 font-bold text-red-700' :
                  'text-text'
                }`}
              >
                {format ? format(value) : value || 'N/A'}
                {isMax && <span className="ml-2">🏆</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-text-secondary font-medium">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || applicants.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-danger mb-4">{error || 'No applicants to compare'}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-primary-100 mb-3 flex items-center"
          >
            <span className="mr-2">←</span> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black">🔄 Applicant Comparison</h1>
          <p className="text-primary-100 mt-2">Comparing {applicants.length} applicants side by side</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Applicant Headers */}
        <div className="card mb-6 overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${applicants.length}, 1fr)` }}>
            <div className="py-6 px-6 bg-gray-100 font-bold text-text">Applicant</div>
            {applicants.map((applicant, index) => (
              <div
                key={applicant.id}
                className="py-6 px-6 text-center border-l border-gray-200 bg-gradient-to-br from-primary-50 to-white"
              >
                <div className="text-lg font-black text-primary">
                  {applicant.firstName} {applicant.lastName}
                </div>
                <div className="text-sm text-text-secondary mt-1">{applicant.email}</div>
                <button
                  onClick={() => navigate(`/applicants/${applicant.id}`)}
                  className="mt-3 text-xs text-primary hover:text-primary-700 font-semibold hover:underline"
                >
                  View Full Details →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="card overflow-hidden">
          <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${applicants.length}, 1fr)` }}>
            <ComparisonRow
              label="Program"
              field="program"
            />

            <ComparisonRow
              label="GPA"
              field="gpa"
              format={(v) => v ? formatGPA(v) + ' / 5.0' : 'N/A'}
            />

            <ComparisonRow
              label="Test Score"
              field="testScore"
              format={(v) => v ? `${v} / 100` : 'N/A'}
            />

            <ComparisonRow
              label="AI Score"
              field="aiScore"
              format={(v) => v ? `${v.toFixed(1)} / 100` : 'N/A'}
            />

            <ComparisonRow
              label="Status"
              field="status"
            />

            <ComparisonRow
              label="AI Recommendation"
              field="aiHint"
            />

            <ComparisonRow
              label="Application Date"
              field="createdAt"
              format={formatDate}
            />

            <ComparisonRow
              label="Last Updated"
              field="updatedAt"
              format={formatDate}
            />
          </div>
        </div>

        {/* Summary/Recommendation */}
        <div className="mt-8 card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <h3 className="text-xl font-bold text-primary mb-4">📊 Comparison Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Highest GPA</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...applicants.map(a => parseFloat(a.gpa))).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Highest Test Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.max(...applicants.map(a => a.testScore))}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Highest AI Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.max(...applicants.map(a => a.aiScore || 0)).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-text mb-2">🤖 AI Insight:</p>
            <p className="text-sm text-text-secondary">
              Based on the comparison, {applicants.reduce((best, curr) =>
                (curr.aiScore || 0) > (best.aiScore || 0) ? curr : best
              ).firstName} {applicants.reduce((best, curr) =>
                (curr.aiScore || 0) > (best.aiScore || 0) ? curr : best
              ).lastName} has the highest overall AI evaluation score.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            🖨️ Print Comparison
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComparisonView;
