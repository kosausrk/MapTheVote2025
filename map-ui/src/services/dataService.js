// NYC Open Data API Service
const NYC_OPEN_DATA_BASE = 'https://data.cityofnewyork.us/resource';

// Fallback data when APIs are unavailable
const fallbackData = {
  elections: {
    'Bronx': { recent_turnout: 19.1, registered_voters: 892000, primary_turnout: 15.2 },
    'Brooklyn': { recent_turnout: 27.5, registered_voters: 1654000, primary_turnout: 23.1 },
    'Manhattan': { recent_turnout: 33.4, registered_voters: 1241000, primary_turnout: 28.9 },
    'Queens': { recent_turnout: 25.0, registered_voters: 1443000, primary_turnout: 21.7 },
    'Staten Island': { recent_turnout: 22.4, registered_voters: 362000, primary_turnout: 18.8 }
  },
  demographics: {
    'Bronx': { 
      population: 1472654, 
      median_age: 34.2, 
      poverty_rate: 0.287,
      languages: ['Spanish', 'English', 'Arabic'],
      dominant_party: 'Democratic'
    },
    'Brooklyn': { 
      population: 2736074, 
      median_age: 35.8, 
      poverty_rate: 0.189,
      languages: ['English', 'Spanish', 'Chinese'],
      dominant_party: 'Democratic'
    },
    'Manhattan': { 
      population: 1694251, 
      median_age: 36.9, 
      poverty_rate: 0.163,
      languages: ['English', 'Spanish', 'Chinese'],
      dominant_party: 'Democratic'
    },
    'Queens': { 
      population: 2405464, 
      median_age: 38.1, 
      poverty_rate: 0.123,
      languages: ['English', 'Spanish', 'Chinese'],
      dominant_party: 'Democratic'
    },
    'Staten Island': { 
      population: 495747, 
      median_age: 40.7, 
      poverty_rate: 0.108,
      languages: ['English', 'Italian', 'Spanish'],
      dominant_party: 'Republican'
    }
  }
};

class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  async fetchWithFallback(url, fallbackData, cacheKey) {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      console.log(`Attempting to fetch: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the successful response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.warn(`API fetch failed for ${cacheKey}:`, error.message);
      console.log('Using fallback data');
      
      // Cache fallback data with shorter timeout
      this.cache.set(cacheKey, {
        data: fallbackData,
        timestamp: Date.now() - (this.cacheTimeout * 0.8) // Retry sooner for fallback
      });

      return fallbackData;
    }
  }

  async getElectionData() {
    // Use real NYC Open Data endpoints for voter registration
    // Note: Some endpoints may require authentication or have rate limits
    try {
      const data = await this.fetchWithFallback(
        `${NYC_OPEN_DATA_BASE}/8nqg-f7kj.json?$limit=50&$where=borough%20IS%20NOT%20NULL`,
        fallbackData.elections,
        'election_data'
      );
      return this.processElectionData(data);
    } catch (error) {
      console.warn('Election data API unavailable, using fallback data');
      return fallbackData.elections;
    }
  }

  async getDemographicData() {
    // Use NYC Housing and Vacancy Survey or Census data
    try {
      const data = await this.fetchWithFallback(
        `${NYC_OPEN_DATA_BASE}/7s8x-zm5k.json?$limit=50&$where=borough%20IS%20NOT%20NULL`,
        fallbackData.demographics,
        'demographic_data'
      );
      return this.processDemographicData(data);
    } catch (error) {
      console.warn('Demographics API unavailable, using fallback data');
      return fallbackData.demographics;
    }
  }

  processElectionData(apiData) {
    // Process real API data into our expected format
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return fallbackData.elections;
    }
    
    // Transform API response to match our borough structure
    // This would need to be customized based on actual API response format
    return fallbackData.elections; // Return fallback for now
  }

  processDemographicData(apiData) {
    // Process real API data into our expected format
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return fallbackData.demographics;
    }
    
    // Transform API response to match our borough structure
    return fallbackData.demographics; // Return fallback for now
  }

  async getNeighborhoodData() {
    // NYC Planning neighborhood tabulation areas
    try {
      const response = await fetch('/data/neighborhoods.geojson');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Neighborhood data unavailable:', error);
    }
    
    // Return null to indicate unavailable - component should handle gracefully
    return null;
  }

  async getLiveVotingData() {
    // During election periods, this could fetch real-time data
    // For now, simulate with enhanced fallback data
    const baseData = await this.getElectionData();
    
    // Add some simulated "live" variations
    const liveData = Object.entries(baseData).reduce((acc, [borough, data]) => {
      acc[borough] = {
        ...data,
        current_registration_drive: Math.random() > 0.5,
        recent_activity_score: Math.floor(Math.random() * 100),
        polling_stations: this.getPollingStationCount(borough),
        early_voting_sites: this.getEarlyVotingSites(borough),
        last_updated: new Date().toISOString()
      };
      return acc;
    }, {});

    return liveData;
  }

  getPollingStationCount(borough) {
    const counts = {
      'Bronx': 465,
      'Brooklyn': 750,
      'Manhattan': 520,
      'Queens': 680,
      'Staten Island': 145
    };
    return counts[borough] || 0;
  }

  getEarlyVotingSites(borough) {
    const sites = {
      'Bronx': 12,
      'Brooklyn': 23,
      'Manhattan': 18,
      'Queens': 20,
      'Staten Island': 5
    };
    return sites[borough] || 0;
  }

  // Method to check API availability
  async checkAPIStatus() {
    const endpoints = [
      'https://data.cityofnewyork.us/api/views/metadata/v1',
      'https://data.cityofnewyork.us/resource/8nqg-f7kj.json?$limit=1'
    ];

    const status = {};
    
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(endpoint, { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        status[endpoint] = response.ok;
      } catch (error) {
        status[endpoint] = false;
      }
    }

    return status;
  }

  // Clear cache manually
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;