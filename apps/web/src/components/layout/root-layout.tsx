import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Search } from 'lucide-react';

export function RootLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex h-14 items-center justify-between border-b bg-white px-8">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Търси..."
                className="h-9 rounded-md border-0 pl-8 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
