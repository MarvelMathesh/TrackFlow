import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  shadowColor?: string;
};

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hoverEffect = true,
  shadowColor,
}) => {
  return (
    <motion.div
      className={cn(
        'bg-white/80 backdrop-blur-md rounded-4xl border border-white/20',
        'p-6 shadow-glass overflow-hidden',
        shadowColor && 'shadow-colored',
        hoverEffect && 'hover:shadow-glass-lg transition-all duration-300',
        className
      )}
      style={shadowColor ? { '--shadow-color': shadowColor } as React.CSSProperties : undefined}
      whileHover={hoverEffect ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;