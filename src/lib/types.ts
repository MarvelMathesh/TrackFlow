// Type definitions for our application

export type LeadStage = 
  | 'New'
  | 'Contacted'
  | 'Qualified' 
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

export interface Lead {
  id: string;
  name: string;
  contact: string;
  company: string;
  productInterest: string;
  stage: LeadStage;
  followUpDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  openLeads: number;
  conversionRate: number;
  upcomingFollowUps: Lead[];
}