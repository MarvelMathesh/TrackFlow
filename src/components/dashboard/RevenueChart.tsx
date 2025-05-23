import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import GlassCard from '../ui/GlassCard';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/format';

type RevenueChartProps = {
  orders: Order[];
  loading: boolean;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ orders, loading }) => {
  const getMonthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map(month => ({ month, revenue: 0 }));
    
    orders.forEach(order => {
      const orderDate = order.createdAt.toDate();
      if (orderDate.getFullYear() === currentYear) {
        const monthIndex = orderDate.getMonth();
        monthlyData[monthIndex].revenue += order.orderValue;
      }
    });
    
    return monthlyData;
  };
  
  const data = getMonthData();
  
  if (loading) {
    return (
      <GlassCard className="h-full">
        <h3 className="text-lg font-display font-semibold mb-4">Revenue Overview</h3>
        <div className="h-64 animate-pulse">
          <div className="h-full w-full bg-gray-200 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-display font-semibold mb-4">Revenue Overview</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c96e6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0c96e6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Revenue']}
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0c96e6" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default RevenueChart;