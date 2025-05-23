import { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type Lead = {
  id: string;
  name: string;
  contact: string;
  company: string;
  productInterest?: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  followUpDate: Timestamp;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedTo?: string;
  value: number;
};

export type Order = {
  id: string;
  leadId: string;
  customerName: string;
  status: 'received' | 'development' | 'ready' | 'dispatched';
  orderValue: number;
  dispatchDate: Timestamp | null;
  courier: string;
  trackingNumber: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes: string;
};

export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'lead' | 'order';
  entityId: string;
  entityName: string;
  timestamp: Timestamp;
};

export type DashboardMetric = {
  label: string;
  value: number;
  change: number;
  icon: string;
};