import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  FolderOpen,
  Calendar,
  Mail,
  Database,
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-blue-600' },
    { name: 'Users', icon: Users, path: '/dashboard/users', color: 'text-green-600' },
    { name: 'Reports', icon: BarChart3, path: '/dashboard/reports', color: 'text-purple-600' },
    { name: 'Documents', icon: FileText, path: '/dashboard/documents', color: 'text-yellow-600' },
    { name: 'Projects', icon: FolderOpen, path: '/dashboard/projects', color: 'text-indigo-600' },
    { name: 'Calendar', icon: Calendar, path: '/dashboard/calendar', color: 'text-pink-600' },
    { name: 'Messages', icon: Mail, path: '/dashboard/messages', color: 'text-cyan-600' },
    { name: 'Database', icon: Database, path: '/dashboard/database', color: 'text-teal-600' },
    { name: 'Security', icon: Shield, path: '/dashboard/security', color: 'text-red-600' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings', color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 pt-16`}
      >
        <div className="h-full overflow-y-auto">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-saf-red-600 to-saf-red-700 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} 
                    />
                    <span className="font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">SAF Admin Portal v1.0</p>
              <p className="text-xs text-gray-400 mt-1">© 2026 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

