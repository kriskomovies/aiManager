import { cn } from '@/lib/utils';
import { Home, Users, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('flex h-full flex-col border-r bg-white', className)}>
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-red-500" />
          <span className="font-semibold">Organization</span>
        </div>
      </div>
      <div className="flex-1 space-y-1 p-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100',
              isActive ? 'bg-gray-100' : 'text-gray-600'
            )
          }
        >
          <Home className="h-4 w-4" />
          <span>Homepage</span>
        </NavLink>
        <NavLink
          to="/buildings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-red-50',
              isActive ? 'bg-red-50 text-red-500' : 'text-gray-600'
            )
          }
        >
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Сгради</span>
          </div>
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100',
              isActive ? 'bg-gray-100' : 'text-gray-600'
            )
          }
        >
          <Users className="h-4 w-4" />
          <span>Юзъри</span>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100',
              isActive ? 'bg-gray-100' : 'text-gray-600'
            )
          }
        >
          <Calendar className="h-4 w-4" />
          <span>Календар</span>
        </NavLink>
      </div>
    </div>
  );
}
