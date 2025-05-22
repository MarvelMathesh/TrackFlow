import { getLeads, getUpcomingFollowUps } from './leads';
import { DashboardMetrics, Lead, LeadStage } from './types';

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const leads = await getLeads();
  const upcomingFollowUps = await getUpcomingFollowUps();
  
  const openLeadStages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent'];
  const openLeads = leads.filter(lead => openLeadStages.includes(lead.stage));
  
  const wonLeads = leads.filter(lead => lead.stage === 'Won');
  const totalQualifiedLeads = leads.filter(
    lead => ['Qualified', 'Proposal Sent', 'Won', 'Lost'].includes(lead.stage)
  );
  
  const conversionRate = totalQualifiedLeads.length > 0 
    ? (wonLeads.length / totalQualifiedLeads.length) * 100 
    : 0;
  
  return {
    totalLeads: leads.length,
    openLeads: openLeads.length,
    conversionRate,
    upcomingFollowUps
  };
};