import { boroughData, calculateStrategicWeight } from '../data/boroughData';

export default function Sidebar({ 
  selectedBorough, 
  filteredBoroughs, 
  setFilteredBoroughs, 
  viewMode, 
  setViewMode,
  showNeighborhoods,
  setShowNeighborhoods
}) {
  const allBoroughs = Object.keys(boroughData);

  const handleBoroughToggle = (borough) => {
    if (filteredBoroughs.includes(borough)) {
      setFilteredBoroughs(filteredBoroughs.filter(b => b !== borough));
    } else {
      setFilteredBoroughs([...filteredBoroughs, borough]);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">MapTheVote NYC</h1>
        <p className="text-slate-300 text-sm">Strategic Voter Engagement 2025</p>
      </div>

      {/* View Mode */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Analysis Mode</h3>
        <div className="space-y-2">
          {[
            { key: 'strategic', label: 'Strategic Opportunity' },
            { key: 'turnout', label: 'Voter Turnout' },
            { key: 'demographics', label: 'Demographics' }
          ].map(mode => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood Toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
          <span className="font-medium">Show Neighborhoods</span>
          <input
            type="checkbox"
            checked={showNeighborhoods}
            onChange={(e) => setShowNeighborhoods(e.target.checked)}
            className="w-5 h-5"
          />
        </label>
      </div>

      {/* Borough Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Borough Filters</h3>
        <div className="space-y-2">
          {allBoroughs.map(borough => (
            <label 
              key={borough}
              className="flex items-center justify-between p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
            >
              <span className="font-medium">{borough}</span>
              <input
                type="checkbox"
                checked={filteredBoroughs.includes(borough)}
                onChange={() => handleBoroughToggle(borough)}
                className="w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Selected Borough Info */}
      {selectedBorough && (
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{selectedBorough}</h3>
          <div className="space-y-1 text-sm">
            <p>Population: {boroughData[selectedBorough].population.toLocaleString()}</p>
            <p>Turnout: {(boroughData[selectedBorough].turnout_rate * 100).toFixed(1)}%</p>
            <p>Strategic Score: {calculateStrategicWeight(selectedBorough)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}