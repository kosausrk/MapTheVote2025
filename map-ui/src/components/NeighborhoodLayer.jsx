import { Source, Layer } from 'react-map-gl/maplibre';
import { neighborhoodData, getNeighborhoodColor } from '../data/neighborhoodData';

export default function NeighborhoodLayer({ 
  visible, 
  selectedBorough, 
  filteredBoroughs,
  onNeighborhoodClick 
}) {
  if (!visible) return null;

  // Create GeoJSON from neighborhood data
  const neighborhoodGeoJSON = {
    type: 'FeatureCollection',
    features: Object.entries(neighborhoodData)
      .filter(([_, data]) => !selectedBorough || data.borough === selectedBorough)
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
  };

  return (
    <Source id="neighborhoods" type="geojson" data={neighborhoodGeoJSON}>
      {/* Neighborhood circles */}
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
      
      {/* Neighborhood labels */}
      <Layer
        id="neighborhood-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 8,
            14, 12
          ],
          'text-anchor': 'center',
          'text-offset': [0, 2],
          'text-optional': true
        }}
        paint={{
          'text-color': '#333333',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }}
        minzoom={11}
      />
    </Source>
  );
}