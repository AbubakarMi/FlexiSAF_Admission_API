import React from 'react';
import { STATUS_LABELS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const badgeClasses = {
    PENDING: 'badge-pending',
    IN_REVIEW: 'badge-in-review',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected'
  };

  return (
    <span className={`badge ${badgeClasses[status] || 'badge-pending'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
};

export default StatusBadge;
