import { NavLink } from 'react-router-dom';
import { BarChart4, UsersRound, Settings, HelpCircle, Circle as CircleBolt } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: BarChart4 },
  { name: 'Leads', path: '/leads', icon: UsersRound },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <CircleBolt className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-semibold">TrackFlow</h1>
      </div>
      
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-muted'
                )}
                end={item.path === '/'}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <ul className="space-y-1">
          <li>
            <button className="flex w-full items-center gap-3 p-2 rounded-md text-sm font-medium text-foreground hover:bg-muted">
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </li>
          <li>
            <button className="flex w-full items-center gap-3 p-2 rounded-md text-sm font-medium text-foreground hover:bg-muted">
              <HelpCircle className="h-5 w-5" />
              Help
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}