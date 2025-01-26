import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"

export function RootLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  )
} 