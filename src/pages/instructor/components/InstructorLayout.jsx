import { Outlet, useLocation } from 'react-router-dom';
import InstructorHeader from './InstructorHeader';

export default function InstructorLayout() {
  const location = useLocation();

  return (
    <>
      <InstructorHeader />
      <main 
        style={{

          marginTop: '60px', // Adjust this value based on your header height
          minHeight: 'calc(100vh - 60px)', // Full viewport height minus header height
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
