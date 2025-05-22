import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  ArrowLeft, 
  Trash2, 
  Calendar, 
  CalendarClock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getLeadById, createLead, updateLead } from '../lib/leads';
import { Lead, LeadStage } from '../lib/types';

interface LeadFormData {
  name: string;
  company: string;
  contact: string;
  productInterest: string;
  stage: LeadStage;
  followUpDate: string;
  notes: string;
}

export function LeadFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<LeadFormData>();
  
  const currentStage = watch('stage');
  
  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        try {
          setLoading(true);
          const lead = await getLeadById(id);
          
          if (lead) {
            // Format the date for the input element
            const followUpDate = lead.followUpDate 
              ? new Date(lead.followUpDate).toISOString().split('T')[0]
              : '';
            
            setValue('name', lead.name);
            setValue('company', lead.company);
            setValue('contact', lead.contact);
            setValue('productInterest', lead.productInterest);
            setValue('stage', lead.stage);
            setValue('followUpDate', followUpDate);
            setValue('notes', lead.notes);
          } else {
            setError('Lead not found');
          }
        } catch (error) {
          console.error('Error fetching lead:', error);
          setError('Failed to load lead data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchLead();
    }
  }, [id, setValue]);
  
  const onSubmit = async (data: LeadFormData) => {
    try {
      setSaving(true);
      
      if (id) {
        await updateLead(id, data);
      } else {
        // If it's a new lead
        await createLead(data as Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      navigate('/leads');
    } catch (error) {
      console.error('Error saving lead:', error);
      setError('Failed to save lead data');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lead data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error/10 p-6 rounded-lg border border-error/30 text-error flex items-start">
        <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium mb-2">Error</h3>
          <p>{error}</p>
          <button 
            className="btn btn-sm btn-primary mt-4"
            onClick={() => navigate('/leads')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/leads" className="text-muted-foreground hover:text-foreground mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold">{id ? 'Edit Lead' : 'New Lead'}</h2>
      </div>
      
      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name *
            </label>
            <input
              id="name"
              type="text"
              className={`input w-full ${errors.name ? 'border-error' : ''}`}
              placeholder="Contact person name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-xs text-error mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium">
              Company *
            </label>
            <input
              id="company"
              type="text"
              className={`input w-full ${errors.company ? 'border-error' : ''}`}
              placeholder="Company name"
              {...register('company', { required: 'Company is required' })}
            />
            {errors.company && (
              <p className="text-xs text-error mt-1">{errors.company.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-medium">
              Contact *
            </label>
            <input
              id="contact"
              type="text"
              className={`input w-full ${errors.contact ? 'border-error' : ''}`}
              placeholder="Email or phone number"
              {...register('contact', { required: 'Contact is required' })}
            />
            {errors.contact && (
              <p className="text-xs text-error mt-1">{errors.contact.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="productInterest" className="block text-sm font-medium">
              Product Interest
            </label>
            <input
              id="productInterest"
              type="text"
              className="input w-full"
              placeholder="What product they're interested in"
              {...register('productInterest')}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stage" className="block text-sm font-medium">
              Stage *
            </label>
            <select
              id="stage"
              className={`input w-full ${errors.stage ? 'border-error' : ''}`}
              {...register('stage', { required: 'Stage is required' })}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.stage && (
              <p className="text-xs text-error mt-1">{errors.stage.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="followUpDate" className="block text-sm font-medium">
              Follow-up Date
            </label>
            <div className="relative">
              <input
                id="followUpDate"
                type="date"
                className="input w-full pl-10"
                {...register('followUpDate')}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            className="input w-full min-h-[120px]"
            placeholder="Add any relevant notes about this lead"
            {...register('notes')}
          />
        </div>
        
        <div className="flex justify-between">
          <div>
            {id && (
              <button
                type="button"
                className="btn btn-ghost btn-md text-error hover:bg-error/10 hover:text-error"
                onClick={() => {
                  alert('Delete functionality would be implemented in Final Version');
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-md"
              onClick={() => navigate('/leads')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Lead
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
      
      {id && (
        <div className="flex items-center text-xs mt-6 text-muted-foreground justify-end">
          <CalendarClock className="h-3 w-3 mr-1" />
          <span>Created on: {new Date().toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}