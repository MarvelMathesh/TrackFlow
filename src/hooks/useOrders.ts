import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import { logActivity } from '../utils/activity';

export const useOrders = (userId: string | null) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersQuery = query(ordersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(ordersQuery);
        
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [userId]);
  
  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, userName: string) => {
    if (!userId) return null;
    
    try {
      const now = Timestamp.now();
      const newOrder = {
        ...orderData,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      const createdOrder = { id: docRef.id, ...newOrder } as Order;
      
      setOrders((prevOrders) => [createdOrder, ...prevOrders]);
      
      await logActivity({
        userId,
        userName,
        action: 'created',
        entityType: 'order',
        entityId: docRef.id,
        entityName: orderData.customerName,
      });
      
      return createdOrder;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };
  
  const updateOrder = async (orderId: string, orderData: Partial<Order>, userName: string) => {
    if (!userId) return false;
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updatedData = {
        ...orderData,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(orderRef, updatedData);
      
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order.id === orderId ? { ...order, ...updatedData } : order
        )
      );
      
      await logActivity({
        userId,
        userName,
        action: 'updated',
        entityType: 'order',
        entityId: orderId,
        entityName: orderData.customerName || 'Order',
      });
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };
  
  const deleteOrder = async (orderId: string, orderName: string, userName: string) => {
    if (!userId) return false;
    
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      
      await logActivity({
        userId,
        userName,
        action: 'deleted',
        entityType: 'order',
        entityId: orderId,
        entityName: orderName,
      });
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };
  
  return { 
    orders, 
    loading, 
    error, 
    addOrder, 
    updateOrder, 
    deleteOrder 
  };
};