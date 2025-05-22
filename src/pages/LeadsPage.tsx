import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  List, 
  Plus, 
  Search,
  UsersRound,
  ArrowRight,
  CalendarClock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getLeads } from '../lib/leads';
import { EmptyState } from '../components/ui/EmptyState';
import { Lead, LeadStage } from '../lib/types';
import { formatDate } from '../lib/utils';

// Mock data for initial render (will be replaced with Firebase data)
const LEAD_STAGES: LeadStage[] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost'
];

export function LeadsPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getLeadsByStage = (stage: LeadStage) => {
    return filteredLeads.filter(lead => lead.stage === stage);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <EmptyState
          icon={<UsersRound className="h-10 w-10 text-muted-foreground" />}
          title="No leads found"
          description="Get started by creating your first lead to track potential customers."
          action={
            <button 
              className="btn btn-primary btn-md"
              onClick={() => navigate('/leads/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Lead
            </button>
          }
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
        
        <div className="flex items-center gap-4 self-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search leads..."
              className="input pl-10 h-9 w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="bg-muted p-1 rounded-md flex">
            <button
              className={`p-1 rounded ${
                viewMode === 'kanban' ? 'bg-background shadow-sm' : ''
              }`}
              onClick={() => setViewMode('kanban')}
              aria-label="Kanban view"
            >
              <Layers className="h-5 w-5" />
            </button>
            <button
              className={`p-1 rounded ${
                viewMode === 'list' ? 'bg-background shadow-sm' : ''
              }`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {LEAD_STAGES.map((stage) => (
              <div key={stage} className="kanban-column">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{stage}</h3>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {getLeadsByStage(stage).length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {getLeadsByStage(stage).map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Lead Name</th>
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Stage</th>
                <th className="px-4 py-3 text-left font-medium">Follow-up Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.company}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.contact}</td>
                  <td className="px-4 py-3">
                    <LeadStageBadge stage={lead.stage} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.followUpDate ? formatDate(lead.followUpDate) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      to={`/leads/${lead.id}`}
                      className="btn btn-sm btn-ghost"
                      aria-label={`View ${lead.name} details`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface LeadCardProps {
  lead: Lead;
}

function LeadCard({ lead }: LeadCardProps) {
  return (
    <motion.div
      className="lead-card"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to={`/leads/${lead.id}`} className="block">
        <h4 className="font-medium mb-1">{lead.name}</h4>
        <p className="text-sm text-muted-foreground mb-2">{lead.company}</p>
        
        {lead.followUpDate && (
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>{formatDate(lead.followUpDate)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">{lead.productInterest}</span>
          <LeadStageBadge stage={lead.stage} />
        </div>
      </Link>
    </motion.div>
  );
}

interface LeadStageBadgeProps {
  stage: LeadStage;
}

function LeadStageBadge({ stage }: LeadStageBadgeProps) {
  let classes = 'badge ';
  
  switch (stage) {
    case 'New':
      classes += 'bg-blue-100 text-blue-800';
      break;
    case 'Contacted':
      classes += 'bg-purple-100 text-purple-800';
      break;
    case 'Qualified':
      classes += 'bg-amber-100 text-amber-800';
      break;
    case 'Proposal Sent':
      classes += 'bg-orange-100 text-orange-800';
      break;
    case 'Won':
      classes += 'bg-green-100 text-green-800';
      break;
    case 'Lost':
      classes += 'bg-red-100 text-red-800';
      break;
    default:
      classes += 'bg-gray-100 text-gray-800';
  }
  
  return <span className={classes}>{stage}</span>;
}