export default function LiveDataPanel({ liveData, apiStatus, dataLoading, onRefresh }) {
  if (!liveData && !dataLoading) return null;

  const getStatusColor = (isOnline) => isOnline ? 'text-green-600' : 'text-red-600';
  const getStatusIcon = (isOnline) => isOnline ? '●' : '●';

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Live Data Status</h3>
        <button
          onClick={onRefresh}
          disabled={dataLoading}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 text-sm"
        >
          {dataLoading ? '↻' : '⟳'}
        </button>
      </div>

      {dataLoading ? (
        <div className="flex items-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Loading data...
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>NYC Open Data API</span>
            <span className={getStatusColor(apiStatus['https://data.cityofnewyork.us/api/views/metadata/v1'])}>
              {getStatusIcon(apiStatus['https://data.cityofnewyork.us/api/views/metadata/v1'])}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Election Data</span>
            <span className="text-yellow-600">● Fallback</span>
          </div>

          {liveData && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-gray-600">
                Last updated: {new Date(liveData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}