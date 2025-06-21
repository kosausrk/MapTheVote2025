import { useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import { boroughData, calculateStrategicWeight, getStrategicColor } from '../data/boroughData';
import { neighborhoodData, getNeighborhoodColor } from '../data/neighborhoodData';

export default function SimpleMap({ 
  selectedBorough, 
  setSelectedBorough, 
  filteredBoroughs, 
  viewMode,
  showNeighborhoods 
}) {
  const [geoData, setGeoData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
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
        
        // Enhance GeoJSON with our data
        const enhancedFeatures = data.features.map(feature => {
          const boroughName = feature.properties.BoroName;
          const boroughInfo = boroughData[boroughName];
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...boroughInfo,
              strategicWeight: calculateStrategicWeight(boroughName),
              strategicColor: getStrategicColor(calculateStrategicWeight(boroughName)),
              isFiltered: filteredBoroughs.includes(boroughName)
            }
          };
        });

        setGeoData({
          ...data,
          features: enhancedFeatures
        });
      })
      .catch(err => {
        console.error('SimpleMap: Error loading GeoJSON:', err);
        setError(err.message);
      });
  }, [filteredBoroughs]);

  // Handle map clicks
  const handleClick = useCallback((event) => {
    const feature = event.features?.[0];
    if (feature) {
      const borough = feature.properties.BoroName;
      setSelectedBorough(selectedBorough === borough ? null : borough);
    }
  }, [selectedBorough, setSelectedBorough]);

  // Handle hover
  const handleHover = useCallback((event) => {
    if (event.features?.[0]) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        feature: event.features[0]
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  // Get fill color based on view mode
  const getFillColor = () => {
    switch (viewMode) {
      case 'strategic':
        return [
          'case',
          ['==', ['get', 'isFiltered'], false], '#e5e5e5',
          ['>=', ['get', 'strategicWeight'], 80], '#2d5016',
          ['>=', ['get', 'strategicWeight'], 60], '#52c41a',
          ['>=', ['get', 'strategicWeight'], 40], '#faad14',
          ['>=', ['get', 'strategicWeight'], 20], '#fa8c16',
          '#f5222d'
        ];
      case 'turnout':
        return [
          'case',
          ['==', ['get', 'isFiltered'], false], '#e5e5e5',
          ['>=', ['*', ['get', 'turnout_rate'], 100], 30], '#1890ff',
          ['>=', ['*', ['get', 'turnout_rate'], 100], 25], '#40a9ff',
          ['>=', ['*', ['get', 'turnout_rate'], 100], 20], '#69c0ff',
          '#91d5ff'
        ];
      case 'demographics':
        return [
          'case',
          ['==', ['get', 'isFiltered'], false], '#e5e5e5',
          ['>=', ['*', ['get', 'under30_pct'], 100], 30], '#722ed1',
          ['>=', ['*', ['get', 'under30_pct'], 100], 28], '#9254de',
          ['>=', ['*', ['get', 'under30_pct'], 100], 26], '#b37feb',
          '#d3adf7'
        ];
      default:
        return '#cccccc';
    }
  };

  // Create neighborhood GeoJSON
  const neighborhoodGeoJSON = showNeighborhoods ? {
    type: 'FeatureCollection',
    features: Object.entries(neighborhoodData)
      .filter(([_, data]) => filteredBoroughs.includes(data.borough))
      .map(([name, data]) => ({
        type: 'Feature',
        properties: {
          name,
          ...data
        },
        geometry: {
          type: 'Point',
          coordinates: data.coordinates
        }
      }))
  } : null;

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
        onClick={handleClick}
        onMouseMove={handleHover}
        interactiveLayerIds={['borough-fill']}
        maxZoom={15}
        minZoom={8}
        maxBounds={[
          [-74.5, 40.4], // Southwest bound
          [-73.4, 40.9]  // Northeast bound
        ]}
      >
        {/* Borough Layer */}
        <Source id="boroughs" type="geojson" data={geoData}>
          <Layer
            id="borough-fill"
            type="fill"
            paint={{
              'fill-color': getFillColor(),
              'fill-opacity': [
                'case',
                ['==', ['get', 'BoroName'], selectedBorough || ''], 0.8,
                0.6
              ]
            }}
          />
          <Layer
            id="borough-outline"
            type="line"
            paint={{
              'line-color': [
                'case',
                ['==', ['get', 'BoroName'], selectedBorough || ''], '#000000',
                '#666666'
              ],
              'line-width': [
                'case',
                ['==', ['get', 'BoroName'], selectedBorough || ''], 3,
                1
              ]
            }}
          />
        </Source>

        {/* Neighborhood Layer */}
        {neighborhoodGeoJSON && (
          <Source id="neighborhoods" type="geojson" data={neighborhoodGeoJSON}>
            <Layer
              id="neighborhood-circles"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['exponential', 1.5],
                  ['zoom'],
                  8, ['/', ['get', 'population'], 10000],
                  14, ['/', ['get', 'population'], 2000]
                ],
                'circle-color': [
                  'case',
                  ['>=', ['get', 'strategic_weight'], 80], '#1f5f1f',
                  ['>=', ['get', 'strategic_weight'], 60], '#4caf50',
                  ['>=', ['get', 'strategic_weight'], 40], '#ff9800',
                  ['>=', ['get', 'strategic_weight'], 20], '#f44336',
                  '#9e9e9e'
                ],
                'circle-opacity': 0.7,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {/* Hover Popup */}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={10}
          >
            <div style={{ padding: '12px', minWidth: '200px' }}>
              <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                {hoverInfo.feature.properties.BoroName}
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                {viewMode === 'strategic' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Strategic Score:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {hoverInfo.feature.properties.strategicWeight}%
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Turnout Rate:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {(hoverInfo.feature.properties.turnout_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Population:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {hoverInfo.feature.properties.population?.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Under 30:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {(hoverInfo.feature.properties.under30_pct * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}