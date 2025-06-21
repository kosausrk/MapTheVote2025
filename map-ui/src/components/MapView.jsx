import { useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import { boroughData, calculateStrategicWeight, getStrategicColor } from '../data/boroughData';

export default function MapView({ 
  selectedBorough, 
  setSelectedBorough, 
  filteredBoroughs, 
  viewMode,
  showNeighborhoods
}) {
  const [geoData, setGeoData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Load GeoJSON data
  useEffect(() => {
    fetch('/data/nyc_boroughs.geojson')
      .then(res => res.json())
      .then(data => {
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
      .catch(err => console.error('Failed to load GeoJSON:', err));
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
      default:
        return [
          'case',
          ['==', ['get', 'isFiltered'], false], '#e5e5e5',
          ['>=', ['*', ['get', 'under30_pct'], 100], 30], '#722ed1',
          ['>=', ['*', ['get', 'under30_pct'], 100], 28], '#9254de',
          ['>=', ['*', ['get', 'under30_pct'], 100], 26], '#b37feb',
          '#d3adf7'
        ];
    }
  };

  if (!geoData) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <Map
        initialViewState={{
          latitude: 40.73,
          longitude: -73.93,
          zoom: 10
        }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [{
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }]
        }}
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
        onMouseMove={handleHover}
        interactiveLayerIds={['borough-fill']}
        maxZoom={15}
        minZoom={8}
        maxBounds={[
          [-74.5, 40.4],
          [-73.4, 40.9]
        ]}
      >
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

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={10}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-2">
                {hoverInfo.feature.properties.BoroName}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Strategic Score:</span>
                  <span className="font-medium">
                    {hoverInfo.feature.properties.strategicWeight}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Turnout Rate:</span>
                  <span className="font-medium">
                    {(hoverInfo.feature.properties.turnout_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Population:</span>
                  <span className="font-medium">
                    {hoverInfo.feature.properties.population?.toLocaleString()}
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