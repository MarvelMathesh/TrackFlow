import React from 'react';
import { Clock, Check, Plus, Edit, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { ActivityLog } from '../../types';
import { formatTimeAgo } from '../../utils/format';

type ActivityFeedProps = {
  activities: ActivityLog[];
  loading: boolean;
};

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <Plus className="h-4 w-4 text-success-500" />;
    case 'updated':
      return <Edit className="h-4 w-4 text-primary-500" />;
    case 'deleted':
      return <Trash2 className="h-4 w-4 text-error-500" />;
    case 'completed':
      return <Check className="h-4 w-4 text-success-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getActionText = (activity: ActivityLog) => {
  const { action, entityType, entityName, userName } = activity;
  return (
    <>
      <span className="font-medium">{userName}</span> {action} {entityType} <span className="font-medium">{entityName}</span>
    </>
  );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, loading }) => {
  if (loading) {
    return (
      <GlassCard className="h-full">
        <h3 className="text-lg font-display font-semibold mb-4">Recent Activity</h3>
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start mb-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full">
      <h3 className="text-lg font-display font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {getActionText(activity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};

export default ActivityFeed;