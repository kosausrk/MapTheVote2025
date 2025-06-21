import { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';

export default function SimpleMap() {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('SimpleMap: Loading GeoJSON...');
    fetch('/data/nyc_boroughs.geojson')
      .then(res => {
        console.log('SimpleMap: Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('SimpleMap: GeoJSON loaded successfully:', data);
        console.log('SimpleMap: Number of features:', data.features?.length);
        console.log('SimpleMap: First feature properties:', data.features?.[0]?.properties);
        setGeoData(data);
      })
      .catch(err => {
        console.error('SimpleMap: Error loading GeoJSON:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const handleMapLoad = () => {
    console.log('SimpleMap: Map loaded successfully');
  };

  const handleMapError = (error) => {
    console.error('SimpleMap: Map error:', error);
  };

  return (
    <div className="w-full h-full" style={{ width: '100vw', height: '100vh' }}>
      <Map
        initialViewState={{
          latitude: 40.73,
          longitude: -73.93,
          zoom: 10,
        }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        }}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleMapLoad}
        onError={handleMapError}
      >
        <Source id="boroughs" type="geojson" data={geoData}>
          <Layer
            id="borough-fill"
            type="fill"
            paint={{
              'fill-color': '#ff6b6b',
              'fill-opacity': 0.6,
            }}
          />
          <Layer
            id="borough-outline"
            type="line"
            paint={{
              'line-color': '#000000',
              'line-width': 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}