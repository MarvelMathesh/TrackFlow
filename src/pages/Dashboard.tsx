import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Search, 
  Bell 
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import GlassCard from '../components/ui/GlassCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import FollowUpReminders from '../components/dashboard/FollowUpReminders';
import StageProgress from '../components/dashboard/StageProgress';
import RevenueChart from '../components/dashboard/RevenueChart';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { useOrders } from '../hooks/useOrders';
import { useActivity } from '../hooks/useActivity';
import { formatCurrency, getPercentChange } from '../utils/format';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { leads, loading: leadsLoading } = useLeads(user?.uid || null);
  const { orders, loading: ordersLoading } = useOrders(user?.uid || null);
  const { activities, loading: activitiesLoading } = useActivity(user?.uid || null);
  
  // Calculate metrics
  const totalLeads = leads.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderValue, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate month-over-month changes for metrics
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = new Date().getFullYear();
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthLeads = leads.filter(
    lead => {
      const date = lead.createdAt.toDate();
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }
  ).length;
  
  const lastMonthLeads = leads.filter(
    lead => {
      const date = lead.createdAt.toDate();
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }
  ).length;
  
  const currentMonthOrders = orders.filter(
    order => {
      const date = order.createdAt.toDate();
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }
  ).length;
  
  const lastMonthOrders = orders.filter(
    order => {
      const date = order.createdAt.toDate();
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }
  ).length;
  
  const currentMonthRevenue = orders.filter(
    order => {
      const date = order.createdAt.toDate();
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }
  ).reduce((sum, order) => sum + order.orderValue, 0);
  
  const lastMonthRevenue = orders.filter(
    order => {
      const date = order.createdAt.toDate();
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }
  ).reduce((sum, order) => sum + order.orderValue, 0);
  
  const leadsChangePercent = getPercentChange(currentMonthLeads, lastMonthLeads);
  const ordersChangePercent = getPercentChange(currentMonthOrders, lastMonthOrders);
  const revenueChangePercent = getPercentChange(currentMonthRevenue, lastMonthRevenue);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-display font-bold text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Bell size={20} className="text-gray-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-600 rounded-full flex items-center justify-center text-xs text-white">
              3
            </span>
          </div>
          
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white cursor-pointer"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer">
              <span className="font-medium text-primary-700">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            icon={<Users size={20} className="text-primary-600" />}
            change={leadsChangePercent}
            shadowColor="rgba(12, 150, 230, 0.3)"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MetricCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart size={20} className="text-secondary-600" />}
            change={ordersChangePercent}
            shadowColor="rgba(23, 175, 172, 0.3)"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MetricCard
            title="Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign size={20} className="text-accent-600" />}
            change={revenueChangePercent}
            shadowColor="rgba(255, 122, 10, 0.3)"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <MetricCard
            title="Avg. Order Value"
            value={formatCurrency(avgOrderValue)}
            icon={<BarChart size={20} className="text-success-600" />}
            shadowColor="rgba(16, 185, 129, 0.3)"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <RevenueChart orders={orders} loading={ordersLoading} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <StageProgress leads={leads} loading={leadsLoading} />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <ActivityFeed activities={activities} loading={activitiesLoading} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <FollowUpReminders leads={leads} loading={leadsLoading} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;