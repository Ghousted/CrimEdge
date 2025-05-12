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
      <main className="mt-[70px] min-h-[calc(100vh-70px)] w-full box-border p-5 bg-[#f7f9fa]">
        <Outlet />
      </main>
    </LoadingContext.Provider>
  );
}
