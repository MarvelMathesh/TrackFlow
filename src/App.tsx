import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Lazy loaded pages
const Leads = React.lazy(() => import('./pages/Leads'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  
  // Update document title
  useEffect(() => {
    document.title = 'TrackFlow CRM';
  }, []);
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="leads"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[70vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  }
                >
                  <Leads />
                </React.Suspense>
              }
            />
            <Route
              path="orders"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[70vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  }
                >
                  <Orders />
                </React.Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[70vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  }
                >
                  <Analytics />
                </React.Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <React.Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[70vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                  }
                >
                  <Settings />
                </React.Suspense>
              }
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#1f2937',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '0.75rem 1rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </>
  );
}

export default App;