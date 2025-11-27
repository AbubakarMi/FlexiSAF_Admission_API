import React, { useState, useMemo } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { useEnrollment } from '../context/EnrollmentContext';
import { CreditCard, Wallet, CheckCircle, AlertCircle, Clock, Receipt, X, BookOpen } from 'lucide-react';

const FeePayment = () => {
  const { enrolledCourses } = useEnrollment();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [alert, setAlert] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
        status: 'pending',
        dueDate: 'Feb 1, 2025',
        semester: 'Spring 2025',
        type: 'course'
      });
    });

    // Add fixed institutional fees only if there are enrolled courses
    if (enrolledCourses.length > 0) {
      fees.push(
        { id: 'library', item: 'Library Fee', amount: 15000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' },
        { id: 'technology', item: 'Technology & Platform Fee', amount: 25000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' },
        { id: 'certification', item: 'Certification Fee', amount: 20000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025', type: 'institutional' }
      );
    }

    return fees;
  }, [enrolledCourses]);

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
      showAlert(`Payment of ₦${pendingFees.toLocaleString()} processed successfully!`, 'success');
    }, 2000);
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
