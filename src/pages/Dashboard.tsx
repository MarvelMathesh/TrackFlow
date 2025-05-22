import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersRound, 
  ArrowUpRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardMetrics } from '../lib/dashboard';
import { DashboardMetrics } from '../lib/types';
import { formatDate, formatPercentage } from '../lib/utils';

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
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
  
  if (!metrics) {
    return (
      <div className="bg-error/10 p-4 rounded-lg border border-error/30 text-error flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Leads"
          value={metrics.totalLeads}
          icon={<UsersRound className="h-5 w-5" />}
          trend={10}
          href="/leads"
        />
        <MetricCard 
          title="Open Leads"
          value={metrics.openLeads}
          icon={<UsersRound className="h-5 w-5" />}
          trend={5}
          href="/leads"
        />
        <MetricCard 
          title="Conversion Rate"
          value={formatPercentage(metrics.conversionRate)}
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={2.5}
          href="/leads"
        />
      </div>
      
      {/* Upcoming Follow-ups List */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          className="card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Follow-ups</h3>
            <Link to="/leads" className="text-sm text-primary hover:underline">
              View all leads
            </Link>
          </div>
          
          <div className="space-y-4 max-h-[calc(100%-3rem)] overflow-auto">
            {metrics.upcomingFollowUps.length > 0 ? (
              metrics.upcomingFollowUps.map((lead) => (
                <Link 
                  key={lead.id} 
                  to={`/leads/${lead.id}`}
                  className="flex items-start p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="bg-muted rounded-full p-2 mr-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{lead.name}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{lead.company}</span>
                      <span>•</span>
                      <span>{formatDate(lead.followUpDate!)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No upcoming follow-ups</p>
              </div>
            )}
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
      <Link to={href} className="card p-5 block transition-all hover:shadow-md">
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
      </Link>
    </motion.div>
  );
}