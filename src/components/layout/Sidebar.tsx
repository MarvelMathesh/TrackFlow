import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart4, 
  Settings, 
  LogOut, 
  BarChart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/leads', label: 'Leads', icon: <Users size={20} /> },
  { path: '/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart4 size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="fixed top-0 left-0 h-full w-20 lg:w-64 bg-white/90 backdrop-blur-md shadow-glass-lg z-10 flex flex-col">
      <div className="flex justify-center lg:justify-start lg:px-6 py-6">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart className="h-8 w-8 text-primary-600" />
          <span className="ml-2 font-display text-xl font-bold hidden lg:block">
            TrackFlow
          </span>
        </motion.div>
      </div>
      
      <nav className="flex-1 px-3 lg:px-6 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center justify-center lg:justify-start rounded-2xl p-3 lg:px-4',
                  'transition-all duration-200',
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {item.icon}
                <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto px-3 lg:px-6 py-6">
        {user && (
          <div className="flex flex-col items-center lg:items-start space-y-2 mb-4">
            <div className="flex items-center justify-center lg:justify-start">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="font-medium text-primary-700">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="ml-3 hidden lg:block">
                <p className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center lg:justify-start rounded-2xl p-3 lg:px-4 text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="ml-3 font-medium hidden lg:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;