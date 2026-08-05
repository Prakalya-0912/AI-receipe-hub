import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import { Recipe } from './types/Recipe';
import { AuthProvider } from './contexts/AuthContext';
import AIRecipeWriter from './components/AIRecipeWriter';
import IngredientFinder from './components/IngredientFinder';
import RecipeDisplay from './components/RecipeDisplay';
import AuthModal from './components/AuthModal';

function App() {
  const [activeTab, setActiveTab] = useState<'write' | 'find'>('write');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleLoginRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20">
        <Header />
        <Hero activeTab={activeTab} setActiveTab={setActiveTab} onLoginRequired={handleLoginRequired} />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            {activeTab === 'write' ? (
              <AIRecipeWriter 
                onRecipeGenerated={setCurrentRecipe} 
                onLoginRequired={handleLoginRequired}
              />
            ) : (
              <IngredientFinder 
                onRecipeFound={setCurrentRecipe}
                onLoginRequired={handleLoginRequired}
              />
            )}
          </div>
          
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <RecipeDisplay recipe={currentRecipe} />
          </div>
        </motion.div>
      </main>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
      </div>
    </AuthProvider>
  );
}

export default App;
