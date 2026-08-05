const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recipes/search
// @desc    Search recipes by query
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, diet, cuisine, maxReadyTime, number = 12 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const params = {
      apiKey: process.env.SPOONACULAR_API_KEY,
      query,
      number,
      addRecipeInformation: true,
      fillIngredients: true
    };

    if (diet) params.diet = diet;
    if (cuisine) params.cuisine = cuisine;
    if (maxReadyTime) params.maxReadyTime = maxReadyTime;

    const response = await axios.get(`${process.env.SPOONACULAR_BASE_URL}/complexSearch`, {
      params
    });

    const recipes = response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      summary: recipe.summary,
      cuisines: recipe.cuisines,
      diets: recipe.diets,
      dishTypes: recipe.dishTypes,
      instructions: recipe.analyzedInstructions,
      ingredients: recipe.extendedIngredients
    }));

    res.json({
      success: true,
      recipes,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('Recipe search error:', error.message);
    
    // Fallback with mock data if API fails
    const mockRecipes = [
      {
        id: 'mock-1',
        title: `Delicious ${req.query.query} Recipe`,
        image: 'https://via.placeholder.com/312x231?text=Recipe+Image',
        readyInMinutes: 30,
        servings: 4,
        summary: `A wonderful ${req.query.query} recipe that's perfect for any occasion.`,
        cuisines: ['International'],
        diets: ['Healthy'],
        dishTypes: ['Main Course'],
        instructions: [{
          steps: [
            { number: 1, step: 'Prepare all ingredients according to the recipe.' },
            { number: 2, step: 'Cook following traditional methods.' },
            { number: 3, step: 'Season to taste and serve hot.' }
          ]
        }],
        ingredients: [
          { name: 'Main ingredient', amount: 2, unit: 'cups' },
          { name: 'Seasoning', amount: 1, unit: 'tsp' },
          { name: 'Oil', amount: 2, unit: 'tbsp' }
        ]
      }
    ];

    res.json({
      success: true,
      recipes: mockRecipes,
      totalResults: 1,
      note: 'Using fallback data - please configure Spoonacular API key'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${process.env.SPOONACULAR_BASE_URL}/${id}/information`, {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        includeNutrition: true
      }
    });

    const recipe = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      readyInMinutes: response.data.readyInMinutes,
      servings: response.data.servings,
      summary: response.data.summary,
      instructions: response.data.analyzedInstructions,
      ingredients: response.data.extendedIngredients,
      nutrition: response.data.nutrition,
      cuisines: response.data.cuisines,
      diets: response.data.diets,
      dishTypes: response.data.dishTypes
    };

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error('Recipe fetch error:', error.message);
    res.status(404).json({ message: 'Recipe not found' });
  }
});

// @route   GET /api/recipes/ingredients/search
// @desc    Search recipes by ingredients
// @access  Public
router.get('/ingredients/search', async (req, res) => {
  try {
    const { ingredients, number = 12 } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ message: 'Ingredients are required' });
    }

    const response = await axios.get(`${process.env.SPOONACULAR_BASE_URL}/findByIngredients`, {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        ingredients,
        number,
        ranking: 1,
        ignorePantry: true
      }
    });

    const recipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
      unusedIngredients: recipe.unusedIngredients,
      likes: recipe.likes
    }));

    res.json({
      success: true,
      recipes
    });
  } catch (error) {
    console.error('Ingredient search error:', error.message);
    
    // Fallback with mock data
    const ingredientsList = req.query.ingredients.split(',');
    const mockRecipes = [{
      id: 'mock-ingredient-1',
      title: `${ingredientsList[0]} Delight`,
      image: 'https://via.placeholder.com/312x231?text=Recipe+Image',
      usedIngredients: ingredientsList.slice(0, 2).map(ing => ({ name: ing.trim() })),
      missedIngredients: [{ name: 'Salt' }, { name: 'Pepper' }],
      unusedIngredients: [],
      likes: 95
    }];

    res.json({
      success: true,
      recipes: mockRecipes,
      note: 'Using fallback data - please configure Spoonacular API key'
    });
  }
});

// @route   POST /api/recipes/favorites
// @desc    Add recipe to favorites
// @access  Private
router.post('/favorites', auth, [
  body('recipeId').notEmpty().withMessage('Recipe ID is required'),
  body('title').notEmpty().withMessage('Recipe title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipeId, title, image } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    // Check if recipe is already in favorites
    const existingFavorite = user.favoriteRecipes.find(
      fav => fav.recipeId === recipeId
    );

    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favoriteRecipes.push({
      recipeId,
      title,
      image: image || ''
    });

    await user.save();

    res.json({
      success: true,
      message: 'Recipe added to favorites',
      favoriteRecipes: user.favoriteRecipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/recipes/favorites/:recipeId
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/favorites/:recipeId', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.favoriteRecipes = user.favoriteRecipes.filter(
      fav => fav.recipeId !== recipeId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Recipe removed from favorites',
      favoriteRecipes: user.favoriteRecipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recipes/favorites
// @desc    Get user's favorite recipes
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      favoriteRecipes: user.favoriteRecipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
