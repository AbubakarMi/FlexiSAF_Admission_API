import React, { useState, useMemo, useEffect } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useEnrollment } from '../context/EnrollmentContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Wallet, CheckCircle, AlertCircle, Clock, Receipt, X, BookOpen, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const FeePayment = () => {
  const { user } = useAuth();
  const { enrolledCourses, markAllCoursesAsPaid } = useEnrollment();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [alert, setAlert] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Load payment status from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`feePaymentCompleted_${user.id}`);
      if (stored === 'true') {
        setPaymentCompleted(true);
      }
    }
  }, [user]);

  // Save payment status to localStorage when it changes
  useEffect(() => {
    if (user && paymentCompleted) {
      localStorage.setItem(`feePaymentCompleted_${user.id}`, 'true');
    }
  }, [paymentCompleted, user]);

  // Calculate course fees based on enrolled courses
  // Each credit costs ₦15,000
  const COST_PER_CREDIT = 15000;

  const feeStructure = useMemo(() => {
    const fees = [];

    // Add individual course fees
    enrolledCourses.forEach((course) => {
      fees.push({
        id: `course-${course.id}`,
        item: `${course.name} (${course.code})`,
        amount: course.credits * COST_PER_CREDIT,
        status: paymentCompleted ? 'paid' : 'pending',
        dueDate: 'Feb 1, 2025',
        semester: 'Spring 2025',
        type: 'course'
      });
    });

    // Add fixed institutional fees only if there are enrolled courses
    if (enrolledCourses.length > 0) {
      fees.push(
        { id: 'library', item: 'Library Fee', amount: 15000, status: paymentCompleted ? 'paid' : 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' },
        { id: 'technology', item: 'Technology & Platform Fee', amount: 25000, status: paymentCompleted ? 'paid' : 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' },
        { id: 'certification', item: 'Certification Fee', amount: 20000, status: paymentCompleted ? 'paid' : 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' }
      );
    }

    return fees;
  }, [enrolledCourses, paymentCompleted]);

  const totalFees = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = feeStructure.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = totalFees - paidFees;

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handlePayment = () => {
    if (pendingFees === 0) {
      showAlert('No pending fees to pay!', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);

      // Mark payment as completed
      setPaymentCompleted(true);

      // Mark all enrolled courses as paid to unlock exams feature
      markAllCoursesAsPaid();

      showAlert(`Payment of ₦${pendingFees.toLocaleString()} processed successfully! All fees are now paid.`, 'success');
    }, 2000);
  };

  const downloadReceipt = () => {
    if (!paymentCompleted) {
      showAlert('Payment must be completed before downloading receipt', 'error');
      return;
    }

    try {
      // Get student application data from localStorage
      const cachedApplication = localStorage.getItem('studentApplication');
      const studentData = cachedApplication ? JSON.parse(cachedApplication) : null;
      const rawStudentId = studentData?.id || user?.id || '000000';
      const studentId = `STU-${rawStudentId}`;
      const studentName = `${user?.firstName || studentData?.firstName || ''} ${user?.lastName || studentData?.lastName || ''}`.trim();
      const studentProgram = studentData?.program || 'N/A';
      const receiptNumber = `REC-${new Date().getFullYear()}-${String(rawStudentId).padStart(6, '0')}-${new Date().getTime().toString().slice(-4)}`;

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const centerX = pageWidth / 2;

      // Premium color palette
      const colors = {
        primary: [0, 102, 204],        // FlexiSAF Blue
        primaryDark: [0, 76, 153],     // Darker blue
        primaryLight: [230, 242, 255],  // Light blue
        success: [16, 185, 129],        // Emerald green
        successLight: [209, 250, 229],  // Light green
        warning: [245, 158, 11],        // Amber
        text: [15, 23, 42],             // Slate 900
        textLight: [71, 85, 105],       // Slate 600
        border: [226, 232, 240],        // Slate 200
        gray: [248, 250, 252]           // Slate 50
      };

      // Currency formatter
      const formatAmount = (amount) => `NGN ${amount.toLocaleString()}.00`;

      // Get fee items
      const courseFees = feeStructure.filter(f => f.type === 'course');
      const technologyFee = feeStructure.find(f => f.id === 'technology');
      const libraryFee = feeStructure.find(f => f.id === 'library');
      const certificationFee = feeStructure.find(f => f.id === 'certification');

      // Helper: Add watermark background
      const addWatermark = () => {
        pdf.setTextColor(245, 245, 245);
        pdf.setFontSize(60);
        pdf.setFont('helvetica', 'bold');

        // Save current graphics state
        const angle = -45;
        const rad = angle * Math.PI / 180;

        // Add multiple watermarks in a pattern
        for (let i = 0; i < 3; i++) {
          const yPos = 100 + (i * 80);
          pdf.text('FLEXISAF', centerX, yPos, {
            align: 'center',
            angle: angle
          });
        }
      };

      // Helper: Add premium header with gradient simulation
      const addHeader = (pageNum) => {
        // Multi-layer header for depth effect
        // Darkest layer
        pdf.setFillColor(...colors.primaryDark);
        pdf.rect(0, 0, pageWidth, 8, 'F');

        // Main layer
        pdf.setFillColor(...colors.primary);
        pdf.rect(0, 8, pageWidth, 18, 'F');

        // Light accent on top
        pdf.setFillColor(255, 255, 255);
        pdf.setGState(new pdf.GState({ opacity: 0.1 }));
        pdf.rect(0, 0, pageWidth, 3, 'F');
        pdf.setGState(new pdf.GState({ opacity: 1 }));

        // University logo placeholder (circle)
        pdf.setFillColor(255, 255, 255);
        pdf.circle(20, 13, 5, 'F');
        pdf.setFillColor(...colors.primary);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FS', 20, 14.5, { align: 'center' });

        // University name with shadow effect
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');

        // Shadow
        pdf.setTextColor(0, 76, 153);
        pdf.text('FLEXISAF UNIVERSITY', centerX + 0.5, 15.5, { align: 'center' });

        // Main text
        pdf.setTextColor(255, 255, 255);
        pdf.text('FLEXISAF UNIVERSITY', centerX, 15, { align: 'center' });

        // Subtitle with premium font
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(235, 245, 255);
        pdf.text('EXCELLENCE IN SKILLS-BASED LEARNING', centerX, 22, { align: 'center' });

        // Decorative line with dots
        pdf.setDrawColor(...colors.primary);
        pdf.setLineWidth(1.5);
        pdf.line(margin, 32, pageWidth - margin, 32);

        // Add decorative dots
        pdf.setFillColor(...colors.primary);
        pdf.circle(margin, 32, 1.5, 'F');
        pdf.circle(pageWidth - margin, 32, 1.5, 'F');
        pdf.circle(centerX, 32, 1.5, 'F');

        // Thin accent line
        pdf.setDrawColor(180, 200, 230);
        pdf.setLineWidth(0.3);
        pdf.line(margin, 33.5, pageWidth - margin, 33.5);
      };

      // Helper: Add premium footer
      const addFooter = (pageNum) => {
        const footerY = pageHeight - 22;

        // Decorative top border
        pdf.setDrawColor(230, 240, 250);
        pdf.setLineWidth(0.5);
        pdf.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

        pdf.setDrawColor(...colors.primary);
        pdf.setLineWidth(1);
        pdf.line(margin, footerY, pageWidth - margin, footerY);

        // Background tint
        pdf.setFillColor(250, 252, 255);
        pdf.rect(0, footerY + 1, pageWidth, pageHeight - footerY, 'F');

        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 102, 204);
        pdf.text('FlexiSAF University Finance Office', centerX, footerY + 5, { align: 'center' });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(90, 90, 90);
        pdf.text('Plot 1234, University Road, Victoria Island, Lagos, Nigeria', centerX, footerY + 9, { align: 'center' });
        pdf.text('Email: finance@flexisaf.edu.ng | Phone: +234-800-FLEXISAF (353-9472)', centerX, footerY + 13, { align: 'center' });

        // Page number badge
        pdf.setFillColor(...colors.primary);
        pdf.roundedRect(pageWidth - margin - 25, footerY + 3, 25, 8, 1.5, 1.5, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Page ${pageNum} of 4`, pageWidth - margin - 12.5, footerY + 8, { align: 'center' });

        // Security text
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(6);
        pdf.setTextColor(120, 120, 120);
        pdf.text('This is a computer-generated receipt and is valid without signature', margin, footerY + 18);
      };

      // ==================== PAGE 1: RECEIPT HEADER & SUMMARY ====================
      addWatermark();
      addHeader(1);

      let y = 40;

      // Receipt title banner with premium styling
      // Outer glow effect
      pdf.setDrawColor(180, 220, 255);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(margin - 0.5, y - 0.5, pageWidth - 2 * margin + 1, 20, 4, 4);

      // Main banner background with gradient simulation
      pdf.setFillColor(235, 245, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 20, 3.5, 3.5, 'F');

      // Inner accent
      pdf.setFillColor(245, 250, 255);
      pdf.roundedRect(margin + 2, y + 2, pageWidth - 2 * margin - 4, 16, 2.5, 2.5, 'F');

      // Border
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(0.8);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 20, 3.5, 3.5, 'S');

      // Title with enhanced typography
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 76, 153);
      pdf.text('OFFICIAL FEE PAYMENT RECEIPT', centerX, y + 13, { align: 'center' });

      y += 28;

      // Student & Receipt Information Box with premium design
      // Outer shadow effect
      pdf.setDrawColor(210, 225, 240);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 50, 4, 4);

      // Main background
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 50, 4, 4, 'F');

      // Border with premium color
      pdf.setDrawColor(180, 210, 240);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 50, 4, 4, 'S');

      // Vertical divider between sections
      pdf.setDrawColor(220, 230, 245);
      pdf.setLineWidth(0.5);
      pdf.line(centerX, y + 8, centerX, y + 42);

      // Left side - Student Info
      const infoStartY = y + 10;

      // Section header with background
      pdf.setFillColor(240, 248, 255);
      pdf.roundedRect(margin + 4, infoStartY - 5, 85, 8, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 204);
      pdf.text('STUDENT INFORMATION', margin + 7, infoStartY);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);

      let infoY = infoStartY + 9;
      const labelX = margin + 7;
      const valueX = margin + 35;

      pdf.text('Name:', labelX, infoY);
      pdf.text('Student ID:', labelX, infoY + 7);
      pdf.text('Program:', labelX, infoY + 14);
      pdf.text('Semester:', labelX, infoY + 21);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      pdf.text(studentName || 'N/A', valueX, infoY);

      // Student ID with special styling
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 204);
      pdf.text(studentId, valueX, infoY + 7);

      // Truncate program if too long
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 30, 30);
      const programText = studentProgram.length > 25 ? studentProgram.substring(0, 22) + '...' : studentProgram;
      pdf.text(programText, valueX, infoY + 14);
      pdf.text('Spring 2025', valueX, infoY + 21);

      // Right side - Receipt Info
      const rightBoxX = centerX + 7;
      const rightValueX = centerX + 38;

      // Section header with background
      pdf.setFillColor(240, 248, 255);
      pdf.roundedRect(rightBoxX, infoStartY - 5, 82, 8, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 204);
      pdf.text('RECEIPT DETAILS', rightBoxX + 3, infoStartY);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 70, 70);

      pdf.text('Receipt No:', rightBoxX + 3, infoY);
      pdf.text('Date Issued:', rightBoxX + 3, infoY + 7);
      pdf.text('Payment Status:', rightBoxX + 3, infoY + 14);
      pdf.text('Academic Year:', rightBoxX + 3, infoY + 21);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 30, 30);
      pdf.text(receiptNumber, rightValueX, infoY);
      pdf.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), rightValueX, infoY + 7);

      // Enhanced PAID badge with glow effect
      pdf.setDrawColor(16, 185, 129);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(rightValueX - 0.5, infoY + 11.5, 26, 7.5, 2.5, 2.5);

      pdf.setFillColor(16, 185, 129);
      pdf.roundedRect(rightValueX, infoY + 12, 25, 7, 2.5, 2.5, 'F');

      // Inner highlight
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(new pdf.GState({ opacity: 0.2 }));
      pdf.roundedRect(rightValueX + 1, infoY + 12.5, 23, 3, 1.5, 1.5, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text('PAID', rightValueX + 12.5, infoY + 16.5, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(30, 30, 30);
      pdf.text('2024-2025', rightValueX, infoY + 21);

      y += 58;

      // Payment Summary Section with icon
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 76, 153);

      // Section title with underline accent
      pdf.text('PAYMENT SUMMARY', margin, y);
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(2);
      pdf.line(margin, y + 2, margin + 50, y + 2);

      y += 12;

      // Premium summary box with layered design
      // Shadow layer
      pdf.setDrawColor(200, 215, 235);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin + 0.8, y + 0.8, pageWidth - 2 * margin, 58, 4, 4);

      // Main background with gradient simulation
      pdf.setFillColor(248, 252, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 58, 4, 4, 'F');

      // Inner lighter section
      pdf.setFillColor(253, 254, 255);
      pdf.roundedRect(margin + 3, y + 3, pageWidth - 2 * margin - 6, 52, 3, 3, 'F');

      // Border
      pdf.setDrawColor(180, 210, 240);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 58, 4, 4, 'S');

      y += 12;

      // Total Amount with premium styling
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      pdf.text('Total Fees:', margin + 8, y);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 76, 153);
      pdf.text(formatAmount(totalFees), pageWidth - margin - 8, y, { align: 'right' });

      // Subtle separator line
      y += 4;
      pdf.setDrawColor(230, 240, 250);
      pdf.setLineWidth(0.3);
      pdf.line(margin + 6, y, pageWidth - margin - 6, y);

      y += 9;

      // Amount Paid with success color and icon simulation
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      pdf.text('Amount Paid:', margin + 8, y);

      // Checkmark circle
      pdf.setFillColor(16, 185, 129);
      pdf.circle(pageWidth - margin - 65, y - 2, 3, 'F');
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('✓', pageWidth - margin - 65, y, { align: 'center' });

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(16, 185, 129);
      pdf.text(formatAmount(paidFees), pageWidth - margin - 8, y, { align: 'right' });

      // Subtle separator line
      y += 4;
      pdf.setDrawColor(230, 240, 250);
      pdf.setLineWidth(0.3);
      pdf.line(margin + 6, y, pageWidth - margin - 6, y);

      y += 9;

      // Outstanding Balance
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      pdf.text('Outstanding Balance:', margin + 8, y);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      const balanceColor = pendingFees > 0 ? [220, 50, 50] : [100, 100, 100];
      pdf.setTextColor(...balanceColor);
      pdf.text(formatAmount(pendingFees), pageWidth - margin - 8, y, { align: 'right' });

      y += 9;

      // Payment method badge
      pdf.setFillColor(245, 250, 255);
      pdf.roundedRect(margin + 6, y, 110, 9, 2, 2, 'F');
      pdf.setDrawColor(200, 220, 240);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(margin + 6, y, 110, 9, 2, 2, 'S');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 204);
      pdf.text('Payment Method:', margin + 9, y + 6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 50, 50);
      pdf.text(selectedPaymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Transfer', margin + 44, y + 6);

      y += 14;

      // Enhanced Important Notice with icon
      pdf.setDrawColor(250, 200, 100);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 20, 3, 3);

      pdf.setFillColor(255, 252, 245);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 20, 3, 3, 'F');

      pdf.setDrawColor(245, 158, 11);
      pdf.setLineWidth(1.5);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 20, 3, 3, 'S');

      // Warning icon (exclamation mark in circle)
      pdf.setDrawColor(245, 158, 11);
      pdf.setLineWidth(1);
      pdf.circle(margin + 8, y + 10, 4, 'S');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(245, 158, 11);
      pdf.text('!', margin + 8, y + 12, { align: 'center' });

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(150, 90, 0);
      pdf.text('IMPORTANT NOTICE:', margin + 16, y + 7);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 70, 0);
      pdf.text('This receipt is valid only when all fees are paid in full. Keep this document for your records.', margin + 16, y + 13);
      pdf.text('A detailed fee breakdown is provided on the following pages of this receipt.', margin + 16, y + 18);

      addFooter(1);

      // ==================== PAGE 2: COURSE FEES ====================
      pdf.addPage();
      addWatermark();
      addHeader(2);

      y = 42;

      // Section title with premium styling
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 76, 153);
      pdf.text('COURSE FEES BREAKDOWN', margin, y);

      // Decorative underline
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(2);
      pdf.line(margin, y + 2, margin + 70, y + 2);
      pdf.setDrawColor(180, 200, 230);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y + 3.5, margin + 70, y + 3.5);

      y += 12;

      // Premium course fees table
      // Table container with shadow
      pdf.setDrawColor(215, 225, 240);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 10 + (courseFees.length * 10) + 3, 3, 3);

      // Table header with gradient effect
      pdf.setFillColor(0, 76, 153);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 12, 3, 3, 'F');

      // Light overlay for gradient effect
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(new pdf.GState({ opacity: 0.1 }));
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 6, 3, 3, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('COURSE NAME & CODE', margin + 5, y + 8);
      pdf.text('AMOUNT', pageWidth - margin - 40, y + 8);
      pdf.text('STATUS', pageWidth - margin - 5, y + 8, { align: 'right' });

      y += 12;

      // Table border
      pdf.setDrawColor(180, 210, 240);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, y - 12, pageWidth - 2 * margin, 12 + (courseFees.length * 10) + 3, 3, 3, 'S');

      // Table rows
      courseFees.forEach((course, idx) => {
        // Alternating row colors with premium feel
        if (idx % 2 === 0) {
          pdf.setFillColor(250, 252, 255);
        } else {
          pdf.setFillColor(255, 255, 255);
        }
        pdf.rect(margin, y, pageWidth - 2 * margin, 10, 'F');

        // Row border
        pdf.setDrawColor(235, 240, 250);
        pdf.setLineWidth(0.3);
        pdf.line(margin, y + 10, pageWidth - margin, y + 10);

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(30, 30, 30);

        // Truncate long course names
        const courseName = course.item.length > 45 ? course.item.substring(0, 42) + '...' : course.item;
        pdf.text(courseName, margin + 5, y + 6.5);

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 76, 153);
        pdf.text(formatAmount(course.amount), pageWidth - margin - 40, y + 6.5);

        // Premium PAID badge
        const badgeX = pageWidth - margin - 22;
        const badgeY = y + 3.5;

        pdf.setFillColor(209, 250, 229);
        pdf.roundedRect(badgeX, badgeY, 20, 6, 1.5, 1.5, 'F');

        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(badgeX, badgeY, 20, 6, 1.5, 1.5, 'S');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(16, 185, 129);
        pdf.text('PAID', badgeX + 10, badgeY + 4.5, { align: 'center' });

        y += 10;
      });

      // Total for courses with premium styling
      y += 3;
      pdf.setFillColor(0, 76, 153);
      pdf.rect(margin, y, pageWidth - 2 * margin, 12, 'F');

      pdf.setFillColor(255, 255, 255);
      pdf.setGState(new pdf.GState({ opacity: 0.1 }));
      pdf.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text('TOTAL COURSE FEES:', margin + 5, y + 8);
      pdf.setFontSize(12);
      pdf.text(formatAmount(courseFees.reduce((sum, c) => sum + c.amount, 0)), pageWidth - margin - 5, y + 8, { align: 'right' });

      y += 18;

      // Course fee note with enhanced styling
      pdf.setFillColor(245, 250, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 12, 2, 2, 'F');
      pdf.setDrawColor(200, 220, 240);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 12, 2, 2, 'S');

      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(70, 85, 105);
      pdf.text('Note: Course fees are calculated based on credit hours. Each credit costs NGN 15,000.00', margin + 5, y + 5);
      pdf.text('For additional information on course fees, please contact the Finance Office.', margin + 5, y + 9);

      addFooter(2);

      // ==================== PAGE 3: INSTITUTIONAL FEES ====================
      pdf.addPage();
      addWatermark();
      addHeader(3);

      y = 42;

      // Section title with premium styling
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 76, 153);
      pdf.text('INSTITUTIONAL FEES', margin, y);

      // Decorative underline
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(2);
      pdf.line(margin, y + 2, margin + 65, y + 2);
      pdf.setDrawColor(180, 200, 230);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y + 3.5, margin + 65, y + 3.5);

      y += 14;

      // Technology Fee - Premium Card Design
      if (technologyFee) {
        // Shadow effect
        pdf.setDrawColor(210, 225, 240);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(margin + 0.8, y + 0.8, pageWidth - 2 * margin, 42, 4, 4);

        // Main card background
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'F');

        // Left accent bar
        pdf.setFillColor(0, 102, 204);
        pdf.roundedRect(margin, y, 4, 42, 4, 4, 'F');

        // Card border
        pdf.setDrawColor(180, 210, 240);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'S');

        // Header section with light background
        pdf.setFillColor(245, 250, 255);
        pdf.roundedRect(margin + 8, y + 4, pageWidth - 2 * margin - 16, 14, 2, 2, 'F');

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 76, 153);
        pdf.text('Technology & Platform Fee', margin + 12, y + 12);

        // Amount badge
        pdf.setFillColor(0, 102, 204);
        pdf.roundedRect(pageWidth - margin - 55, y + 6, 48, 10, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(formatAmount(technologyFee.amount), pageWidth - margin - 31, y + 13, { align: 'center' });

        // Description
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 70, 85);
        pdf.text('Covers learning management system, digital resources, online library access,', margin + 12, y + 24);
        pdf.text('and all technology infrastructure required for your academic success.', margin + 12, y + 29);

        // PAID badge
        pdf.setFillColor(209, 250, 229);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'F');
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'S');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(16, 185, 129);
        pdf.text('PAID', margin + 23, y + 37.5, { align: 'center' });

        y += 48;
      }

      // Library Fee - Premium Card Design
      if (libraryFee) {
        // Shadow effect
        pdf.setDrawColor(210, 225, 240);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(margin + 0.8, y + 0.8, pageWidth - 2 * margin, 42, 4, 4);

        // Main card background
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'F');

        // Left accent bar (different color for variety)
        pdf.setFillColor(16, 185, 129);
        pdf.roundedRect(margin, y, 4, 42, 4, 4, 'F');

        // Card border
        pdf.setDrawColor(180, 210, 240);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'S');

        // Header section with light background
        pdf.setFillColor(245, 250, 255);
        pdf.roundedRect(margin + 8, y + 4, pageWidth - 2 * margin - 16, 14, 2, 2, 'F');

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 76, 153);
        pdf.text('Library Fee', margin + 12, y + 12);

        // Amount badge
        pdf.setFillColor(16, 185, 129);
        pdf.roundedRect(pageWidth - margin - 55, y + 6, 48, 10, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(formatAmount(libraryFee.amount), pageWidth - margin - 31, y + 13, { align: 'center' });

        // Description
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 70, 85);
        pdf.text('Access to physical and digital library resources, research databases, study', margin + 12, y + 24);
        pdf.text('spaces, and borrowing privileges for the entire semester.', margin + 12, y + 29);

        // PAID badge
        pdf.setFillColor(209, 250, 229);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'F');
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'S');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(16, 185, 129);
        pdf.text('PAID', margin + 23, y + 37.5, { align: 'center' });

        y += 48;
      }

      // Certification Fee - Premium Card Design
      if (certificationFee) {
        // Shadow effect
        pdf.setDrawColor(210, 225, 240);
        pdf.setLineWidth(0.4);
        pdf.roundedRect(margin + 0.8, y + 0.8, pageWidth - 2 * margin, 42, 4, 4);

        // Main card background
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'F');

        // Left accent bar (gold color for certificate)
        pdf.setFillColor(245, 158, 11);
        pdf.roundedRect(margin, y, 4, 42, 4, 4, 'F');

        // Card border
        pdf.setDrawColor(180, 210, 240);
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, y, pageWidth - 2 * margin, 42, 4, 4, 'S');

        // Header section with light background
        pdf.setFillColor(245, 250, 255);
        pdf.roundedRect(margin + 8, y + 4, pageWidth - 2 * margin - 16, 14, 2, 2, 'F');

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 76, 153);
        pdf.text('Certification Fee', margin + 12, y + 12);

        // Amount badge
        pdf.setFillColor(245, 158, 11);
        pdf.roundedRect(pageWidth - margin - 55, y + 6, 48, 10, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(formatAmount(certificationFee.amount), pageWidth - margin - 31, y + 13, { align: 'center' });

        // Description
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 70, 85);
        pdf.text('Covers the cost of your official program certificate upon successful', margin + 12, y + 24);
        pdf.text('completion of all course requirements and academic standards.', margin + 12, y + 29);

        // PAID badge
        pdf.setFillColor(209, 250, 229);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'F');
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin + 12, y + 33, 22, 7, 2, 2, 'S');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(16, 185, 129);
        pdf.text('PAID', margin + 23, y + 37.5, { align: 'center' });
      }

      addFooter(3);

      // ==================== PAGE 4: TERMS & VERIFICATION ====================
      pdf.addPage();
      addWatermark();
      addHeader(4);

      y = 42;

      // Section title with premium styling
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 76, 153);
      pdf.text('TERMS & CONDITIONS', margin, y);

      // Decorative underline
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(2);
      pdf.line(margin, y + 2, margin + 72, y + 2);
      pdf.setDrawColor(180, 200, 230);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y + 3.5, margin + 72, y + 3.5);

      y += 14;

      // Terms box with premium styling
      pdf.setDrawColor(215, 225, 240);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 54, 3, 3);

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 54, 3, 3, 'F');

      pdf.setDrawColor(180, 210, 240);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 54, 3, 3, 'S');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 60, 75);

      const terms = [
        '1. This receipt serves as official proof of payment for the Spring 2025 semester fees.',
        '2. All fees paid are non-refundable except in cases explicitly stated in university policy.',
        '3. Students must complete payment before the semester deadline to avoid late fees.',
        '4. This receipt should be retained for the duration of your academic program.',
        '5. In case of overpayment, credit will be applied to the next semester fees.',
        '6. For payment discrepancies, contact the Finance Office within 14 days of payment.'
      ];

      terms.forEach((term, idx) => {
        pdf.text(term, margin + 6, y + 8 + (idx * 8));
      });

      y += 62;

      // Premium Verification Section
      pdf.setDrawColor(200, 220, 245);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 52, 3, 3);

      pdf.setFillColor(245, 250, 255);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 52, 3, 3, 'F');

      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(1.5);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 52, 3, 3, 'S');

      // Header with background
      pdf.setFillColor(0, 76, 153);
      pdf.roundedRect(margin + 3, y + 4, pageWidth - 2 * margin - 6, 10, 2, 2, 'F');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('RECEIPT VERIFICATION', margin + 8, y + 11);

      // Verification details in two columns
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 80, 95);

      const verifyY = y + 22;
      pdf.text('Receipt Number:', margin + 8, verifyY);
      pdf.text('Student ID:', margin + 8, verifyY + 8);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 40, 55);
      pdf.text(receiptNumber, margin + 40, verifyY);
      pdf.text(studentId, margin + 40, verifyY + 8);

      const rightVerifyX = centerX + 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(70, 80, 95);
      pdf.text('Generated:', rightVerifyX, verifyY);
      pdf.text('Time:', rightVerifyX, verifyY + 8);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 40, 55);
      const generatedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const generatedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      pdf.text(generatedDate, rightVerifyX + 25, verifyY);
      pdf.text(generatedTime, rightVerifyX + 25, verifyY + 8);

      // QR code placeholder
      pdf.setDrawColor(0, 102, 204);
      pdf.setLineWidth(1);
      pdf.rect(margin + 8, y + 35, 14, 14);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 102, 204);
      pdf.text('QR', margin + 15, y + 43, { align: 'center' });

      // Digital verification text
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 110, 125);
      pdf.text('Scan to verify receipt authenticity', margin + 26, y + 42);

      y += 60;

      // Official stamp and signature area with premium design
      // Stamp box
      pdf.setDrawColor(180, 190, 200);
      pdf.setLineWidth(1);
      pdf.setLineDash([3, 2]);
      pdf.roundedRect(margin, y, 55, 32, 2, 2);
      pdf.setLineDash([]);

      pdf.setFillColor(250, 250, 252);
      pdf.roundedRect(margin + 2, y + 2, 51, 28, 1.5, 1.5, 'F');

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(140, 150, 160);
      pdf.text('Official University', margin + 27.5, y + 14, { align: 'center' });
      pdf.text('Stamp', margin + 27.5, y + 19, { align: 'center' });

      // Signature line with premium styling
      const sigX = pageWidth - margin - 75;
      pdf.setDrawColor(100, 110, 120);
      pdf.setLineWidth(0.8);
      pdf.line(sigX, y + 22, pageWidth - margin - 8, y + 22);

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(90, 100, 110);
      pdf.text('Finance Officer Signature', sigX + 33.5, y + 28, { align: 'center' });

      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(120, 130, 140);
      pdf.text('Authorized Signatory', sigX + 33.5, y + 32, { align: 'center' });

      y += 40;

      // Premium contact information box
      pdf.setDrawColor(245, 200, 100);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin + 0.5, y + 0.5, pageWidth - 2 * margin, 26, 3, 3);

      pdf.setFillColor(255, 253, 248);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 26, 3, 3, 'F');

      pdf.setDrawColor(245, 158, 11);
      pdf.setLineWidth(1.2);
      pdf.roundedRect(margin, y, pageWidth - 2 * margin, 26, 3, 3, 'S');

      // Contact header
      pdf.setFillColor(250, 240, 220);
      pdf.roundedRect(margin + 4, y + 3, 48, 8, 2, 2, 'F');

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(130, 80, 0);
      pdf.text('FOR INQUIRIES:', margin + 8, y + 8.5);

      // Contact details in grid
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 60, 0);

      const contactY = y + 16;
      pdf.text('Email: finance@flexisaf.edu.ng', margin + 6, contactY);
      pdf.text('Phone: +234-800-FLEXISAF (353-9472)', margin + 6, contactY + 6);

      pdf.text('Visit: Finance Office, Block A, Ground Floor', pageWidth - margin - 6, contactY, { align: 'right' });
      pdf.text('Office Hours: Mon-Fri, 9:00 AM - 4:00 PM', pageWidth - margin - 6, contactY + 6, { align: 'right' });

      addFooter(4);

      // Save PDF
      pdf.save(`FlexiSAF_Receipt_${studentId}_${new Date().toISOString().split('T')[0]}.pdf`);
      showAlert('Receipt downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showAlert('Error generating receipt. Please try again.', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EnrolledStudentSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Alert */}
        {alert && (
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
            alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white animate-slide-in`}>
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-4">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-text mb-1">Fee Payment</h1>
                <p className="text-text-secondary font-medium">Manage your program and fee payments</p>
              </div>
              <div className="flex items-center space-x-3">
                {paymentCompleted && (
                  <button
                    onClick={downloadReceipt}
                    className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                )}
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Spring 2025</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Empty State - No Enrolled Courses */}
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Course Enrollments</h3>
              <p className="text-gray-600 mb-6">
                You need to enroll in courses before fees can be calculated. Once you enroll in your program courses, your fees will be automatically calculated based on course credits.
              </p>
              <a
                href="/enrolled/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </a>
            </div>
          ) : (
            <>
              {/* Course Summary */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-primary p-8 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-2">Enrolled Courses</p>
                    <p className="text-5xl font-black text-primary mb-3">{enrolledCourses.length} Course{enrolledCourses.length !== 1 ? 's' : ''}</p>
                    <p className="text-sm font-semibold text-text-secondary">
                      Total Credits: <span className="text-text font-bold">{enrolledCourses.reduce((sum, c) => sum + c.credits, 0)}</span> • Fee per Credit: <span className="text-text font-bold">₦{COST_PER_CREDIT.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-primary bg-opacity-10 flex items-center justify-center">
                    <Receipt className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>

              {/* Payment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Fees */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded-lg">
                      <p className="text-xs font-bold text-gray-600">TOTAL</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-text-secondary mb-1">Total Fees</p>
                  <p className="text-3xl font-black text-text mb-1">₦{totalFees.toLocaleString()}</p>
                  <p className="text-xs text-text-secondary">for this semester</p>
                </div>

                {/* Paid */}
                <div className="bg-white rounded-xl shadow-sm border-2 border-success p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-success bg-opacity-10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div className="px-3 py-1 bg-success bg-opacity-10 rounded-lg">
                      <p className="text-xs font-bold text-success">PAID</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-1">Amount Paid</p>
                  <p className="text-3xl font-black text-success mb-1">₦{paidFees.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-text-secondary">successfully processed</p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-xl shadow-sm border-2 border-warning p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-warning bg-opacity-10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div className="px-3 py-1 bg-warning bg-opacity-10 rounded-lg">
                      <p className="text-xs font-bold text-warning">PENDING</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-1">Balance Due</p>
                  <p className="text-3xl font-black text-warning mb-1">₦{pendingFees.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-text-secondary">outstanding payment</p>
                </div>
              </div>

              {/* Fee Structure Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="px-8 py-6 border-b border-gray-200 bg-slate-50">
                  <h2 className="text-2xl font-bold text-text">Fee Breakdown - Spring 2025</h2>
                  <p className="text-sm text-text-secondary mt-1">Fees calculated based on your enrolled courses</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Fee Item
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {feeStructure.map(fee => (
                        <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-bold text-text">{fee.item}</p>
                              <p className="text-sm text-text-secondary">{fee.semester}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                              fee.type === 'course'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {fee.type === 'course' ? 'Course' : 'Institutional'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <p className="text-lg font-bold text-text">₦{fee.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <p className="text-sm font-semibold text-text-secondary">{fee.dueDate}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            {fee.status === 'paid' ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg font-bold text-sm bg-success bg-opacity-10 text-success border border-success border-opacity-20">
                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg font-bold text-sm bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20">
                                <Clock className="w-4 h-4 mr-1.5" />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-left">
                          <span className="text-lg font-bold text-text">Total Amount</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-2xl font-black text-primary">₦{totalFees.toLocaleString()}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Section */}
              {pendingFees > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Payment Form */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-text">Make Payment</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-bold text-text mb-3">Amount to Pay</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text font-bold text-xl">
                            ₦
                          </span>
                          <input
                            type="text"
                            value={pendingFees.toLocaleString()}
                            readOnly
                            className="w-full pl-12 pr-5 py-4 border-2 border-gray-300 rounded-xl bg-gray-50 font-bold text-xl text-text focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <label className="block text-sm font-bold text-text mb-3">Payment Method</label>
                        <div className="space-y-3">
                          <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPaymentMethod === 'card'
                              ? 'border-primary bg-primary bg-opacity-5 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={selectedPaymentMethod === 'card'}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="w-5 h-5 text-primary"
                            />
                            <div className="ml-4 flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                selectedPaymentMethod === 'card' ? 'bg-primary' : 'bg-gray-100'
                              }`}>
                                <CreditCard className={`w-5 h-5 ${selectedPaymentMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                              </div>
                              <div>
                                <p className="font-bold text-text">Debit/Credit Card</p>
                                <p className="text-xs text-text-secondary">Visa, Mastercard, Verve</p>
                              </div>
                            </div>
                          </label>

                          <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPaymentMethod === 'bank'
                              ? 'border-primary bg-primary bg-opacity-5 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank"
                              checked={selectedPaymentMethod === 'bank'}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="w-5 h-5 text-primary"
                            />
                            <div className="ml-4 flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                selectedPaymentMethod === 'bank' ? 'bg-primary' : 'bg-gray-100'
                              }`}>
                                <Wallet className={`w-5 h-5 ${selectedPaymentMethod === 'bank' ? 'text-white' : 'text-gray-600'}`} />
                              </div>
                              <div>
                                <p className="font-bold text-text">Bank Transfer</p>
                                <p className="text-xs text-text-secondary">Direct bank deposit</p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full py-4 text-white rounded-xl font-bold text-lg transition-all ${
                          isProcessing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:shadow-lg active:scale-[0.98]'
                        }`}
                      >
                        {isProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
                      </button>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-text">Payment Information</h3>
                    </div>
                    <div className="space-y-3 text-sm text-text">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <p className="font-medium">Secure encrypted payment gateway</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <p className="font-medium">Instant receipt after payment</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <p className="font-medium">Fees calculated per course credit</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <p className="font-medium">Contact finance for payment plans</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FeePayment;
