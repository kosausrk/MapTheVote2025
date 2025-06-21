// src/components/NYCMap.jsx

import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const polygonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.90, 40.75],
          [-73.87, 40.75],
          [-73.87, 40.73],
          [-73.90, 40.73],
          [-73.90, 40.75],
        ]],
      },
    },
  ],
};

export default function NYCMap() {
  return (
    <Map
      initialViewState={{
        latitude: 40.74,
        longitude: -73.885,
        zoom: 13,
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Polygon Layer */}
      <Source id="nyc-poly" type="geojson" data={polygonData}>
        <Layer
          id="nyc-fill"
          type="fill"
          paint={{
            'fill-color': 'lime',
            'fill-opacity': 0.5,
          }}
        />
        <Layer
          id="nyc-border"
          type="line"
          paint={{
            'line-color': 'black',
            'line-width': 2,
          }}
        />
      </Source>

      {/* Huge Marker */}
      <Marker longitude={-73.885} latitude={40.74}>
        <div style={{ fontSize: '3rem' }}>📍</div>
      </Marker>
    </Map>
  );
}
