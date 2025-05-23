import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ActivityLog } from '../types';

export const useActivity = (userId: string | null, limitCount = 10) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const activitiesCollection = collection(db, 'activities');
        const activitiesQuery = query(
          activitiesCollection, 
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(activitiesQuery);
        
        const fetchedActivities: ActivityLog[] = [];
        querySnapshot.forEach((doc) => {
          fetchedActivities.push({ id: doc.id, ...doc.data() } as ActivityLog);
        });
        
        setActivities(fetchedActivities);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [userId, limitCount]);
  
  return { activities, loading, error };
};