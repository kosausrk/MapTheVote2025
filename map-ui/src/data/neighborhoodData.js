// Sample neighborhood data for NYC
// In production, this would come from actual NYC Planning NTA shapefiles
export const neighborhoodData = {
  // Manhattan neighborhoods
  'Upper East Side': {
    borough: 'Manhattan',
    population: 220000,
    turnout_rate: 0.385,
    strategic_weight: 72,
    avg_age: 39.2,
    median_income: 85000,
    college_rate: 0.75,
    unaffiliated_rate: 0.23,
    coordinates: [-73.9542, 40.7736]
  },
  'Greenwich Village': {
    borough: 'Manhattan',
    population: 23000,
    turnout_rate: 0.421,
    strategic_weight: 89,
    avg_age: 35.8,
    median_income: 95000,
    college_rate: 0.82,
    unaffiliated_rate: 0.28,
    coordinates: [-74.0034, 40.7336]
  },
  'Harlem': {
    borough: 'Manhattan',
    population: 233000,
    turnout_rate: 0.298,
    strategic_weight: 65,
    avg_age: 33.4,
    median_income: 45000,
    college_rate: 0.42,
    unaffiliated_rate: 0.19,
    coordinates: [-73.9441, 40.8116]
  },
  'Lower East Side': {
    borough: 'Manhattan',
    population: 165000,
    turnout_rate: 0.356,
    strategic_weight: 78,
    avg_age: 32.1,
    median_income: 72000,
    college_rate: 0.68,
    unaffiliated_rate: 0.31,
    coordinates: [-73.9857, 40.7156]
  },

  // Brooklyn neighborhoods
  'Williamsburg': {
    borough: 'Brooklyn',
    population: 153000,
    turnout_rate: 0.289,
    strategic_weight: 83,
    avg_age: 31.5,
    median_income: 78000,
    college_rate: 0.71,
    unaffiliated_rate: 0.35,
    coordinates: [-73.9442, 40.7081]
  },
  'Park Slope': {
    borough: 'Brooklyn',
    population: 65000,
    turnout_rate: 0.456,
    strategic_weight: 91,
    avg_age: 38.7,
    median_income: 110000,
    college_rate: 0.89,
    unaffiliated_rate: 0.24,
    coordinates: [-73.9709, 40.6736]
  },
  'Bedford-Stuyvesant': {
    borough: 'Brooklyn',
    population: 230000,
    turnout_rate: 0.234,
    strategic_weight: 58,
    avg_age: 34.2,
    median_income: 52000,
    college_rate: 0.38,
    unaffiliated_rate: 0.17,
    coordinates: [-73.9442, 40.6892]
  },
  'Crown Heights': {
    borough: 'Brooklyn',
    population: 160000,
    turnout_rate: 0.267,
    strategic_weight: 62,
    avg_age: 33.8,
    median_income: 58000,
    college_rate: 0.41,
    unaffiliated_rate: 0.21,
    coordinates: [-73.9442, 40.6678]
  },

  // Queens neighborhoods
  'Astoria': {
    borough: 'Queens',
    population: 95000,
    turnout_rate: 0.298,
    strategic_weight: 75,
    avg_age: 34.1,
    median_income: 68000,
    college_rate: 0.58,
    unaffiliated_rate: 0.29,
    coordinates: [-73.9196, 40.7648]
  },
  'Long Island City': {
    borough: 'Queens',
    population: 75000,
    turnout_rate: 0.312,
    strategic_weight: 81,
    avg_age: 32.6,
    median_income: 89000,
    college_rate: 0.72,
    unaffiliated_rate: 0.33,
    coordinates: [-73.9442, 40.7505]
  },
  'Flushing': {
    borough: 'Queens',
    population: 180000,
    turnout_rate: 0.221,
    strategic_weight: 54,
    avg_age: 41.3,
    median_income: 62000,
    college_rate: 0.45,
    unaffiliated_rate: 0.16,
    coordinates: [-73.8303, 40.7648]
  },
  'Jackson Heights': {
    borough: 'Queens',
    population: 110000,
    turnout_rate: 0.198,
    strategic_weight: 48,
    avg_age: 38.9,
    median_income: 48000,
    college_rate: 0.34,
    unaffiliated_rate: 0.13,
    coordinates: [-73.8830, 40.7505]
  },

  // Bronx neighborhoods
  'South Bronx': {
    borough: 'Bronx',
    population: 340000,
    turnout_rate: 0.176,
    strategic_weight: 41,
    avg_age: 32.1,
    median_income: 35000,
    college_rate: 0.22,
    unaffiliated_rate: 0.18,
    coordinates: [-73.9196, 40.8176]
  },
  'Riverdale': {
    borough: 'Bronx',
    population: 48000,
    turnout_rate: 0.334,
    strategic_weight: 69,
    avg_age: 42.8,
    median_income: 89000,
    college_rate: 0.67,
    unaffiliated_rate: 0.25,
    coordinates: [-73.9065, 40.8958]
  },
  'Fordham': {
    borough: 'Bronx',
    population: 58000,
    turnout_rate: 0.203,
    strategic_weight: 47,
    avg_age: 33.7,
    median_income: 42000,
    college_rate: 0.31,
    unaffiliated_rate: 0.19,
    coordinates: [-73.8983, 40.8621]
  },

  // Staten Island neighborhoods
  'St. George': {
    borough: 'Staten Island',
    population: 13000,
    turnout_rate: 0.289,
    strategic_weight: 58,
    avg_age: 36.4,
    median_income: 72000,
    college_rate: 0.52,
    unaffiliated_rate: 0.22,
    coordinates: [-74.0776, 40.6436]
  },
  'Stapleton': {
    borough: 'Staten Island',
    population: 32000,
    turnout_rate: 0.198,
    strategic_weight: 44,
    avg_age: 38.1,
    median_income: 58000,
    college_rate: 0.38,
    unaffiliated_rate: 0.17,
    coordinates: [-74.0776, 40.6276]
  }
};

export const getNeighborhoodsByBorough = (borough) => {
  return Object.entries(neighborhoodData)
    .filter(([_, data]) => data.borough === borough)
    .map(([name, data]) => ({ name, ...data }));
};

export const getTopNeighborhoods = (count = 10, metric = 'strategic_weight') => {
  return Object.entries(neighborhoodData)
    .sort(([, a], [, b]) => b[metric] - a[metric])
    .slice(0, count)
    .map(([name, data]) => ({ name, ...data }));
};

export const getNeighborhoodColor = (weight) => {
  if (weight >= 80) return '#1f5f1f'; // Dark green
  if (weight >= 60) return '#4caf50'; // Green  
  if (weight >= 40) return '#ff9800'; // Orange
  if (weight >= 20) return '#f44336'; // Red
  return '#9e9e9e'; // Gray
};