import * as React from 'react';
import { cn } from '@/lib/utils';
import { Home, Users, Calendar, Brain, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
  isSpecial?: boolean; // For special styling like buildings
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'AI',
    icon: Brain,
  },
  {
    path: '/buildings',
    label: 'Сгради',
    icon: Home,
    isSpecial: true, // Special red styling
  },
  {
    path: '/users',
    label: 'Юзъри',
    icon: Users,
  },
  {
    path: '/calendar',
    label: 'Календар',
    icon: Calendar,
  },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex h-full min-h-screen flex-col border-r bg-white', className)}>
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-red-500" />
          <span className="font-semibold">Organization</span>
        </div>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-3xl px-3 py-2 text-sm font-medium',
                  'hover:bg-red-50',
                  isActive
                    ? 'bg-red-50 text-red-500'
                    : 'text-gray-600'
                )
              }
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
