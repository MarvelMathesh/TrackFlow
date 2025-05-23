import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import GlassCard from './GlassCard';
import { cn } from '../../utils/cn';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  shadowColor?: string;
  className?: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  shadowColor,
  className,
}) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <GlassCard className={cn('h-full', className)} shadowColor={shadowColor}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-4xl font-display font-bold tabular-nums tracking-tight">
            {value}
          </p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span className={cn(
                'text-sm font-medium',
                isPositive ? 'text-success-500' : 'text-error-500'
              )}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'p-3 rounded-2xl',
          shadowColor ? 'bg-opacity-10' : 'bg-primary-50'
        )} 
          style={shadowColor ? { backgroundColor: `${shadowColor}20` } : undefined}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
};

export default MetricCard;