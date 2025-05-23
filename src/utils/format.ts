import { format, formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (timestamp: Timestamp | Date): string => {
  let date: Date;
  
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (timestamp: Timestamp | null) => {
  if (!timestamp) return 'N/A';
  return format(timestamp.toDate(), 'MMM d, yyyy h:mm a');
};

export const formatTimeAgo = (timestamp: Timestamp): string => {
  const now = new Date();
  const date = timestamp.toDate();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'contacted':
      return 'bg-cyan-100 text-cyan-800';
    case 'qualified':
      return 'bg-orange-100 text-orange-800';
    case 'proposal':
      return 'bg-yellow-100 text-yellow-800';
    case 'won':
      return 'bg-green-100 text-green-800';
    case 'lost':
      return 'bg-red-100 text-red-800';
    case 'received':
      return 'bg-blue-100 text-blue-800';
    case 'development':
      return 'bg-yellow-100 text-yellow-800';
    case 'ready':
      return 'bg-orange-100 text-orange-800';
    case 'dispatched':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPercentChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
};