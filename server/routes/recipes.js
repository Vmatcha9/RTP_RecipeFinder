const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

// Search recipes
router.get('/search', auth, async (req, res) => {
  try {
    const { query, cuisineType, time, allergens } = req.query;
    let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&q=${query}`;

    if (cuisineType) {
      url += `&cuisineType=${cuisineType}`;
    }
    if (time) {
      url += `&time=${time}`;
    }

    const response = await axios.get(url);
    let recipes = response.data.hits.map(hit => hit.recipe);

    // Filter out recipes with allergens
    if (allergens) {
      const allergenList = allergens.split(',');
      recipes = recipes.filter(recipe => {
        return !allergenList.some(allergen => 
          recipe.ingredientLines.some(ingredient => 
            ingredient.toLowerCase().includes(allergen.toLowerCase())
          )
        );
      });
    }

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// Save recipe
router.post('/save/:recipeId', auth, async (req, res) => {
  try {
    console.log('Received save request for recipe:', req.params.recipeId);
    console.log('Recipe data:', req.body);
    
    const { title, image, readyInMinutes, servings, sourceUrl } = req.body;
    const recipeId = req.params.recipeId;
    
    if (!title || !image || !readyInMinutes || !servings || !sourceUrl) {
      console.error('Missing required fields:', { title, image, readyInMinutes, servings, sourceUrl });
      return res.status(400).json({ message: 'Missing required recipe data' });
    }
    
    // Create or update recipe document
    let recipe = await Recipe.findOne({ spoonacularId: recipeId });
    if (!recipe) {
      console.log('Creating new recipe document');
      recipe = new Recipe({
        spoonacularId: recipeId,
        title,
        image,
        readyInMinutes,
        servings,
        sourceUrl
      });
      await recipe.save();
      console.log('New recipe saved:', recipe._id);
    } else {
      console.log('Found existing recipe:', recipe._id);
    }

    // Add recipe to user's saved recipes
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedRecipes.includes(recipe._id)) {
      console.log('Adding recipe to user saved recipes');
      user.savedRecipes.push(recipe._id);
      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('Recipe already saved for user');
    }

    res.json({ message: 'Recipe saved successfully' });
  } catch (error) {
    console.error('Error in save recipe route:', error);
    res.status(500).json({ message: 'Error saving recipe', error: error.message });
  }
});

// Get saved recipes
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    res.json(user.savedRecipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ message: 'Error fetching saved recipes' });
  }
});

// Update recently viewed
router.post('/recent/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.recentlyViewed = user.recentlyViewed.filter(
      id => id.toString() !== req.params.recipeId
    );
    user.recentlyViewed.unshift(req.params.recipeId);
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed.pop();
    }
    await user.save();
    res.json({ message: 'Recently viewed updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recently viewed' });
  }
});

// Get recipe notes
router.get('/notes/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const note = user.recipeNotes.find(note => note.recipeId === req.params.recipeId);
    res.json({ notes: note ? note.notes : '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Save recipe notes
router.post('/notes', auth, async (req, res) => {
  try {
    const { recipeId, notes } = req.body;
    const user = await User.findById(req.user.id);
    
    const noteIndex = user.recipeNotes.findIndex(note => note.recipeId === recipeId);
    
    if (noteIndex === -1) {
      user.recipeNotes.push({ recipeId, notes });
    } else {
      user.recipeNotes[noteIndex].notes = notes;
    }
    
    await user.save();
    res.json({ message: 'Notes saved successfully' });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Error saving notes' });
  }
});

module.exports = router; 