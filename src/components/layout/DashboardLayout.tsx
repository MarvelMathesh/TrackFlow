import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-gradient-shift bg-[length:400%_400%]">
      <Sidebar />
      
      <motion.main
        className="ml-20 lg:ml-64 min-h-screen p-4 md:p-6 lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;