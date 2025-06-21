import { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function NYCMap() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/data/nyc_boroughs.geojson')
     // ✅ load from public
      .then(res => res.json())
      .then(data => {
        console.log('✅ Loaded GeoJSON', data);
        setGeoData(data);
      })
      .catch(err => console.error('❌ Failed to load GeoJSON:', err));
  }, []);

  return (
    <Map
      initialViewState={{
        latitude: 40.73,
        longitude: -73.93,
        zoom: 10,
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      style={{ width: '100vw', height: '100vh' }}
    >
      {geoData && (
        <Source id="boroughs" type="geojson" data={geoData}>
          <Layer
            id="borough-fill"
            type="fill"
            paint={{
              'fill-color': '#ff0000',
              'fill-opacity': 0.3,
            }}
          />
          <Layer
            id="borough-outline"
            type="line"
            paint={{
              'line-color': '#000',
              'line-width': 2,
            }}
          />
        </Source>
      )}
    </Map>
  );
}
