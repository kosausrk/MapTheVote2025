import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default App;


// import NYCMap from './NYCMap';

// function App() {
//   return <NYCMap />;
// }

// export default App;
