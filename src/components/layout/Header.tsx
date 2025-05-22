import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Plus,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/leads')) {
      if (path === '/leads/new') return 'New Lead';
      if (path.includes('/leads/')) return 'Lead Details';
      return 'Leads';
    }
    
    return 'TrackFlow';
  };
  
  const handleCreateNew = () => {
    if (location.pathname.startsWith('/leads')) {
      navigate('/leads/new');
    }
  };
  
  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="input pl-10 w-64 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {location.pathname === '/leads' && (
          <motion.button
            className="btn btn-primary btn-md"
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </motion.button>
        )}
        
        <div className="relative">
          <Bell className="h-5 w-5 text-foreground hover:text-primary cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}