import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  activeTab: 'write' | 'find';
  setActiveTab: (tab: 'write' | 'find') => void;
  onLoginRequired: () => void;
}

const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab, onLoginRequired }) => {
  const { isAuthenticated } = useAuth();
  
  const handleTabClick = (tab: 'write' | 'find') => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    setActiveTab(tab);
  };
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="h-12 w-12 text-primary-500 animate-bounce-gentle" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6">
            Cook with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              {' '}AI Magic
            </span>
          </h2>
          
          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Let AI help you create amazing recipes or discover new dishes from ingredients you already have. 
            Your culinary adventure starts here!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => handleTabClick('write')}
            className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'write'
                ? 'bg-primary-500 text-white shadow-lg scale-105'
                : 'bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-200'
            }`}
          >
            <PenTool className="h-5 w-5" />
            <span>Write Recipes with AI</span>
          </button>
          
          <button
            onClick={() => handleTabClick('find')}
            className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'find'
                ? 'bg-secondary-500 text-white shadow-lg scale-105'
                : 'bg-white text-neutral-700 hover:bg-secondary-50 border border-neutral-200'
            }`}
          >
            <Search className="h-5 w-5" />
            <span>Find Recipes by Ingredients</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
