import { useState } from 'react';
import SimpleMap from './SimpleMap';
import { boroughData, calculateStrategicWeight } from '../data/boroughData';

export default function Dashboard() {
  const [selectedBorough, setSelectedBorough] = useState(null);
  const [filteredBoroughs, setFilteredBoroughs] = useState(Object.keys(boroughData));
  const [viewMode, setViewMode] = useState('strategic');
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);

  const handleBoroughToggle = (borough) => {
    if (filteredBoroughs.includes(borough)) {
      setFilteredBoroughs(filteredBoroughs.filter(b => b !== borough));
    } else {
      setFilteredBoroughs([...filteredBoroughs, borough]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* LEFT SIDEBAR */}
      <div style={{ 
        width: '400px', 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '20px',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          MapTheVote NYC
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>View Mode</h3>
          {['strategic', 'turnout', 'demographics'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: '100%',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: viewMode === mode ? '#3b82f6' : '#475569',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Boroughs</h3>
          {Object.keys(boroughData).map(borough => (
            <label key={borough} style={{ display: 'block', margin: '10px 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filteredBoroughs.includes(borough)}
                onChange={() => handleBoroughToggle(borough)}
                style={{ marginRight: '10px' }}
              />
              {borough}
            </label>
          ))}
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showNeighborhoods}
              onChange={(e) => setShowNeighborhoods(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            Show Neighborhoods
          </label>
        </div>

        {/* Selected Borough Details */}
        {selectedBorough && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#475569', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
              {selectedBorough}
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Population:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {boroughData[selectedBorough].population.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Registered Voters:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {boroughData[selectedBorough].registered_voters.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Turnout Rate:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {(boroughData[selectedBorough].turnout_rate * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Strategic Score:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {calculateStrategicWeight(selectedBorough)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Under 30:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {(boroughData[selectedBorough].under30_pct * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>College Educated:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {(boroughData[selectedBorough].college_edu_pct * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Avg Income:</span>
                <span style={{ fontWeight: 'bold' }}>
                  ${boroughData[selectedBorough].avg_income_k}k
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAP */}
      <div style={{ flex: 1, height: '100vh' }}>
        <SimpleMap 
          selectedBorough={selectedBorough}
          setSelectedBorough={setSelectedBorough}
          filteredBoroughs={filteredBoroughs}
          viewMode={viewMode}
          showNeighborhoods={showNeighborhoods}
        />
      </div>
    </div>
  );
}