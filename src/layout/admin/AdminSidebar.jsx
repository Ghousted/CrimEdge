import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../components/DarkModeContext';

export default function AdminSidebar({ collapsed }) {
  const { darkMode } = useDarkMode();
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <i className="bi bi-grid-1x2-fill"></i> },
    { path: '/admin/users', label: 'User Management', icon: <i className="bi bi-people-fill"></i> },
    { path: '/admin/downloads', label: 'Download Preview', icon: <i className="bi bi-cloud-arrow-down-fill"></i> }
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] transition-all duration-200 z-40
        ${collapsed ? 'w-[60px]' : 'w-[220px]'}
        ${darkMode ? 'bg-[#18191A] shadow-r shadow-md shadow-gray-700' : 'bg-white border-r border-gray-200'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-3">
          {/* Toggle button removed */}
        </div>

        <nav className="flex-1 px-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${isActive(item.path)
                  ? darkMode
                    ? 'bg-[#3A3B3C] text-white'
                    : 'bg-gray-200 text-black'
                  : darkMode
                  ? 'text-gray-300 hover:bg-[#242526]'
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
