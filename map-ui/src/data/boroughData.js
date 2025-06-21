export const boroughData = {
  'Bronx': {
    turnout_rate: 0.191,
    unaffiliated_rate: 0.21,
    under30_pct: 0.31,
    college_edu_pct: 0.30,
    avg_income_k: 47,
    population: 1472654,
    registered_voters: 892000,
    color: '#ff6b6b'
  },
  'Brooklyn': {
    turnout_rate: 0.275,
    unaffiliated_rate: 0.19,
    under30_pct: 0.29,
    college_edu_pct: 0.45,
    avg_income_k: 75,
    population: 2736074,
    registered_voters: 1654000,
    color: '#4ecdc4'
  },
  'Manhattan': {
    turnout_rate: 0.334,
    unaffiliated_rate: 0.22,
    under30_pct: 0.26,
    college_edu_pct: 0.65,
    avg_income_k: 100,
    population: 1694251,
    registered_voters: 1241000,
    color: '#45b7d1'
  },
  'Queens': {
    turnout_rate: 0.25,
    unaffiliated_rate: 0.20,
    under30_pct: 0.28,
    college_edu_pct: 0.40,
    avg_income_k: 82,
    population: 2405464,
    registered_voters: 1443000,
    color: '#96ceb4'
  },
  'Staten Island': {
    turnout_rate: 0.224,
    unaffiliated_rate: 0.18,
    under30_pct: 0.25,
    college_edu_pct: 0.38,
    avg_income_k: 96,
    population: 495747,
    registered_voters: 362000,
    color: '#ffeaa7'
  }
};

export const calculateStrategicWeight = (borough) => {
  const data = boroughData[borough];
  if (!data) return 0;
  
  const rawWeight = (
    data.unaffiliated_rate * 0.4 +
    data.under30_pct * 0.3 +
    data.college_edu_pct * 0.2 +
    data.turnout_rate * 0.1
  ) * data.avg_income_k;
  
  // Normalize to 0-100 scale
  const minWeight = 8.47; // Minimum possible weight
  const maxWeight = 26.0; // Maximum possible weight
  
  return Math.round(((rawWeight - minWeight) / (maxWeight - minWeight)) * 100);
};

export const getStrategicColor = (weight) => {
  if (weight >= 80) return '#2d5016'; // Dark green
  if (weight >= 60) return '#52c41a'; // Green
  if (weight >= 40) return '#faad14'; // Yellow
  if (weight >= 20) return '#fa8c16'; // Orange
  return '#f5222d'; // Red
};