import { useState } from 'react';

export const useOrders = (userId: string | null) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return { 
    orders, 
    loading, 
    error
  };
};