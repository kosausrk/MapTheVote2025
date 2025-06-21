import { useState } from 'react';
import { boroughData } from '../data/boroughData';

export default function FilterControls({ filteredBoroughs, setFilteredBoroughs }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    minTurnout: 0,
    maxTurnout: 100,
    minIncome: Math.min(...Object.values(boroughData).map(d => d.avg_income_k)),
    maxIncome: Math.max(...Object.values(boroughData).map(d => d.avg_income_k)),
    minUnder30: 0,
    maxUnder30: 100,
    minUnaffiliated: 0,
    maxUnaffiliated: 100
  });

  const allBoroughs = Object.keys(boroughData);

  const handleBoroughToggle = (borough) => {
    if (filteredBoroughs.includes(borough)) {
      setFilteredBoroughs(filteredBoroughs.filter(b => b !== borough));
    } else {
      setFilteredBoroughs([...filteredBoroughs, borough]);
    }
  };

  const handleSelectAll = () => {
    setFilteredBoroughs(allBoroughs);
  };

  const handleDeselectAll = () => {
    setFilteredBoroughs([]);
  };

  const applyFilters = () => {
    const filtered = allBoroughs.filter(borough => {
      const data = boroughData[borough];
      return (
        data.turnout_rate * 100 >= filters.minTurnout &&
        data.turnout_rate * 100 <= filters.maxTurnout &&
        data.avg_income_k >= filters.minIncome &&
        data.avg_income_k <= filters.maxIncome &&
        data.under30_pct * 100 >= filters.minUnder30 &&
        data.under30_pct * 100 <= filters.maxUnder30 &&
        data.unaffiliated_rate * 100 >= filters.minUnaffiliated &&
        data.unaffiliated_rate * 100 <= filters.maxUnaffiliated
      );
    });
    setFilteredBoroughs(filtered);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Borough Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Boroughs</label>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              None
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {allBoroughs.map(borough => (
            <label key={borough} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filteredBoroughs.includes(borough)}
                onChange={() => handleBoroughToggle(borough)}
                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-gray-700">{borough}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turnout Rate: {filters.minTurnout}% - {filters.maxTurnout}%
            </label>
            <div className="flex space-x-2">
              <input
                type="range"
                min="0"
                max="50"
                value={filters.minTurnout}
                onChange={(e) => setFilters({...filters, minTurnout: parseInt(e.target.value)})}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="50"
                value={filters.maxTurnout}
                onChange={(e) => setFilters({...filters, maxTurnout: parseInt(e.target.value)})}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Income Range: ${filters.minIncome}k - ${filters.maxIncome}k
            </label>
            <div className="flex space-x-2">
              <input
                type="range"
                min="40"
                max="120"
                value={filters.minIncome}
                onChange={(e) => setFilters({...filters, minIncome: parseInt(e.target.value)})}
                className="flex-1"
              />
              <input
                type="range"
                min="40"
                max="120"
                value={filters.maxIncome}
                onChange={(e) => setFilters({...filters, maxIncome: parseInt(e.target.value)})}
                className="flex-1"
              />
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}