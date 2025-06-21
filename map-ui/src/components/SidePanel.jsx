import { useState } from 'react';
import { boroughData, calculateStrategicWeight, getStrategicColor } from '../data/boroughData';
import BoroughCard from './BoroughCard';
import FilterControls from './FilterControls';
import MetricsOverview from './MetricsOverview';

export default function SidePanel({ 
  selectedBorough, 
  filteredBoroughs, 
  setFilteredBoroughs, 
  viewMode, 
  setViewMode,
  showNeighborhoods,
  setShowNeighborhoods
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl flex flex-col items-center py-6">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 hover:bg-blue-700 rounded-xl transition-all duration-200 text-white"
          title="Expand Panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-blue-700/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">MapTheVote NYC</h1>
            <p className="text-blue-200 text-sm mt-1">Strategic Voter Engagement 2025</p>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-blue-700 rounded-xl transition-all duration-200 text-blue-200 hover:text-white"
            title="Collapse Panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        {/* View Mode Selector */}
        <div className="mb-6">
          <label className="block text-blue-200 text-sm font-medium mb-3">Analysis Mode</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'strategic', label: 'Strategic Opportunity', icon: '🎯' },
              { key: 'turnout', label: 'Voter Turnout', icon: '📊' },
              { key: 'demographics', label: 'Demographics', icon: '👥' }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  viewMode === mode.key
                    ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                    : 'bg-blue-800/50 text-blue-100 hover:bg-blue-700/70 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{mode.icon}</span>
                  <span className="font-medium">{mode.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood Toggle */}
        <div className="flex items-center justify-between p-4 bg-blue-800/30 rounded-xl">
          <div>
            <label className="text-sm font-medium text-white block">
              🏘️ Show Neighborhoods
            </label>
            <p className="text-xs text-blue-200">Toggle detailed neighborhood view</p>
          </div>
          <button
            onClick={() => setShowNeighborhoods(!showNeighborhoods)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
              showNeighborhoods ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                showNeighborhoods ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filter Controls */}
        <div className="border-b border-blue-700/30">
          <FilterControls 
            filteredBoroughs={filteredBoroughs}
            setFilteredBoroughs={setFilteredBoroughs}
          />
        </div>

        {/* Metrics Overview */}
        <div className="border-b border-blue-700/30">
          <MetricsOverview viewMode={viewMode} />
        </div>

        {/* Selected Borough Details */}
        {selectedBorough && (
          <div className="p-4 bg-blue-700/20 border-b border-blue-700/30">
            <BoroughCard borough={selectedBorough} detailed={true} />
          </div>
        )}

        {/* Borough List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🗽</span>
            Borough Overview
          </h3>
          <div className="space-y-3">
            {Object.keys(boroughData)
              .filter(borough => filteredBoroughs.includes(borough))
              .sort((a, b) => calculateStrategicWeight(b) - calculateStrategicWeight(a))
              .map(borough => (
                <BoroughCard 
                  key={borough} 
                  borough={borough} 
                  isSelected={selectedBorough === borough}
                />
              ))
            }
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700/30 bg-blue-900/50">
        <div className="text-xs text-blue-200 text-center">
          <p>📊 Data: NYC Board of Elections, Furman Center</p>
          <p className="mt-1">🗳️ Supporting <a href="https://www.zohranfornyc.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white underline">Zohran4NYC</a></p>
        </div>
      </div>
    </div>
  );
}