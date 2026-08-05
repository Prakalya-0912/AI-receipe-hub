import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <ChefHat className="h-8 w-8 text-primary-600" />
                <Sparkles className="h-4 w-4 text-secondary-500 absolute -top-1 -right-1 animate-bounce-gentle" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-neutral-900">
                  AI Recipe Hub
                </h1>
                <p className="text-sm text-neutral-600">Cook with Intelligence</p>
              </div>
            </motion.div>
            
            <nav className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                      Recipes
                    </a>
                    <a href="#" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                      Favorites
                    </a>
                    <a href="#" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                      My Recipes
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-neutral-700">
                        {user?.name}
                      </span>
                    </div>
                    
                    <motion.button
                      onClick={logout}
                      className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                      About
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => handleAuthClick('login')}
                      className="text-neutral-600 hover:text-primary-600 transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleAuthClick('signup')}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </motion.header>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
