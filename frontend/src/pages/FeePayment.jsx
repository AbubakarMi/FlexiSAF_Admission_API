import React, { useState } from 'react';
import EnrolledStudentSidebar from '../components/EnrolledStudentSidebar';
import { CreditCard, Wallet, Download, CheckCircle, AlertCircle, Clock, Receipt, X } from 'lucide-react';

const FeePayment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [alert, setAlert] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const feeStructure = [
    { id: 1, item: 'Tuition Fee', amount: 250000, status: 'paid', dueDate: 'Jan 15, 2025', semester: 'Spring 2025' },
    { id: 2, item: 'Library Fee', amount: 15000, status: 'paid', dueDate: 'Jan 15, 2025', semester: 'Spring 2025' },
    { id: 3, item: 'Lab Fee', amount: 35000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025' },
    { id: 4, item: 'Sports Fee', amount: 10000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025' },
    { id: 5, item: 'Technology Fee', amount: 25000, status: 'pending', dueDate: 'Feb 1, 2025', semester: 'Spring 2025' }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: 'Jan 10, 2025',
      description: 'Tuition Fee - Spring 2025',
      amount: 250000,
      method: 'Debit Card',
      status: 'completed',
      receiptNo: 'RCP-2025-001'
    },
    {
      id: 2,
      date: 'Jan 10, 2025',
      description: 'Library Fee - Spring 2025',
      amount: 15000,
      method: 'Debit Card',
      status: 'completed',
      receiptNo: 'RCP-2025-002'
    },
    {
      id: 3,
      date: 'Dec 15, 2024',
      description: 'Tuition Fee - Fall 2024',
      amount: 250000,
      method: 'Bank Transfer',
      status: 'completed',
      receiptNo: 'RCP-2024-089'
    }
  ];

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

  const handleDownloadReceipt = (receiptNo) => {
    showAlert(`Receipt ${receiptNo} downloaded successfully!`, 'success');
    // In a real implementation, this would trigger a PDF download
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
                <p className="text-text-secondary font-medium">Manage your tuition and fee payments</p>
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
            <div className="bg-gradient-to-br from-success to-green-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                  <p className="text-xs font-bold text-white">PAID</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-white/80 mb-1">Amount Paid</p>
              <p className="text-3xl font-black mb-1">₦{paidFees.toLocaleString()}</p>
              <p className="text-xs text-white/80">successfully processed</p>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-warning to-yellow-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                  <p className="text-xs font-bold text-white">PENDING</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-white/80 mb-1">Balance Due</p>
              <p className="text-3xl font-black mb-1">₦{pendingFees.toLocaleString()}</p>
              <p className="text-xs text-white/80">outstanding payment</p>
            </div>
          </div>

          {/* Fee Structure Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-gray-200 bg-slate-50">
              <h2 className="text-2xl font-bold text-text">Fee Structure - Spring 2025</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Fee Item
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
                    <td colSpan="3" className="px-6 py-4 text-left">
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
                    <p className="font-medium">Use Student ID as transfer reference</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="font-medium">Contact finance for installment plans</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-slate-50">
              <h2 className="text-2xl font-bold text-text">Payment History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentHistory.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="text-sm font-semibold text-text">{payment.date}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-text">{payment.description}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-lg font-bold text-text">₦{payment.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 rounded-lg bg-gray-100 text-text-secondary text-sm font-semibold">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleDownloadReceipt(payment.receiptNo)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:shadow-md transition-all"
                        >
                          <Download className="w-4 h-4" />
                          {payment.receiptNo}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeePayment;
