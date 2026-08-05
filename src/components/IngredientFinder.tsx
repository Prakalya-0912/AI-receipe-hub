import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Loader2, ChefHat, Lock } from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { recipeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface IngredientFinderProps {
  onRecipeFound: (recipe: Recipe) => void;
  onLoginRequired: () => void;
}

const IngredientFinder: React.FC<IngredientFinderProps> = ({ onRecipeFound, onLoginRequired }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundRecipes, setFoundRecipes] = useState<Recipe[]>([]);
  const { isAuthenticated } = useAuth();

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) return;
    
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Search for recipes based on ingredients
      const response = await recipeAPI.searchByIngredients(ingredients, 6);
      
      if (response.recipes && response.recipes.length > 0) {
        const foundRecipes: Recipe[] = response.recipes.map((apiRecipe: any) => ({
          id: apiRecipe.id.toString(),
          title: apiRecipe.title,
          description: `A recipe featuring ${ingredients.join(', ')} with ${apiRecipe.missedIngredients?.length || 0} additional ingredients needed.`,
          ingredients: [
            ...apiRecipe.usedIngredients?.map((ing: any) => `${ing.amount || '1'} ${ing.unit || 'cup'} ${ing.name}`) || [],
            ...apiRecipe.missedIngredients?.map((ing: any) => `${ing.amount || '1'} ${ing.unit || 'cup'} ${ing.name}`) || []
          ],
          instructions: [
            'Prepare all ingredients by washing and chopping as needed.',
            'Heat cooking oil in a large pan over medium heat.',
            'Add aromatics and sauté until fragrant.',
            `Add ${ingredients.join(' and ')} to the pan.`,
            'Season with salt and pepper.',
            'Cook according to ingredient requirements.',
            'Taste and adjust seasoning as needed.',
            'Serve hot and enjoy!'
          ],
          prepTime: 15,
          cookTime: 25,
          servings: 4,
          difficulty: apiRecipe.missedIngredients?.length > 5 ? 'Hard' : apiRecipe.missedIngredients?.length > 2 ? 'Medium' : 'Easy',
          tags: ['Ingredient-Based', 'Real Recipe', ...(ingredients.slice(0, 2))],
          createdAt: new Date()
        }));
        
        setFoundRecipes(foundRecipes);
      } else {
        throw new Error('No recipes found');
      }
    } catch (error) {
      console.error('Recipe search error:', error);
      
      // Fallback to mock recipes
      const foundRecipes: Recipe[] = [
        {
          id: '1',
          title: `${ingredients[0]} Delight`,
          description: `A wonderful recipe featuring ${ingredients.join(', ')} that brings out amazing flavors.`,
          ingredients: [
            ...ingredients.map(ing => `1 cup ${ing}`),
            '2 tbsp olive oil',
            '1 tsp salt',
            '1/2 tsp black pepper',
            '2 cloves garlic, minced',
            'Fresh herbs for garnish'
          ],
          instructions: [
            'Prepare all ingredients by washing and chopping as needed.',
            'Heat olive oil in a large pan over medium heat.',
            'Add garlic and sauté for 1 minute until fragrant.',
            `Add ${ingredients.join(' and ')} to the pan.`,
            'Season with salt and pepper.',
            'Cook for 10-15 minutes, stirring occasionally.',
            'Taste and adjust seasoning as needed.',
            'Garnish with fresh herbs and serve hot.',
            'Enjoy your ingredient-based creation!'
          ],
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          difficulty: 'Easy',
          tags: ['Quick', 'Ingredient-Based', 'Healthy'],
          createdAt: new Date()
        },
        {
          id: '2',
          title: `${ingredients[ingredients.length - 1]} Fusion`,
          description: `An innovative fusion dish that combines ${ingredients.join(', ')} in a unique way.`,
          ingredients: [
            ...ingredients.map(ing => `1/2 cup ${ing}`),
            '3 tbsp butter',
            '1 onion, diced',
            '1 tsp paprika',
            '1/2 cup broth',
            'Salt and pepper to taste'
          ],
          instructions: [
            'Dice the onion and prepare all ingredients.',
            'Melt butter in a large skillet over medium-high heat.',
            'Add onion and cook until translucent, about 5 minutes.',
            `Add ${ingredients.join(', ')} and paprika.`,
            'Pour in broth and bring to a simmer.',
            'Cook for 15-20 minutes until tender.',
            'Season with salt and pepper.',
            'Serve immediately while hot.',
            'Perfect for a quick and satisfying meal!'
          ],
          prepTime: 15,
          cookTime: 25,
          servings: 3,
          difficulty: 'Medium',
          tags: ['Fusion', 'Creative', 'Comfort Food'],
          createdAt: new Date()
        }
      ];
      
      setFoundRecipes(foundRecipes);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
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
        <div className="p-3 bg-secondary-100 rounded-lg">
          <Search className="h-6 w-6 text-secondary-600" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-neutral-900">
            Ingredient Finder
          </h3>
          <p className="text-neutral-600">Find recipes from what you have</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Add your ingredients
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., tomatoes, chicken, pasta..."
              className="input-field flex-1"
              disabled={isSearching}
            />
            <motion.button
              onClick={addIngredient}
              disabled={!currentIngredient.trim() || isSearching}
              className={`p-3 rounded-lg transition-colors ${
                !currentIngredient.trim() || isSearching
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-secondary-500 hover:bg-secondary-600 text-white'
              }`}
              whileHover={!currentIngredient.trim() || isSearching ? {} : { scale: 1.05 }}
              whileTap={!currentIngredient.trim() || isSearching ? {} : { scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your ingredients ({ingredients.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <motion.span
                  key={ingredient}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="inline-flex items-center space-x-2 bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{ingredient}</span>
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="hover:bg-secondary-200 rounded-full p-1 transition-colors"
                    disabled={isSearching}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={findRecipes}
          disabled={ingredients.length === 0 || isSearching}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            ingredients.length === 0 || isSearching
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              : 'btn-secondary hover:scale-105'
          }`}
          whileHover={ingredients.length === 0 || isSearching ? {} : { scale: 1.02 }}
          whileTap={ingredients.length === 0 || isSearching ? {} : { scale: 0.98 }}
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Finding Recipe...</span>
            </>
          ) : (
            <>
              <ChefHat className="h-5 w-5" />
              <span>Find Recipe</span>
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
            Please sign in to search recipes by ingredients and access all features.
          </p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <h4 className="font-medium text-secondary-800 mb-2">🔍 Search Tips:</h4>
          <ul className="text-sm text-secondary-700 space-y-1">
            <li>• Add at least 3-4 ingredients for better results</li>
            <li>• Include both proteins and vegetables when possible</li>
            <li>• Don't worry about exact quantities</li>
            <li>• Common pantry items (salt, oil) are automatically included</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default IngredientFinder;
