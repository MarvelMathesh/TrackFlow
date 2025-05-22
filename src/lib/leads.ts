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
import { logger } from './logger';

const COLLECTION = 'leads';

export const getLeads = async (): Promise<Lead[]> => {
  logger.info(`Fetching all leads from ${COLLECTION}`);
  try {
    const leadCollection = collection(db, COLLECTION);
    const snapshot = await getDocs(leadCollection);
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
    
    logger.debug(`Retrieved ${leads.length} leads`);
    return leads;
  } catch (error) {
    logger.error(`Failed to fetch leads`, error);
    throw error;
  }
};

export const getLeadsByStage = async (stage: LeadStage): Promise<Lead[]> => {
  logger.info(`Fetching leads with stage: ${stage}`);
  try {
    const leadCollection = collection(db, COLLECTION);
    const q = query(leadCollection, where('stage', '==', stage), orderBy('updatedAt', 'desc'));
    
    const snapshot = await getDocs(q);
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
    
    logger.debug(`Retrieved ${leads.length} leads with stage: ${stage}`);
    return leads;
  } catch (error) {
    logger.error(`Failed to fetch leads with stage: ${stage}`, error);
    throw error;
  }
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  logger.info(`Fetching lead with ID: ${id}`);
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const lead = {
        id: docSnap.id,
        ...docSnap.data()
      } as Lead;
      
      logger.read(COLLECTION, id, lead);
      return lead;
    }
    
    logger.warn(`Lead with ID: ${id} not found`);
    return null;
  } catch (error) {
    logger.error(`Failed to fetch lead with ID: ${id}`, error);
    throw error;
  }
};

export const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  logger.info(`Creating new lead`, lead);
  try {
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
    
    const createdLead = {
      id: docRef.id,
      ...newLead
    };
    
    logger.create(COLLECTION, createdLead);
    return createdLead;
  } catch (error) {
    logger.error(`Failed to create lead`, error);
    throw error;
  }
};

export const updateLead = async (id: string, lead: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  logger.info(`Updating lead with ID: ${id}`, lead);
  try {
    const docRef = doc(db, COLLECTION, id);
    
    await updateDoc(docRef, {
      ...lead,
      updatedAt: serverTimestamp()
    });
    
    logger.update(COLLECTION, id, lead);
  } catch (error) {
    logger.error(`Failed to update lead with ID: ${id}`, error);
    throw error;
  }
};

export const updateLeadStage = async (id: string, stage: LeadStage): Promise<void> => {
  logger.info(`Updating stage for lead with ID: ${id} to ${stage}`);
  try {
    const docRef = doc(db, COLLECTION, id);
    
    await updateDoc(docRef, {
      stage,
      updatedAt: serverTimestamp()
    });
    
    logger.update(COLLECTION, id, { stage });
  } catch (error) {
    logger.error(`Failed to update stage for lead with ID: ${id}`, error);
    throw error;
  }
};

export const getUpcomingFollowUps = async (days: number = 7): Promise<Lead[]> => {
  logger.info(`Fetching upcoming follow-ups for next ${days} days`);
  try {
    const leads = await getLeads();
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    
    const upcomingLeads = leads.filter(lead => {
      if (!lead.followUpDate) return false;
      
      const followUpDate = new Date(lead.followUpDate);
      return followUpDate >= now && followUpDate <= future;
    });
    
    logger.debug(`Found ${upcomingLeads.length} upcoming follow-ups`);
    return upcomingLeads;
  } catch (error) {
    logger.error(`Failed to fetch upcoming follow-ups`, error);
    throw error;
  }
};