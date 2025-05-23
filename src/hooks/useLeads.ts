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
import { Lead } from '../types';
import { logActivity } from '../utils/activity';

export const useLeads = (userId: string | null) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const leadsCollection = collection(db, 'leads');
        const leadsQuery = query(leadsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(leadsQuery);
        
        const fetchedLeads: Lead[] = [];
        querySnapshot.forEach((doc) => {
          fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
        });
        
        setLeads(fetchedLeads);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, [userId]);
  
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, userName: string) => {
    if (!userId) return null;
    
    try {
      const now = Timestamp.now();
      const newLead = {
        ...leadData,
        followUpDate: leadData.followUpDate instanceof Date ? 
          Timestamp.fromDate(leadData.followUpDate) : 
          leadData.followUpDate,
        assignedTo: userId,
        productInterest: leadData.productInterest || '',
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(collection(db, 'leads'), newLead);
      const createdLead = { id: docRef.id, ...newLead } as Lead;
      
      setLeads((prevLeads) => [createdLead, ...prevLeads]);
      
      await logActivity({
        userId,
        userName,
        action: 'created',
        entityType: 'lead',
        entityId: docRef.id,
        entityName: leadData.name,
      });
      
      return createdLead;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };
  
  const updateLead = async (leadId: string, leadData: Partial<Lead>, userName: string) => {
    if (!userId) return false;
    
    try {
      const leadRef = doc(db, 'leads', leadId);
      const updatedData = {
        ...leadData,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(leadRef, updatedData);
      
      setLeads((prevLeads) => 
        prevLeads.map((lead) => 
          lead.id === leadId ? { ...lead, ...updatedData } : lead
        )
      );
      
      await logActivity({
        userId,
        userName,
        action: 'updated',
        entityType: 'lead',
        entityId: leadId,
        entityName: leadData.name || 'Lead',
      });
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };
  
  const deleteLead = async (leadId: string, leadName: string, userName: string) => {
    if (!userId) return false;
    
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
      
      await logActivity({
        userId,
        userName,
        action: 'deleted',
        entityType: 'lead',
        entityId: leadId,
        entityName: leadName,
      });
      
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };
  
  return { 
    leads, 
    loading, 
    error, 
    addLead, 
    updateLead, 
    deleteLead 
  };
};