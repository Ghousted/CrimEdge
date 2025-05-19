import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Loading from './Loading';

// Create a loading context
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
});

// Custom hook to use loading state
export const useLoading = () => useContext(LoadingContext);

export default function Layout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loading />}
      <Header />
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
    </LoadingContext.Provider>
  );
}
