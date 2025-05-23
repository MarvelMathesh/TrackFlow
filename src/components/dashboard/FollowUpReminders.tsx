import React from 'react';
import { Bell, Calendar, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import { Lead } from '../../types';
import { formatDate } from '../../utils/format';

type FollowUpRemindersProps = {
  leads: Lead[];
  loading: boolean;
};

export const FollowUpReminders: React.FC<FollowUpRemindersProps> = ({ 
  leads, 
  loading 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const followUps = leads.filter(lead => {
    const followUpDate = lead.followUpDate.toDate();
    return followUpDate >= today;
  }).sort((a, b) => a.followUpDate.toMillis() - b.followUpDate.toMillis()).slice(0, 5);
  
  if (loading) {
    return (
      <GlassCard className="h-full">
        <h3 className="text-lg font-display font-semibold mb-4">
          <Bell className="inline-block mr-2" size={18} />
          Follow-up Reminders
        </h3>
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-semibold">
          <Bell className="inline-block mr-2" size={18} />
          Follow-up Reminders
        </h3>
        <ArrowRight size={16} className="text-gray-400" />
      </div>
      
      {followUps.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No upcoming follow-ups</p>
      ) : (
        <div className="space-y-4">
          {followUps.map((lead) => (
            <div 
              key={lead.id} 
              className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{lead.name}</h4>
                  <p className="text-sm text-gray-500">{lead.company}</p>
                </div>
                <Badge 
                  variant={
                    lead.stage === 'qualified' ? 'primary' : 
                    lead.stage === 'proposal' ? 'warning' :
                    lead.stage === 'won' ? 'success' :
                    'default'
                  }
                >
                  {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                {formatDate(lead.followUpDate)}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default FollowUpReminders;