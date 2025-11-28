import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EnrollmentProvider } from './context/EnrollmentContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import DashboardOverview from './pages/DashboardOverview';
import AllApplicants from './pages/AllApplicants';
import ReviewApplicants from './pages/ReviewApplicants';
import AdmittedStudents from './pages/AdmittedStudents';
import ApplicantDetails from './pages/ApplicantDetails';
import ComparisonView from './pages/ComparisonView';
import ExportReport from './pages/ExportReport';
import CourseEnrollment from './pages/CourseEnrollment';
import AcademicCalendar from './pages/AcademicCalendar';
import GradesResults from './pages/GradesResults';
import FeePayment from './pages/FeePayment';
import StudentProfile from './pages/StudentProfile';
import Exams from './pages/Exams';

function App() {
  return (
    <AuthProvider>
      <EnrollmentProvider>
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Student */}
          <Route
            path="/submit-application"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Routes - Enrolled Student */}
          <Route
            path="/enrolled/courses"
            element={
              <PrivateRoute>
                <CourseEnrollment />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrolled/calendar"
            element={
              <PrivateRoute>
                <AcademicCalendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrolled/grades"
            element={
              <PrivateRoute>
                <GradesResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrolled/payments"
            element={
              <PrivateRoute>
                <FeePayment />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrolled/profile"
            element={
              <PrivateRoute>
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrolled/exams"
            element={
              <PrivateRoute>
                <Exams />
              </PrivateRoute>
            }
          />

          {/* Protected Routes - Reviewer/Admin */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/applicants"
            element={
              <PrivateRoute>
                <AllApplicants />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/review"
            element={
              <PrivateRoute>
                <ReviewApplicants />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/admitted"
            element={
              <PrivateRoute>
                <AdmittedStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/export"
            element={
              <PrivateRoute>
                <ExportReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/applicants/:id"
            element={
              <PrivateRoute>
                <ApplicantDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <PrivateRoute>
                <ComparisonView />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </EnrollmentProvider>
    </AuthProvider>
  );
}

export default App;
