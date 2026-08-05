import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Tag, Calendar, Star } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeDisplayProps {
  recipe: Recipe | null;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  if (!recipe) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card h-96 flex items-center justify-center"
      >
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-neutral-400 mb-2">
            No Recipe Yet
          </h3>
          <p className="text-neutral-500">
            Generate or find a recipe to see it displayed here
          </p>
        </div>
      </motion.div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-secondary-600 bg-secondary-100';
      case 'Medium': return 'text-primary-600 bg-primary-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-display font-bold text-neutral-900 leading-tight">
            {recipe.title}
          </h2>
          <div className="flex items-center space-x-1 text-primary-500">
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5 fill-current" />
            <Star className="h-5 w-5" />
          </div>
        </div>
        
        <p className="text-neutral-600 mb-4">{recipe.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-600">
              {recipe.prepTime + recipe.cookTime} mins total
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-600">
              Serves {recipe.servings}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <Calendar className="h-4 w-4" />
            <span>{recipe.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
            <span>📝</span>
            <span>Ingredients</span>
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center space-x-3 text-neutral-700"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0" />
                <span>{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
            <span>👨‍🍳</span>
            <span>Instructions</span>
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex space-x-4"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-neutral-700 leading-relaxed">{instruction}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {recipe.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200">
        <div className="flex space-x-3">
          <button className="btn-primary flex-1">
            Save Recipe
          </button>
          <button className="btn-outline">
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDisplay;
