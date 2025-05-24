import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Filter, 
  ArrowDownAZ, 
  CheckCircle, 
  TruckIcon, 
  PackageOpen, 
  Clock, 
  Edit, 
  Trash2,
  X,
  User,
  Package,
  DollarSign
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency, formatDate, getStageColor } from '../utils/format';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { orders, loading, deleteOrder, addOrder } = useOrders(user?.uid || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    customerName: '',
    status: 'received',
    orderValue: '',
    courier: '',
    trackingNumber: '',
    notes: ''
  });
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group orders by status
  const ordersByStatus = {
    received: filteredOrders.filter(order => order.status === 'received'),
    development: filteredOrders.filter(order => order.status === 'development'),
    ready: filteredOrders.filter(order => order.status === 'ready'),
    dispatched: filteredOrders.filter(order => order.status === 'dispatched'),
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <Clock size={18} className="text-primary-500" />;
      case 'development':
        return <PackageOpen size={18} className="text-secondary-500" />;
      case 'ready':
        return <CheckCircle size={18} className="text-warning-500" />;
      case 'dispatched':
        return <TruckIcon size={18} className="text-success-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };
    const handleDeleteOrder = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete order for ${name}?`)) {
      deleteOrder(id, name, user?.displayName || 'User');
    }
  };
  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      leadId: formData.leadId,
      customerName: formData.customerName,
      status: formData.status as 'received' | 'development' | 'ready' | 'dispatched',
      orderValue: parseFloat(formData.orderValue) || 0,
      dispatchDate: null,
      courier: formData.courier,
      trackingNumber: formData.trackingNumber,
      notes: formData.notes
    };

    const result = await addOrder(orderData, user?.displayName || 'User');
    
    if (result) {
      setShowAddModal(false);
      setFormData({
        leadId: '',
        customerName: '',
        status: 'received',
        orderValue: '',
        courier: '',
        trackingNumber: '',
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
          <ShoppingCart className="inline-block mr-2" size={28} />
          Orders
        </motion.h1>
          <Button
          leftIcon={<Plus size={18} />}
          onClick={() => setShowAddModal(true)}
        >
          New Order
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search orders..."
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
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i}>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
            <GlassCard key={status} className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <h3 className="font-medium text-gray-700 capitalize ml-2">
                    {status} <span className="text-gray-400">({statusOrders.length})</span>
                  </h3>
                </div>
                <Badge className={getStageColor(status)}>
                  {statusOrders.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {statusOrders.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center text-gray-400 text-sm">
                    No orders
                  </div>
                ) : (
                  statusOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{order.customerName}</h4>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="text-gray-400 hover:text-primary-600"
                            onClick={() => {/* Open edit modal */}}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-error-600"
                            onClick={() => handleDeleteOrder(order.id, order.customerName)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</span>
                        <span className="font-medium text-gray-700">{formatCurrency(order.orderValue)}</span>
                      </div>
                      
                      {order.status === 'dispatched' && order.trackingNumber && (
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Tracking:</span> {order.trackingNumber}
                          <span className="ml-2 text-gray-400">via {order.courier}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {order.dispatchDate ? (
                          <span>Dispatched: {formatDate(order.dispatchDate)}</span>
                        ) : (
                          <span>Created: {formatDate(order.createdAt)}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          ))}        </div>
      )}
      
      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center">
                  <Package className="mr-3 text-primary-600" size={24} />
                  Add New Order
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <Input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    leftIcon={<User size={16} className="text-gray-400" />}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead ID
                  </label>
                  <Input
                    name="leadId"
                    value={formData.leadId}
                    onChange={handleInputChange}
                    placeholder="Associated lead ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Value *
                  </label>
                  <Input
                    name="orderValue"
                    type="number"
                    step="0.01"
                    value={formData.orderValue}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    leftIcon={<DollarSign size={16} className="text-gray-400" />}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="received">Received</option>
                    <option value="development">Development</option>
                    <option value="ready">Ready</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courier
                  </label>
                  <Input
                    name="courier"
                    value={formData.courier}
                    onChange={handleInputChange}
                    placeholder="Courier service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <Input
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleInputChange}
                    placeholder="Tracking number"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Additional notes about the order..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Order
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;