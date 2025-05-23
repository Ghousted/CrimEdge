import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useState } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar collapsed={sidebarCollapsed} />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            marginTop: '60px',
            marginLeft: sidebarCollapsed ? '60px' : '220px',
            transition: 'margin-left 0.2s ease',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
