import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-error-100 text-error-600 mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-medium text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button leftIcon={<ArrowLeft size={18} />} size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;