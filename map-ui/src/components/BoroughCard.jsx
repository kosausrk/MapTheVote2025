import { boroughData, calculateStrategicWeight, getStrategicColor } from '../data/boroughData';

export default function BoroughCard({ borough, detailed = false, isSelected = false }) {
  const data = boroughData[borough];
  const strategicWeight = calculateStrategicWeight(borough);
  const strategicColor = getStrategicColor(strategicWeight);

  if (detailed) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{borough}</h3>
          <div 
            className="px-3 py-1 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: strategicColor }}
          >
            {strategicWeight}% Strategic
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Population</p>
            <p className="font-semibold">{data.population.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Registered Voters</p>
            <p className="font-semibold">{data.registered_voters.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Turnout Rate</p>
            <p className="font-semibold">{(data.turnout_rate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600">Under 30</p>
            <p className="font-semibold">{(data.under30_pct * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600">Unaffiliated</p>
            <p className="font-semibold">{(data.unaffiliated_rate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600">College Educated</p>
            <p className="font-semibold">{(data.college_edu_pct * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avg Income</span>
            <span className="font-semibold">${data.avg_income_k}k</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{borough}</h4>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: strategicColor }}
          title={`${strategicWeight}% Strategic Weight`}
        />
      </div>
      
      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Turnout:</span>
          <span>{(data.turnout_rate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Strategic Score:</span>
          <span className="font-medium">{strategicWeight}%</span>
        </div>
      </div>
    </div>
  );
}