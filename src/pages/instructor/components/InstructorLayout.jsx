import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import InstructorSidebar from './InstructorSidebar';
import InstructorHeader from './InstructorHeader';

export default function InstructorLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1200);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <InstructorHeader toggleSidebar={toggleSidebar} />
      <InstructorSidebar isOpen={isSidebarOpen} />
      <main>
        <div className={`content ${isSidebarOpen ? '' : 'collapsed'}`}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
