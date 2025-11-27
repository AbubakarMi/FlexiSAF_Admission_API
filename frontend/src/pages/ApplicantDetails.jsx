import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicantService from '../services/applicantService';
import reviewerNoteService from '../services/reviewerNoteService';
import StatusBadge from '../components/StatusBadge';
import ReviewerNoteList from '../components/ReviewerNoteList';
import { formatDate, formatGPA, formatScore } from '../utils/formatters';
import { APPLICATION_STATUS, STATUS_LABELS, AI_HINT_LABELS } from '../utils/constants';

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [aiHint, setAiHint] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplicantDetails();
  }, [id]);

  const fetchApplicantDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [applicantData, aiHintData, notesData] = await Promise.all([
        applicantService.getApplicantById(id),
        applicantService.getAIHint(id),
        reviewerNoteService.getNotes(id)
      ]);

      setApplicant(applicantData);
      setAiHint(aiHintData);
      setNotes(notesData);
    } catch (err) {
      setError('Failed to load applicant details. Please try again.');
      console.error('Error fetching applicant details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!applicant) return;

    setUpdatingStatus(true);
    try {
      const updated = await applicantService.updateApplicant(id, {
        status: newStatus,
        version: applicant.version
      });
      setApplicant(updated);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const addedNote = await reviewerNoteService.addNote(id, newNote);
      setNotes([addedNote, ...notes]);
      setNewNote('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-danger mb-4">{error || 'Applicant not found'}</p>
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
      <header className="bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-primary-100 mb-3 flex items-center transition-all hover:translate-x-[-4px]"
          >
            <span className="mr-2">←</span> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black">
            {applicant.firstName} {applicant.lastName}
          </h1>
          <p className="text-primary-100 text-sm mt-2">{applicant.email}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Applicant Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card hover:shadow-xl transition-all duration-300 animate-fade-in">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <span className="mr-2">👤</span> Basic Information
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-text-secondary">First Name</dt>
                  <dd className="mt-1 text-lg text-text">{applicant.firstName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Last Name</dt>
                  <dd className="mt-1 text-lg text-text">{applicant.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Email</dt>
                  <dd className="mt-1 text-lg text-text">{applicant.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Program</dt>
                  <dd className="mt-1 text-lg text-text">{applicant.program}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">GPA</dt>
                  <dd className="mt-1 text-lg font-semibold text-primary">
                    {formatGPA(applicant.gpa)} / 5.0
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Test Score</dt>
                  <dd className="mt-1 text-lg font-semibold text-primary">
                    {applicant.testScore} / 100
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Application Date</dt>
                  <dd className="mt-1 text-text">{formatDate(applicant.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-secondary">Last Updated</dt>
                  <dd className="mt-1 text-text">{formatDate(applicant.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Status Management */}
            <div className="card hover:shadow-xl transition-all duration-300 animate-fade-in animation-delay-100">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <span className="mr-2">📊</span> Application Status
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Current Status
                  </label>
                  <StatusBadge status={applicant.status} />
                </div>
                <div className="flex-1">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-text-secondary mb-2">
                    Change Status
                  </label>
                  <select
                    id="newStatus"
                    value={applicant.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className="input-field"
                  >
                    {Object.values(APPLICATION_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reviewer Notes */}
            <div className="card hover:shadow-xl transition-all duration-300 animate-fade-in animation-delay-200">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                <span className="mr-2">📝</span> Reviewer Notes
              </h2>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-6">
                <label htmlFor="newNote" className="block text-sm font-medium text-text mb-2">
                  Add a Note
                </label>
                <textarea
                  id="newNote"
                  rows="4"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="input-field"
                  placeholder="Enter your review notes here..."
                  disabled={addingNote}
                ></textarea>
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="btn-primary mt-3"
                >
                  {addingNote ? 'Adding Note...' : 'Add Note'}
                </button>
              </form>

              {/* Notes List */}
              <ReviewerNoteList notes={notes} />
            </div>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* AI Score */}
            {aiHint && (
              <div className="card bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 hover:shadow-xl transition-all duration-300 animate-scale-in">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                  <span className="mr-2">🤖</span> AI Evaluation
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">AI Score</p>
                    <p className="text-4xl font-bold text-primary">
                      {formatScore(aiHint.aiScore)}
                      <span className="text-lg text-text-secondary"> / 100</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">Recommendation</p>
                    <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-primary text-white">
                      {AI_HINT_LABELS[aiHint.recommendedStatus] || aiHint.recommendedStatus}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">Score Breakdown</p>
                    <p className="text-sm text-text whitespace-pre-wrap">{aiHint.reasoning}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-2">Generated Note</p>
                    <div className="bg-white p-3 rounded border border-primary-200">
                      <p className="text-sm text-text">{aiHint.generatedNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-xl transition-all duration-300 animate-scale-in animation-delay-100">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center">
                <span className="mr-2">📈</span> Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Notes:</span>
                  <span className="font-semibold">{notes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Version:</span>
                  <span className="font-semibold">{applicant.version}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicantDetails;
