const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { dietaryRestrictions, cuisinePreferences, skillLevel } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.dietaryRestrictions': dietaryRestrictions,
          'preferences.cuisinePreferences': cuisinePreferences,
          'preferences.skillLevel': skillLevel
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/recipes
// @desc    Save user created recipe
// @access  Private
router.post('/recipes', auth, [
  body('title').notEmpty().withMessage('Recipe title is required'),
  body('description').notEmpty().withMessage('Recipe description is required'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, ingredients, instructions } = req.body;
    
    const user = await User.findById(req.user.id);
    user.createdRecipes.push({
      title,
      description,
      ingredients,
      instructions
    });

    await user.save();

    res.json({
      success: true,
      message: 'Recipe saved successfully',
      createdRecipes: user.createdRecipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/recipes
// @desc    Get user created recipes
// @access  Private
router.get('/recipes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      createdRecipes: user.createdRecipes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
