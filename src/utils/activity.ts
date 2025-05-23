import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ActivityData {
  userId: string;
  userName: string;
  action: string;
  entityType: 'lead' | 'order';
  entityId: string;
  entityName: string;
}

export const logActivity = async (data: ActivityData) => {
  try {
    await addDoc(collection(db, 'activities'), {
      ...data,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};