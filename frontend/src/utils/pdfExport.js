import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Format currency in Naira
export const formatNaira = (amount) => {
  return `₦${parseFloat(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Add header to PDF
const addPDFHeader = (doc, title) => {
  doc.setFontSize(20);
  doc.setTextColor(40, 44, 52);
  doc.text('FlexiSAF Admissions Portal', 14, 22);

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 14, 32);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString('en-NG')}`, 14, 40);

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(14, 43, 196, 43);

  return 50; // Return Y position for content start
};

// Add footer to PDF
const addPDFFooter = (doc, pageNumber) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Page ${pageNumber}`, 14, pageHeight - 10);
  doc.text(`FlexiSAF © ${new Date().getFullYear()}`, 105, pageHeight - 10, { align: 'center' });
};

// Export Payments to PDF
export const exportPaymentsPDF = (payments, stats) => {
  const doc = new jsPDF();
  let yPos = addPDFHeader(doc, 'Payment Records Report');

  // Add Statistics
  doc.setFontSize(12);
  doc.setTextColor(40, 44, 52);
  doc.text('Summary Statistics', 14, yPos);
  yPos += 10;

  const statsData = [
    ['Total Revenue', formatNaira(stats?.totalRevenue || 0)],
    ['Completed Payments', stats?.completedCount || 0],
    ['Pending Payments', stats?.pendingCount || 0],
    ['Failed Payments', stats?.failedCount || 0]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: statsData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Add Payments Table
  doc.text('Payment Transactions', 14, yPos);
  yPos += 5;

  const paymentData = payments.map(p => [
    p.transactionId,
    p.studentName,
    p.program,
    p.paymentType?.replace('_', ' '),
    formatNaira(p.amount),
    p.status,
    new Date(p.paymentDate).toLocaleDateString('en-NG')
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Transaction ID', 'Student', 'Program', 'Type', 'Amount', 'Status', 'Date']],
    body: paymentData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  addPDFFooter(doc, 1);
  doc.save(`Payments_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export Courses by Program to PDF
export const exportCoursesPDF = (coursesByProgram) => {
  const doc = new jsPDF();
  let yPos = addPDFHeader(doc, 'Courses by Program Report');
  let pageNumber = 1;

  Object.entries(coursesByProgram).forEach(([program, courses], index) => {
    if (yPos > 250) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text(`${program} (${courses.length} courses)`, 14, yPos);
    yPos += 5;

    const courseData = courses.map(c => [
      c.code,
      c.name,
      c.credits,
      c.instructor,
      `${c.enrolled}/${c.capacity}`,
      c.active ? 'Active' : 'Inactive'
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Code', 'Course Name', 'Credits', 'Instructor', 'Enrollment', 'Status']],
      body: courseData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 }
    });

    yPos = doc.lastAutoTable.finalY + 10;
  });

  addPDFFooter(doc, pageNumber);
  doc.save(`Courses_by_Program_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export Exam Control to PDF
export const exportExamControlPDF = (coursesByProgram, examStatus) => {
  const doc = new jsPDF();
  let yPos = addPDFHeader(doc, 'Exam Control Report');
  let pageNumber = 1;

  Object.entries(coursesByProgram).forEach(([program, courses]) => {
    if (yPos > 240) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text(`${program}`, 14, yPos);
    yPos += 5;

    const examData = courses.map(c => {
      const status = examStatus[c.id] || {};
      return [
        c.code,
        c.name,
        status.midtermPublished ? '✓ Published' : '✗ Not Published',
        status.finalPublished ? '✓ Published' : '✗ Not Published'
      ];
    });

    doc.autoTable({
      startY: yPos,
      head: [['Code', 'Course', 'Midterm Exam', 'Final Exam']],
      body: examData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 }
    });

    yPos = doc.lastAutoTable.finalY + 10;
  });

  addPDFFooter(doc, pageNumber);
  doc.save(`Exam_Control_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export Results to PDF
export const exportResultsPDF = (coursesByProgram, publishedResults) => {
  const doc = new jsPDF();
  let yPos = addPDFHeader(doc, 'Results Publication Report');
  let pageNumber = 1;

  Object.entries(coursesByProgram).forEach(([program, courses]) => {
    if (yPos > 240) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text(`${program}`, 14, yPos);
    yPos += 5;

    const resultData = courses.map(c => {
      const published = publishedResults.includes(c.id);
      return [
        c.code,
        c.name,
        c.instructor,
        published ? '✓ Published' : '✗ Not Published'
      ];
    });

    doc.autoTable({
      startY: yPos,
      head: [['Code', 'Course', 'Instructor', 'Results Status']],
      body: resultData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 }
    });

    yPos = doc.lastAutoTable.finalY + 10;
  });

  addPDFFooter(doc, pageNumber);
  doc.save(`Results_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export Students to PDF
export const exportStudentsPDF = (students, title = 'Students Report') => {
  const doc = new jsPDF();
  let yPos = addPDFHeader(doc, title);

  const studentData = students.map(s => [
    s.studentId || s.id,
    `${s.firstName} ${s.lastName}`,
    s.program,
    s.gpa || s.currentGPA || 'N/A',
    s.creditsEarned || s.credits || '0',
    s.status?.replace('_', ' ') || 'ACTIVE'
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Student ID', 'Name', 'Program', 'GPA', 'Credits', 'Status']],
    body: studentData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 }
  });

  addPDFFooter(doc, 1);
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
