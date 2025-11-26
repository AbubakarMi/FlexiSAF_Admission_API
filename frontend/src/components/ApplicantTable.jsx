import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate, formatGPA } from '../utils/formatters';

const ApplicantTable = ({ applicants }) => {
  const navigate = useNavigate();

  if (!applicants || applicants.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-secondary">No applicants found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-50">
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Program</th>
              <th className="table-header">GPA</th>
              <th className="table-header">Test Score</th>
              <th className="table-header">Status</th>
              <th className="table-header">AI Score</th>
              <th className="table-header">Created</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium">
                  {applicant.firstName} {applicant.lastName}
                </td>
                <td className="table-cell">{applicant.email}</td>
                <td className="table-cell">{applicant.program}</td>
                <td className="table-cell">{formatGPA(applicant.gpa)}</td>
                <td className="table-cell">{applicant.testScore}</td>
                <td className="table-cell">
                  <StatusBadge status={applicant.status} />
                </td>
                <td className="table-cell">
                  {applicant.aiScore ? (
                    <span className="font-medium text-primary">
                      {applicant.aiScore}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="table-cell text-text-secondary">
                  {formatDate(applicant.createdAt)}
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => navigate(`/applicants/${applicant.id}`)}
                    className="text-primary hover:text-primary-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;
