export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatGPA = (gpa) => {
  if (gpa === null || gpa === undefined) return '';
  return Number(gpa).toFixed(2);
};

export const formatScore = (score) => {
  if (score === null || score === undefined) return '';
  return Number(score).toFixed(2);
};

export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'warning',
    IN_REVIEW: 'primary',
    ACCEPTED: 'success',
    REJECTED: 'danger'
  };
  return colors[status] || 'primary';
};
