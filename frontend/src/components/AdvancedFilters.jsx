import React, { useState } from 'react';
import Modal from './Modal';

const AdvancedFilters = ({ filters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value
    });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      gpaMin: '',
      gpaMax: '',
      testScoreMin: '',
      testScoreMax: '',
      aiScoreMin: '',
      aiScoreMax: '',
      dateFrom: '',
      dateTo: ''
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <Modal isOpen={true} onClose={onClose} type="info" showCloseButton={false}>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Advanced Filters</h3>
      <p className="text-text-secondary mb-6">Filter applicants by specific criteria</p>

      <div className="space-y-6">
        {/* GPA Range */}
        <div>
          <label className="block text-sm font-bold text-text mb-3">GPA Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="gpaMin"
                value={localFilters.gpaMin}
                onChange={handleChange}
                placeholder="Min (0.0)"
                step="0.01"
                min="0"
                max="5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <input
                type="number"
                name="gpaMax"
                value={localFilters.gpaMax}
                onChange={handleChange}
                placeholder="Max (5.0)"
                step="0.01"
                min="0"
                max="5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Test Score Range */}
        <div>
          <label className="block text-sm font-bold text-text mb-3">Test Score Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="testScoreMin"
                value={localFilters.testScoreMin}
                onChange={handleChange}
                placeholder="Min (0)"
                min="0"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <input
                type="number"
                name="testScoreMax"
                value={localFilters.testScoreMax}
                onChange={handleChange}
                placeholder="Max (100)"
                min="0"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AI Score Range */}
        <div>
          <label className="block text-sm font-bold text-text mb-3">AI Score Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="aiScoreMin"
                value={localFilters.aiScoreMin}
                onChange={handleChange}
                placeholder="Min (0)"
                min="0"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <input
                type="number"
                name="aiScoreMax"
                value={localFilters.aiScoreMax}
                onChange={handleChange}
                placeholder="Max (100)"
                min="0"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-bold text-text mb-3">Application Date Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">From</label>
              <input
                type="date"
                name="dateFrom"
                value={localFilters.dateFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">To</label>
              <input
                type="date"
                name="dateTo"
                value={localFilters.dateTo}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={handleReset}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Reset All
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
};

export default AdvancedFilters;
