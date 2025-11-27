import React from 'react';
import { formatDate, formatGPA } from '../utils/formatters';

const PDFExport = {
  generateApplicantsPDF: (applicants) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FlexiSAF Applicants Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4f46e5;
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #4f46e5;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-accepted {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .status-in-review {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .summary {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .summary h3 {
            color: #4f46e5;
            margin-top: 0;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 15px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FlexiSAF Admissions Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Total Applicants: ${applicants.length}</p>
        </div>

        <div class="summary">
          <h3>Summary Statistics</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="label">Pending</div>
              <div class="value">${applicants.filter(a => a.status === 'PENDING').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">In Review</div>
              <div class="value">${applicants.filter(a => a.status === 'IN_REVIEW').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">Accepted</div>
              <div class="value">${applicants.filter(a => a.status === 'ACCEPTED').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">Rejected</div>
              <div class="value">${applicants.filter(a => a.status === 'REJECTED').length}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Program</th>
              <th>GPA</th>
              <th>Test Score</th>
              <th>AI Score</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${applicants.map(applicant => `
              <tr>
                <td>${applicant.firstName} ${applicant.lastName}</td>
                <td>${applicant.email}</td>
                <td>${applicant.program}</td>
                <td>${formatGPA(applicant.gpa)}</td>
                <td>${applicant.testScore}/100</td>
                <td>${applicant.aiScore ? applicant.aiScore.toFixed(1) : 'N/A'}</td>
                <td>
                  <span class="status status-${applicant.status.toLowerCase().replace('_', '-')}">
                    ${applicant.status.replace('_', ' ')}
                  </span>
                </td>
                <td>${formatDate(applicant.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>FlexiSAF Admissions System</strong></p>
          <p>Confidential Document - For Internal Use Only</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
    };
  },

  downloadApplicantsCSV: (applicants) => {
    const headers = ['Name', 'Email', 'Program', 'GPA', 'Test Score', 'AI Score', 'Status', 'Date'];
    const rows = applicants.map(a => [
      `${a.firstName} ${a.lastName}`,
      a.email,
      a.program,
      formatGPA(a.gpa),
      a.testScore,
      a.aiScore ? a.aiScore.toFixed(1) : 'N/A',
      a.status,
      formatDate(a.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default PDFExport;
