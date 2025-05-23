import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Filter, ArrowDownAZ, Kanban as ViewKanban, List, MoreHorizontal, Edit, Trash2, X } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { formatCurrency, formatDate, getStageColor } from '../utils/format';

const Leads: React.FC = () => {
  const { user } = useAuth();
  const { leads, loading, deleteLead, addLead } = useLeads(user?.uid || null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    stage: 'new',
    value: '',
    followUpDate: '',
    notes: ''
  });
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group leads by stage for Kanban view
  const leadsByStage = {
    new: filteredLeads.filter(lead => lead.stage === 'new'),
    contacted: filteredLeads.filter(lead => lead.stage === 'contacted'),
    qualified: filteredLeads.filter(lead => lead.stage === 'qualified'),
    proposal: filteredLeads.filter(lead => lead.stage === 'proposal'),
    won: filteredLeads.filter(lead => lead.stage === 'won'),
    lost: filteredLeads.filter(lead => lead.stage === 'lost'),
  };
  
  const handleDeleteLead = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteLead(id, name, user?.displayName || 'User');
    }
  };
  
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData = {
      name: formData.name,
      company: formData.company,
      contact: formData.contact,
      stage: formData.stage as 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost',
      value: parseFloat(formData.value) || 0,
      followUpDate: new Date(formData.followUpDate),
      notes: formData.notes
    };

    const success = await addLead(leadData, user?.displayName || 'User');
    
    if (success) {
      setShowAddModal(false);
      setFormData({
        name: '',
        company: '',
        contact: '',
        stage: 'new',
        value: '',
        followUpDate: '',
        notes: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-display font-bold text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Users className="inline-block mr-2" size={28} />
          Leads
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-full shadow-sm">
            <button 
              className={`p-2 rounded-l-full ${viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
              onClick={() => setViewMode('table')}
            >
              <List size={18} />
            </button>
            <button 
              className={`p-2 rounded-r-full ${viewMode === 'kanban' ? 'bg-primary-100 text-primary-600' : 'text-gray-500'}`}
              onClick={() => setViewMode('kanban')}
            >
              <ViewKanban size={18} />
            </button>
          </div>
          
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => setShowAddModal(true)}
          >
            Add Lead
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
            className="w-full md:w-80"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => {/* Open filter modal */}}
          >
            Filter
          </Button>
          <Button
            variant="outline"
            leftIcon={<ArrowDownAZ size={16} />}
            onClick={() => {/* Open sort options */}}
          >
            Sort
          </Button>
        </div>
      </div>
      
      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-gray-900">Add New Lead</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter lead name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact *
                  </label>
                  <Input
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Email or phone"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value
                  </label>
                  <Input
                    name="value"
                    type="number"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <Input
                    name="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Additional notes about this lead..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftIcon={<Plus size={18} />}
                >
                  Add Lead
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {loading ? (
        <GlassCard>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 bg-gray-200 rounded-full w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ) : (
        <>
          {viewMode === 'table' ? (
            <GlassCard>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No leads found</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first lead</p>
                  <Button
                    leftIcon={<Plus size={18} />}
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Lead
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{lead.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{lead.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{lead.contact}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStageColor(lead.stage)}>
                              {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatCurrency(lead.value)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(lead.followUpDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                className="text-gray-400 hover:text-primary-600"
                                onClick={() => {/* Open edit modal */}}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-error-600"
                                onClick={() => handleDeleteLead(lead.id, lead.name)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {Object.entries(leadsByStage).map(([stage, stageLeads]) => (
                <div key={stage} className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-700 capitalize">
                      {stage} <span className="text-gray-400 ml-1">({stageLeads.length})</span>
                    </h3>
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </div>
                  
                  <div className="flex-1 space-y-3 min-h-[300px]">
                    {stageLeads.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center text-gray-400 text-sm">
                        No leads
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <GlassCard 
                          key={lead.id} 
                          className="!p-4 !shadow-sm"
                          hoverEffect={true}
                          shadowColor="rgba(12, 150, 230, 0.1)"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{lead.name}</h4>
                            <Badge className={getStageColor(lead.stage)}>
                              {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-2">{lead.company}</p>
                          <p className="text-sm text-gray-500 mb-3">{lead.contact}</p>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700">{formatCurrency(lead.value)}</span>
                            <div className="flex items-center space-x-2">
                              <button 
                                className="text-gray-400 hover:text-primary-600"
                                onClick={() => {/* Open edit modal */}}
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-error-600"
                                onClick={() => handleDeleteLead(lead.id, lead.name)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leads;