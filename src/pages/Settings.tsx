import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  HelpCircle,
  Check
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-display font-bold text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SettingsIcon className="inline-block mr-2" size={28} />
          Settings
        </motion.h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <GlassCard>
            <nav className="space-y-1">
              <a 
                href="#profile" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary-50 text-primary-700"
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </a>
              <a 
                href="#notifications" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Bell className="mr-3 h-5 w-5 text-gray-400" />
                Notifications
              </a>
              <a 
                href="#security" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Shield className="mr-3 h-5 w-5 text-gray-400" />
                Security
              </a>
              <a 
                href="#data" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Database className="mr-3 h-5 w-5 text-gray-400" />
                Data & Privacy
              </a>
              <a 
                href="#integrations" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Globe className="mr-3 h-5 w-5 text-gray-400" />
                Integrations
              </a>
              <a 
                href="#help" 
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                Help & Support
              </a>
            </nav>
          </GlassCard>
        </div>
        
        <div className="lg:col-span-3">
          <GlassCard>
            <div className="px-4 sm:px-0 mb-6">
              <h3 className="text-lg font-display font-semibold text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your personal information and account settings.
              </p>
            </div>
            
            <div className="pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl font-medium text-primary-700">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                
                <div className="ml-6">
                  <Button size="sm">Change photo</Button>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, GIF or PNG. 2MB max.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  defaultValue={user?.displayName || ''}
                  placeholder="Your full name"
                />
                
                <Input
                  label="Email Address"
                  defaultValue={user?.email || ''}
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company"
                  defaultValue="TrackFlow Inc."
                  placeholder="Your company name"
                />
                
                <Input
                  label="Phone Number"
                  defaultValue="+1 (555) 123-4567"
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-1"
                    placeholder="Write a short bio about yourself"
                    defaultValue="Sales manager with 5+ years of experience in SaaS."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex items-center pt-4">
                <Button size="lg" rightIcon={<Check size={18} />}>
                  Save Changes
                </Button>
                <Button variant="outline" size="lg" className="ml-4">
                  Cancel
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;