// #TO DO 
// # 🌍 Setup: Initial React + Leaflet map scaffolding
// #
// # - Added Leaflet with react-leaflet
// # - Set up NYCMap.jsx component with basic TileLayer and GeoJSON
// # - Moved nyc_boroughs.geojson into public/data/
// # - Confirmed GeoJSON loads in console ✅ but map still not displaying
// # - FitBounds logic added to auto-center GeoJSON (no visible result yet)
// # - Skipped marker icon fix for now due to Vite/Leaflet icon issue
// #
// # 🔧 Next steps:
// # - Double check Leaflet container height / layout
// # - Test static basemap only (TileLayer only, no GeoJSON)
// # - Optionally migrate to Mapbox or react-map-gl for smoother setup
// #
// # Commit preserves current Leaflet debug state before switching approaches.


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function NYCMap() {
  return (
    <div className="h-screen w-screen">
      <MapContainer
  center={[40.7128, -74.0060]}
  zoom={11}
  className="h-full w-full"
>
  <TileLayer
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
</MapContainer>

    </div>
  );
}
