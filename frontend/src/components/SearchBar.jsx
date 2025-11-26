import React, { useState } from 'react';
import { APPLICATION_STATUS, STATUS_LABELS } from '../utils/constants';

const SearchBar = ({ onSearch }) => {
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ email, program, status });
  };

  const handleReset = () => {
    setEmail('');
    setProgram('');
    setStatus('');
    onSearch({ email: '', program: '', status: '' });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search by email..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium text-text mb-1">
            Program
          </label>
          <input
            type="text"
            id="program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="Search by program..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            {Object.values(APPLICATION_STATUS).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <button type="submit" className="btn-primary flex-1">
            Search
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary flex-1">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
