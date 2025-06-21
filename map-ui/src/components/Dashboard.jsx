import { useState } from 'react';
import SimpleMap from './SimpleMap';
import { boroughData } from '../data/boroughData';

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
      </div>

      {/* RIGHT MAP */}
      <div style={{ flex: 1, height: '100vh' }}>
        <SimpleMap />
      </div>
    </div>
  );
}