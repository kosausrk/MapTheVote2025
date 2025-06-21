import { useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import { boroughData, calculateStrategicWeight, getStrategicColor } from '../data/boroughData';
import NeighborhoodLayer from './NeighborhoodLayer';

export default function NYCMap({ 
  selectedBorough, 
  setSelectedBorough, 
  filteredBoroughs, 
  viewMode,
  showNeighborhoods
}) {
  const [geoData, setGeoData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapStyle, setMapStyle] = useState('osm');

  useEffect(() => {
    console.log('Loading GeoJSON data...');
    fetch('/data/nyc_boroughs.geojson')
      .then(res => {
        console.log('GeoJSON response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('GeoJSON data loaded:', data);
        // Enhance GeoJSON with our data
        const enhancedFeatures = data.features.map(feature => {
          const boroughName = feature.properties.BoroName;
          const boroughInfo = boroughData[boroughName];
          
          if (!boroughInfo) {
            console.warn(`No data found for borough: ${boroughName}`);
          }
          
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

        const enhancedGeoData = {
          ...data,
          features: enhancedFeatures
        };
        
        console.log('Enhanced GeoJSON:', enhancedGeoData);
        setGeoData(enhancedGeoData);
      })
      .catch(err => {
        console.error('Failed to load GeoJSON:', err);
        // Set a minimal fallback to prevent complete failure
        setGeoData(null);
      });
  }, [filteredBoroughs]);

  const getColorExpression = useCallback(() => {
    if (!geoData) return '#cccccc';

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
  }, [viewMode, geoData]);

  const handleClick = useCallback((event) => {
    const feature = event.features?.[0];
    if (feature) {
      const borough = feature.properties.BoroName;
      setSelectedBorough(selectedBorough === borough ? null : borough);
    }
  }, [selectedBorough, setSelectedBorough]);

  const handleHover = useCallback((event) => {
    if (event.features?.[0]) {
      // Only update if it's a different feature to prevent flickering
      const newFeature = event.features[0];
      if (!hoverInfo || hoverInfo.feature.properties.BoroName !== newFeature.properties.BoroName) {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          feature: newFeature
        });
      }
    } else {
      setHoverInfo(null);
    }
  }, [hoverInfo]);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const mapStyles = {
    osm: {
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
    },
    satellite: {
      version: 8,
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '© Esri'
        }
      },
      layers: [{
        id: 'satellite-tiles',
        type: 'raster',
        source: 'satellite-tiles',
        minzoom: 0,
        maxzoom: 22
      }]
    }
  };

  console.log('NYCMap render - geoData:', geoData ? 'loaded' : 'null');

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {!geoData && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Map Style Selector */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
        <div className="flex space-x-1">
          {Object.keys(mapStyles).map((key) => (
            <button
              key={key}
              onClick={() => setMapStyle(key)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                mapStyle === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          {viewMode === 'strategic' && 'Strategic Opportunity'}
          {viewMode === 'turnout' && 'Voter Turnout Rate'}
          {viewMode === 'demographics' && 'Under 30 Population'}
        </h4>
        <div className="space-y-1 text-xs">
          {viewMode === 'strategic' && (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#2d5016] rounded mr-2"></div>
                <span>80-100% (Highest Opportunity)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#52c41a] rounded mr-2"></div>
                <span>60-79% (High Opportunity)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#faad14] rounded mr-2"></div>
                <span>40-59% (Medium Opportunity)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#fa8c16] rounded mr-2"></div>
                <span>20-39% (Low Opportunity)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#f5222d] rounded mr-2"></div>
                <span>0-19% (Lowest Opportunity)</span>
              </div>
            </>
          )}
          
          {viewMode === 'turnout' && (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#1890ff] rounded mr-2"></div>
                <span>30%+ (High Turnout)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#40a9ff] rounded mr-2"></div>
                <span>25-29% (Medium-High)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#69c0ff] rounded mr-2"></div>
                <span>20-24% (Medium)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#91d5ff] rounded mr-2"></div>
                <span>Below 20% (Low)</span>
              </div>
            </>
          )}

          {viewMode === 'demographics' && (
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#722ed1] rounded mr-2"></div>
                <span>30%+ (Youngest)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#9254de] rounded mr-2"></div>
                <span>28-29% (Young)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#b37feb] rounded mr-2"></div>
                <span>26-27% (Moderate)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#d3adf7] rounded mr-2"></div>
                <span>Below 26% (Older)</span>
              </div>
            </>
          )}
        </div>
      </div>

      <Map
        initialViewState={{
          latitude: 40.73,
          longitude: -73.93,
          zoom: 10,
          pitch: 0,
          bearing: 0
        }}
        mapStyle={mapStyles[mapStyle]}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onClick={handleClick}
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={['borough-fill']}
        cursor="pointer"
        maxZoom={15}
        minZoom={8}
        maxBounds={[
          [-74.5, 40.4], // Southwest bound
          [-73.4, 40.9]  // Northeast bound
        ]}
        doubleClickZoom={true}
        dragRotate={false}
        pitchWithRotate={false}
        touchZoomRotate={false}
      >
        {geoData && (
          <Source id="boroughs" type="geojson" data={geoData}>
            <Layer
              id="borough-fill"
              type="fill"
              paint={{
                'fill-color': getColorExpression(),
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
        )}

        {/* Neighborhood Layer */}
        <NeighborhoodLayer
          visible={showNeighborhoods}
          selectedBorough={selectedBorough}
          filteredBoroughs={filteredBoroughs}
          onNeighborhoodClick={(neighborhood) => {
            console.log('Neighborhood clicked:', neighborhood);
          }}
        />

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
                {viewMode === 'strategic' && (
                  <div className="flex justify-between">
                    <span>Strategic Score:</span>
                    <span className="font-medium">
                      {hoverInfo.feature.properties.strategicWeight}%
                    </span>
                  </div>
                )}
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
                <div className="flex justify-between">
                  <span>Under 30:</span>
                  <span className="font-medium">
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