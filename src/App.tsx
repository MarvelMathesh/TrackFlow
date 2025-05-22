import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LeadsPage } from './pages/LeadsPage';
import { LeadFormPage } from './pages/LeadFormPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/new" element={<LeadFormPage />} />
        <Route path="leads/:id" element={<LeadFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;