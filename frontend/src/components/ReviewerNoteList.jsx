import React from 'react';
import { formatDate } from '../utils/formatters';

const ReviewerNoteList = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No reviewer notes yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-primary">{note.reviewerName}</span>
              <span className="text-text-secondary text-sm ml-2">({note.reviewerEmail})</span>
            </div>
            <span className="text-sm text-text-secondary">
              {formatDate(note.createdAt)}
            </span>
          </div>
          <p className="text-text whitespace-pre-wrap">{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewerNoteList;
