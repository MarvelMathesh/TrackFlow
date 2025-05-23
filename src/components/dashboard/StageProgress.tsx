import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { Lead } from '../../types';

type StageProgressProps = {
  leads: Lead[];
  loading: boolean;
};

type StageCount = {
  stage: string;
  count: number;
  color: string;
};

export const StageProgress: React.FC<StageProgressProps> = ({ leads, loading }) => {
  const stageColors = {
    new: '#0c96e6',
    contacted: '#17afac',
    qualified: '#ff7a0a',
    proposal: '#eab308',
    won: '#10b981',
    lost: '#ef4444',
  };
  
  const stageData: StageCount[] = Object.entries(stageColors).map(([stage, color]) => {
    const count = leads.filter(lead => lead.stage === stage).length;
    return { stage, count, color };
  }).filter(item => item.count > 0);
  
  if (loading) {
    return (
      <GlassCard className="h-full">
        <h3 className="text-lg font-display font-semibold mb-4">Lead Pipeline</h3>
        <div className="flex justify-center items-center h-64 animate-pulse">
          <div className="h-48 w-48 rounded-full bg-gray-200"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-display font-semibold mb-4">Lead Pipeline</h3>
      
      {stageData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">No leads data available</p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  dataKey="count"
                  nameKey="stage"
                  label={({ stage }) => stage.charAt(0).toUpperCase() + stage.slice(1)}
                  labelLine={false}
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} leads`, 
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {stageData.map(({ stage, count, color }) => (
              <div key={stage} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="capitalize">{stage}</span>
                <span className="ml-1 text-gray-500">({count})</span>
              </div>
            ))}
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default StageProgress;