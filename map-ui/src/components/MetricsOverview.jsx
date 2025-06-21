import { boroughData, calculateStrategicWeight } from '../data/boroughData';

export default function MetricsOverview({ viewMode }) {
  const totalPopulation = Object.values(boroughData).reduce((sum, data) => sum + data.population, 0);
  const totalVoters = Object.values(boroughData).reduce((sum, data) => sum + data.registered_voters, 0);
  const avgTurnout = Object.values(boroughData).reduce((sum, data) => sum + data.turnout_rate, 0) / 5;
  const avgStrategicWeight = Object.keys(boroughData).reduce((sum, borough) => sum + calculateStrategicWeight(borough), 0) / 5;

  const metrics = {
    strategic: [
      { label: 'Avg Strategic Score', value: `${avgStrategicWeight.toFixed(1)}%`, color: 'text-green-600' },
      { label: 'Top Opportunity', value: 'Manhattan', color: 'text-blue-600' },
      { label: 'Total Voters', value: totalVoters.toLocaleString(), color: 'text-purple-600' }
    ],
    turnout: [
      { label: 'Avg Turnout', value: `${(avgTurnout * 100).toFixed(1)}%`, color: 'text-red-600' },
      { label: 'Highest Turnout', value: 'Manhattan (33.4%)', color: 'text-green-600' },
      { label: 'Lowest Turnout', value: 'Bronx (19.1%)', color: 'text-yellow-600' }
    ],
    demographics: [
      { label: 'Total Population', value: totalPopulation.toLocaleString(), color: 'text-indigo-600' },
      { label: 'Voter Registration', value: `${((totalVoters / totalPopulation) * 100).toFixed(1)}%`, color: 'text-pink-600' },
      { label: 'Engagement Potential', value: 'High', color: 'text-green-600' }
    ]
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {metrics[viewMode].map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      {viewMode === 'strategic' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Strategic Index Formula</h4>
          <p className="text-xs text-blue-700">
            40% Unaffiliated + 30% Under-30 + 20% College Ed + 10% Turnout × Income Factor
          </p>
        </div>
      )}
    </div>
  );
}