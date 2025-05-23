import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LogIn, Mail, Lock, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { signInWithGoogle, signIn, signUp, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setFormError((err as Error).message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-4xl p-8 shadow-glass-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart size={32} />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">TrackFlow CRM</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Sign in to manage your leads and orders'}
          </p>
        </div>
        
        {(error || formError) && (
          <div className="bg-error-50 text-error-800 p-3 rounded-lg mb-6">
            {error || formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <Input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              leftIcon={<User size={18} className="text-gray-400" />}
            />
          )}
          
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail size={18} className="text-gray-400" />}
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock size={18} className="text-gray-400" />}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            leftIcon={<LogIn size={20} />}
            isLoading={loading}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <Button
          className="w-full mb-6"
          variant="outline"
          size="lg"
          leftIcon={<Mail size={20} />}
          onClick={signInWithGoogle}
          isLoading={loading}
        >
          Sign in with Google
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;