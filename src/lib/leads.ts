import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Lead, LeadStage } from './types';

const COLLECTION = 'leads';

export const getLeads = async (): Promise<Lead[]> => {
  const leadCollection = collection(db, COLLECTION);
  const snapshot = await getDocs(leadCollection);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lead[];
};

export const getLeadsByStage = async (stage: LeadStage): Promise<Lead[]> => {
  const leadCollection = collection(db, COLLECTION);
  const q = query(leadCollection, where('stage', '==', stage), orderBy('updatedAt', 'desc'));
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lead[];
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Lead;
  }
  
  return null;
};

export const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  const now = new Date().toISOString();
  
  const newLead = {
    ...lead,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...newLead,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return {
    id: docRef.id,
    ...newLead
  };
};

export const updateLead = async (id: string, lead: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  
  await updateDoc(docRef, {
    ...lead,
    updatedAt: serverTimestamp()
  });
};

export const updateLeadStage = async (id: string, stage: LeadStage): Promise<void> => {
  const docRef = doc(db, COLLECTION, id);
  
  await updateDoc(docRef, {
    stage,
    updatedAt: serverTimestamp()
  });
};

export const getUpcomingFollowUps = async (days: number = 7): Promise<Lead[]> => {
  const leads = await getLeads();
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);
  
  return leads.filter(lead => {
    if (!lead.followUpDate) return false;
    
    const followUpDate = new Date(lead.followUpDate);
    return followUpDate >= now && followUpDate <= future;
  });
};