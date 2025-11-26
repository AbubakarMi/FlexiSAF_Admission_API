import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-md border border-gray-300 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-2 rounded-md border border-gray-300 text-text-secondary hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 1 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md border ${
            currentPage === page
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 text-text-secondary hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-3 py-2 rounded-md border border-gray-300 text-text-secondary hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-md border border-gray-300 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
