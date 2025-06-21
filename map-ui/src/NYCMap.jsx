import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ⚠️ BIG custom marker icon
const hugeIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [80, 120],        // HUGE marker
  iconAnchor: [40, 120],      // Anchor so it pins at the tip
  popupAnchor: [0, -110],     // Position the popup above it
});

const testGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Debug Square" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.90, 40.75],
            [-73.87, 40.75],
            [-73.87, 40.73],
            [-73.90, 40.73],
            [-73.90, 40.75]
          ]
        ]
      }
    }
  ]
};

export default function NYCMap() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[40.74, -73.88]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🟩 Green square in Queens */}
        <GeoJSON
          data={testGeoJSON}
          style={{ color: 'lime', weight: 4, fillOpacity: 0.4 }}
        />

        {/* 📍 ENORMOUS marker */}
        <Marker position={[40.74, -73.885]} icon={hugeIcon}>
          <Popup>💥 This is a GIANT marker</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
