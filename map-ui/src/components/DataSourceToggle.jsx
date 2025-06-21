import { useState } from 'react';

export default function DataSourceToggle({ useApiData, setUseApiData, apiStatus }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-20 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Data Source</h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {useApiData ? 'Live API' : 'Fallback Data'}
        </span>
        <button
          onClick={() => setUseApiData(!useApiData)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            useApiData ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          title={useApiData ? 'Switch to fallback data' : 'Switch to live API data'}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              useApiData ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">NYC Open Data</span>
              <span className={`${
                Object.values(apiStatus).some(status => status) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {Object.values(apiStatus).some(status => status) ? '●' : '●'}
              </span>
            </div>
            
            <div className="text-gray-500">
              <p className="mb-1">
                <strong>Live API:</strong> Real-time data from NYC Open Data Portal
              </p>
              <p>
                <strong>Fallback:</strong> Curated static data from 2021-2024 trends
              </p>
            </div>

            {!Object.values(apiStatus).some(status => status) && (
              <div className="p-2 bg-yellow-50 rounded text-yellow-800 text-xs">
                <p>⚠️ API temporarily unavailable. Using high-quality fallback data.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}