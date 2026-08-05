import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, ChefHat, Send, Lock } from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { recipeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface AIRecipeWriterProps {
  onRecipeGenerated: (recipe: Recipe) => void;
  onLoginRequired: () => void;
}

const AIRecipeWriter: React.FC<AIRecipeWriterProps> = ({ onRecipeGenerated, onLoginRequired }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { isAuthenticated } = useAuth();

  const generateRecipe = async () => {
    if (!prompt.trim()) return;
    
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Search for recipes based on the prompt
      const response = await recipeAPI.searchRecipes(prompt, { number: 1 });
      
      if (response.recipes && response.recipes.length > 0) {
        const apiRecipe = response.recipes[0];
        
        // Convert API recipe to our Recipe type
        const recipe: Recipe = {
          id: apiRecipe.id.toString(),
          title: apiRecipe.title,
          description: apiRecipe.summary?.replace(/<[^>]*>/g, '') || `A delicious ${prompt} recipe.`,
          ingredients: apiRecipe.ingredients?.map((ing: any) => 
            `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
          ) || [
            '2 cups main ingredient',
            '1 cup supporting ingredient',
            '1/2 cup flavor enhancer',
            '2 tbsp cooking oil',
            '1 tsp salt',
            '1/2 tsp black pepper',
            '1 tsp garlic powder',
            'Fresh herbs for garnish'
          ],
          instructions: apiRecipe.instructions?.[0]?.steps?.map((step: any) => step.step) || [
            'Preheat your cooking surface to medium heat.',
            'Prepare all ingredients by washing, chopping, and measuring.',
            'Heat oil in a large pan or pot.',
            'Add main ingredients and cook for 5-7 minutes.',
            'Incorporate supporting ingredients and seasonings.',
            'Continue cooking while stirring occasionally for 10-15 minutes.',
            'Taste and adjust seasoning as needed.',
            'Garnish with fresh herbs and serve hot.',
            'Enjoy your delicious creation!'
          ],
          prepTime: Math.floor((apiRecipe.readyInMinutes || 40) * 0.3),
          cookTime: Math.floor((apiRecipe.readyInMinutes || 40) * 0.7),
          servings: apiRecipe.servings || 4,
          difficulty: apiRecipe.readyInMinutes > 60 ? 'Hard' : apiRecipe.readyInMinutes > 30 ? 'Medium' : 'Easy',
          tags: [...(apiRecipe.diets || []), ...(apiRecipe.cuisines || []), 'AI-Generated'],
          createdAt: new Date()
        };
        
        onRecipeGenerated(recipe);
      } else {
        throw new Error('No recipes found');
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      
      // Fallback to mock recipe
      const recipe: Recipe = {
        id: Date.now().toString(),
        title: `AI-Generated ${prompt} Recipe`,
        description: `A delicious ${prompt} recipe created just for you using artificial intelligence.`,
        ingredients: [
          '2 cups main ingredient',
          '1 cup supporting ingredient',
          '1/2 cup flavor enhancer',
          '2 tbsp cooking oil',
          '1 tsp salt',
          '1/2 tsp black pepper',
          '1 tsp garlic powder',
          'Fresh herbs for garnish'
        ],
        instructions: [
          'Preheat your cooking surface to medium heat.',
          'Prepare all ingredients by washing, chopping, and measuring.',
          'Heat oil in a large pan or pot.',
          'Add main ingredients and cook for 5-7 minutes.',
          'Incorporate supporting ingredients and seasonings.',
          'Continue cooking while stirring occasionally for 10-15 minutes.',
          'Taste and adjust seasoning as needed.',
          'Garnish with fresh herbs and serve hot.',
          'Enjoy your AI-created masterpiece!'
        ],
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        difficulty: 'Medium',
        tags: ['AI-Generated', 'Creative', 'Personalized'],
        createdAt: new Date()
      };
      
      onRecipeGenerated(recipe);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-primary-100 rounded-lg">
          <Wand2 className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-neutral-900">
            AI Recipe Writer
          </h3>
          <p className="text-neutral-600">Describe what you want to cook</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            What would you like to cook?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A healthy Mediterranean pasta with fresh vegetables and herbs..."
            className="textarea-field h-32"
            disabled={isGenerating}
          />
        </div>

        <motion.button
          onClick={generateRecipe}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            !prompt.trim() || isGenerating
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              : 'btn-primary hover:scale-105'
          }`}
          whileHover={!prompt.trim() || isGenerating ? {} : { scale: 1.02 }}
          whileTap={!prompt.trim() || isGenerating ? {} : { scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating Recipe...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Generate Recipe</span>
            </>
          )}
        </motion.button>
      </div>

      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-700">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">Login Required</span>
          </div>
          <p className="text-sm text-amber-600 mt-2">
            Please sign in to generate AI-powered recipes and access all features.
          </p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-2 text-primary-700">
            <ChefHat className="h-5 w-5" />
            <span className="text-sm font-medium">Pro Tip:</span>
          </div>
          <p className="text-sm text-primary-600 mt-2">
            Be specific with your description! Instead of "pasta", try "creamy mushroom pasta with garlic and herbs" for better results.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <h4 className="font-medium text-primary-800 mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Be specific about cuisine type or cooking style</li>
          <li>• Mention dietary restrictions or preferences</li>
          <li>• Include desired cooking time or difficulty level</li>
          <li>• Specify the number of servings needed</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AIRecipeWriter;
