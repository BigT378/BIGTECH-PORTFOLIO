import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { AdminPage } from '@/pages/AdminPage';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}

function App() {
  const hash = useHashRoute();
  const isAdmin = hash === '#admin' || hash === '#/admin';

  if (isAdmin) {
    return (
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    );
  }

  return <HomePage />;
}

export default App;
