import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Home, Users2, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tax Manager
          </h2>


          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent' : 'transparent'
                )
              }
            >
                
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/companies"
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent' : 'transparent'
                )
              }
            >
              <Users2 className="mr-2 h-4 w-4" />
              <span>Companies</span>
            </NavLink>
            <NavLink
              to="/buildings"
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent' : 'transparent'
                )
              }
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span>Buildings</span>
            </NavLink>
            <NavLink
              to="/contractors"
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent' : 'transparent'
                )
              }
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>Contractors</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
