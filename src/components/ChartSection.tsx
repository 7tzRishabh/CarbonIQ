import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ChartSectionProps {
  data: any[];
}

const ChartSection = ({ data }: ChartSectionProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}} 
        />
        <Tooltip 
          contentStyle={{
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
            fontWeight: 600
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="emissions" 
          stroke="#059669" 
          strokeWidth={4} 
          dot={{r: 5, fill: '#059669', strokeWidth: 2, stroke: '#fff'}} 
          activeDot={{r: 8}} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartSection;
