import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart4, 
  TrendingUp, 
  PieChart, 
  ArrowUp, 
  ArrowDown,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart as ReChartsPie,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/format';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { leads, loading: leadsLoading } = useLeads(user?.uid || null);
  const { orders, loading: ordersLoading } = useOrders(user?.uid || null);
  
  // Prepare data for revenue by month chart
  const getMonthlyRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const monthlyData = months.map(month => ({ 
      month, 
      [currentYear]: 0,
      [lastYear]: 0
    }));
    
    orders.forEach(order => {
      const orderDate = order.createdAt.toDate();
      const year = orderDate.getFullYear();
      if (year === currentYear || year === lastYear) {
        const monthIndex = orderDate.getMonth();
        monthlyData[monthIndex][year] += order.orderValue;
      }
    });
    
    return monthlyData;
  };
  
  // Prepare data for lead stages pie chart
  const getLeadStagesData = () => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    const stageColors = ['#0c96e6', '#17afac', '#ff7a0a', '#eab308', '#10b981', '#ef4444'];
    
    return stages.map((stage, index) => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: leads.filter(lead => lead.stage === stage).length,
      color: stageColors[index]
    })).filter(item => item.value > 0);
  };
  
  // Prepare data for conversion funnel
  const getConversionData = () => {
    const stageOrder = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    
    return stageOrder.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: leads.filter(lead => lead.stage === stage).length
    }));
  };
  
  // Calculate metrics
  const totalLeads = leads.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderValue, 0);
  const wonLeads = leads.filter(lead => lead.stage === 'won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Loading state
  if (leadsLoading || ordersLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-4xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-4xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-display font-bold text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart4 className="inline-block mr-2" size={28} />
          Analytics
        </motion.h1>
        
        <Button
          variant="outline"
          leftIcon={<Download size={18} />}
          onClick={() => {/* Export data */}}
        >
          Export
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-4xl font-display font-bold tabular-nums tracking-tight">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center mt-2">
            <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-sm font-medium text-success-500">12%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
          <p className="text-4xl font-display font-bold tabular-nums tracking-tight">
            {totalOrders}
          </p>
          <div className="flex items-center mt-2">
            <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-sm font-medium text-success-500">8%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Conversion Rate</h3>
          <p className="text-4xl font-display font-bold tabular-nums tracking-tight">
            {conversionRate}%
          </p>
          <div className="flex items-center mt-2">
            <ArrowDown className="h-4 w-4 text-error-500 mr-1" />
            <span className="text-sm font-medium text-error-500">3%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Order Value</h3>
          <p className="text-4xl font-display font-bold tabular-nums tracking-tight">
            {formatCurrency(avgOrderValue)}
          </p>
          <div className="flex items-center mt-2">
            <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-sm font-medium text-success-500">5%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </GlassCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">
              <TrendingUp className="inline-block mr-2" size={18} />
              Revenue Trend
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <div className="h-3 w-3 bg-primary-500 rounded-full mr-1"></div>
              <span className="mr-3">{new Date().getFullYear()}</span>
              <div className="h-3 w-3 bg-gray-300 rounded-full mr-1"></div>
              <span>{new Date().getFullYear() - 1}</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getMonthlyRevenueData()}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCurrentYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c96e6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0c96e6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9fa6b2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9fa6b2" stopOpacity={0} />
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
                  dataKey={new Date().getFullYear().toString()} 
                  stroke="#0c96e6" 
                  fillOpacity={1} 
                  fill="url(#colorCurrentYear)" 
                />
                <Area 
                  type="monotone" 
                  dataKey={(new Date().getFullYear() - 1).toString()} 
                  stroke="#9fa6b2" 
                  fillOpacity={1} 
                  fill="url(#colorLastYear)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center mb-4">
            <PieChart className="mr-2" size={18} />
            <h3 className="text-lg font-display font-semibold">Lead Pipeline Distribution</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReChartsPie>
                <Pie
                  data={getLeadStagesData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {getLeadStagesData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} leads`, name]}
                  contentStyle={{ 
                    borderRadius: '0.5rem', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </ReChartsPie>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-display font-semibold mb-4">Conversion Funnel</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getConversionData()}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value} leads`, 'Count']}
                  contentStyle={{ 
                    borderRadius: '0.5rem', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#0c96e6" 
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="text-lg font-display font-semibold mb-4">Monthly Orders</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getMonthlyRevenueData()}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
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
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '0.5rem', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={new Date().getFullYear().toString()} 
                  stroke="#0c96e6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={(new Date().getFullYear() - 1).toString()} 
                  stroke="#9fa6b2" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;