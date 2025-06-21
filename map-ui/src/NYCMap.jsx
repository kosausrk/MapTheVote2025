// #TO DO 
// # 🌍 Setup: Initial React + Leaflet map scaffolding
//
// # ✅ Added Leaflet with react-leaflet
// # ✅ Set up NYCMap.jsx component with basic TileLayer and GeoJSON
// # ✅ Moved nyc_boroughs.geojson into public/data/
// # ✅ Confirmed GeoJSON loads in console
// # ✅ FitBounds logic added to auto-center GeoJSON
// # 🟡 Skipped marker icon fix (Vite/Leaflet issue)
//
// # 🧪 Tested: Basemap loads, GeoJSON renders correctly
//
// # ✅ Commit preserves working Leaflet + GeoJSON view

import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


import { Polygon } from 'react-leaflet';

const testPolygon = [
  [40.75, -73.90], // Queens-ish
  [40.74, -73.87],
  [40.73, -73.90],
  [40.74, -73.93],
];

<Polygon positions={testPolygon} pathOptions={{ color: 'red', fillOpacity: 0.3 }} />

// 🛠 Fix for marker icons in Vite/Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [40, 65], // 👈 Larger marker size
  iconAnchor: [20, 65], // 👈 So it pins correctly
});


const [showGeoJSON, setShowGeoJSON] = useState(true);

<input
  type="checkbox"
  checked={showGeoJSON}
  onChange={() => setShowGeoJSON(!showGeoJSON)}
  style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
/> Show Borough Boundaries


function FitBounds({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const allCoords = [];

    data.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;

      if (feature.geometry.type === 'MultiPolygon') {
        coords.forEach(polygon =>
          polygon.forEach(ring =>
            ring.forEach(coord => allCoords.push([coord[1], coord[0]])) // [lat, lng]
          )
        );
      } else if (feature.geometry.type === 'Polygon') {
        coords.forEach(ring =>
          ring.forEach(coord => allCoords.push([coord[1], coord[0]]))
        );
      }
    });

    if (allCoords.length > 0) {
      map.fitBounds(allCoords);
    }
  }, [data, map]);

  return null;
}

export default function NYCMap() {
  const [boroughs, setBoroughs] = useState(null);

  useEffect(() => {
    fetch('/data/nyc_boroughs.geojson')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ GeoJSON loaded:', data);
        setBoroughs(data);
      });
  }, []);

  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={11}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🗺️ Big marker in Queens (e.g., Jackson Heights) */}
        <Marker position={[40.75, -73.88]}>
          <Popup>
            📍 Big Marker in Queens<br />Just to confirm things render fine!
          </Popup>
        </Marker>

        {boroughs && (
          <>
            <GeoJSON
              data={boroughs}
              style={{ color: 'blue', weight: 2, fillOpacity: 0.2 }}
            />
            <FitBounds data={boroughs} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
