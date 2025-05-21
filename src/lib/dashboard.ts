import { DashboardMetrics } from './types';

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  return {
    appVersion: "1.0.0",
    lastLogin: new Date().toLocaleDateString()
  };
};