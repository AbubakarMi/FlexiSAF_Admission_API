export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  IN_REVIEW: 'In Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

export const AI_HINT_LABELS = {
  RECOMMENDED_ACCEPT: 'Recommended: Accept',
  RECOMMENDED_REVIEW: 'Recommended: Review',
  RECOMMENDED_REJECT: 'Recommended: Reject'
};
