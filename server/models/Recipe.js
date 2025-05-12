const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  spoonacularId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  readyInMinutes: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
RecipeSchema.index({ spoonacularId: 1 });
RecipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Recipe', RecipeSchema); 