import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div>
      <motion.h1 
        className="text-3xl font-display font-bold text-gray-900"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShoppingCart className="inline-block mr-2" size={28} />
        Orders
      </motion.h1>
      
      <div className="mt-8 text-center text-gray-500">
        Orders functionality will be added here.
      </div>
    </div>
  );
};

export default Orders;