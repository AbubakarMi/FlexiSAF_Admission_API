import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navbar with Glassmorphism Effect */}
      <nav className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-black text-primary tracking-tight">FlexiSAF</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-text font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/login"
                className="text-sm text-text font-semibold px-3 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Modern */}
      <div className="relative overflow-hidden bg-white">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-success opacity-5 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary bg-opacity-10 rounded-full mb-8">
              <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-primary font-bold text-sm">Trusted by 10,000+ Students</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text mb-6 leading-tight">
              <span className="block">Admissions</span>
              <span className="block text-primary">Made Simple</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed px-4">
              A modern platform designed to streamline student application management. Submit, track, and manage applications with ease and transparency.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-primary hover:bg-opacity-90 shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 duration-200"
              >
                <svg className="w-6 h-6 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Your Application
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-primary bg-white border-2 border-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign In
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-text-secondary text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">AI-Powered</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Secure & Private</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Premium Cards */}
      <div className="py-20 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 rounded-full text-primary font-bold text-sm mb-4">
              FEATURES
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need for a seamless admissions process
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                Online Submission
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Students submit applications online with personal information, program choices, and academic details. Track your progress every step of the way.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-success transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-success bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-success opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-success transition-colors">
                Multi-Step Review
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Applications move through structured stages: Pending → In-Review → Accepted/Rejected. Clear workflow ensures thorough evaluation.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-warning transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-warning opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-warning transition-colors">
                Reviewer Notes
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Staff can add detailed comments and observations to applications, enabling better decision-making and collaborative reviews.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                Search & Filter
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Easily find applicants by email, program, or status. Powerful sorting and pagination make managing large volumes effortless.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-success transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-success bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-success opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-success transition-colors">
                AI-Powered Insights
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Intelligent system suggests application statuses and drafts reviewer notes based on GPA and test scores for faster decisions.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-warning transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-9 h-9 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-warning opacity-10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-warning transition-colors">
                Clear Communication
              </h3>
              <p className="text-text-secondary leading-relaxed">
                All actions and validation errors are communicated clearly, keeping both applicants and reviewers fully informed at every stage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Modern Timeline */}
      <div className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-success bg-opacity-10 rounded-full text-success font-bold text-sm mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text mb-4">
              Get Started in 3 Steps
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Simple and straightforward process from registration to admission
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-5xl font-black text-white">1</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">Create Account</h3>
              <p className="text-text-secondary leading-relaxed">
                Register with your name, email, and password. Takes less than 60 seconds to get started.
              </p>
              {/* Connection Line - Hidden on mobile */}
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200"></div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-success rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-5xl font-black text-white">2</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">Submit Application</h3>
              <p className="text-text-secondary leading-relaxed">
                Fill out your application with academic details. AI instantly evaluates your submission.
              </p>
              {/* Connection Line - Hidden on mobile */}
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200"></div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-warning rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-5xl font-black text-white">3</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">Track Status</h3>
              <p className="text-text-secondary leading-relaxed">
                Monitor your application progress. Receive clear updates as it moves through review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Ultra Premium */}
      <div className="relative overflow-hidden bg-primary py-20 sm:py-28">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl sm:text-2xl text-white opacity-95 mb-10 max-w-2xl mx-auto">
            Join thousands of students who trust our admissions system for their future
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-10 py-5 border-4 border-white text-xl font-black rounded-2xl text-primary bg-white hover:bg-opacity-95 shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 duration-200"
          >
            <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Now - It's Free
          </Link>
          <p className="mt-6 text-white opacity-75 text-sm">No credit card required • Takes 60 seconds</p>
        </div>
      </div>

      {/* Footer - Modern & Clean */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-black text-primary">FlexiSAF Admissions</span>
            </div>

            {/* Tagline */}
            <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
              Making admissions faster, organized, and transparent for everyone
            </p>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link to="/login" className="text-text hover:text-primary font-semibold transition-colors">
                Sign In
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/register" className="text-text hover:text-primary font-semibold transition-colors">
                Register
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-text-secondary">
              © 2025 FlexiSAF. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
