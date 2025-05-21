import { useState } from 'react';
import { 
  BarChart3, 
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

type SimpleDashboardMetrics = {
  appVersion: string;
  lastLogin: string;
}

export function Dashboard() {
  const [loading, setLoading] = useState(false);
  
  const metrics: SimpleDashboardMetrics = {
    appVersion: "1.0.0",
    lastLogin: new Date().toLocaleDateString()
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>
      
      {/* Placeholder Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="App Version"
          value={metrics.appVersion}
          icon={<BarChart3 className="h-5 w-5" />}
          trend={5}
          href="#"
        />
        <MetricCard 
          title="Last Login"
          value={metrics.lastLogin}
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={0}
          href="#"
        />
      </div>
      
      {/* Placeholder for Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="card p-5 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Welcome to TrackFlow</h3>
          </div>
          
          <div className="h-72 w-full flex items-center justify-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">
              Charts and metrics will be added soon
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Status</h3>
          </div>
          
          <div className="flex items-center justify-center h-72 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">All systems operational</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: number;
  href: string;
}

function MetricCard({ title, value, icon, trend, href }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card p-5 block transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-primary/10 rounded-full p-2">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          <div className={trend > 0 ? 'text-success' : 'text-error'}>
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
          <span className="text-muted-foreground ml-1">vs last period</span>
        </div>
      </div>
    </motion.div>
  );
}