import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const response = await api.get('/recipes/saved');
      setSavedRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setError('Failed to load saved recipes');
      setLoading(false);
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    try {
      await api.delete(`/recipes/saved/${recipeId}`);
      // Remove the recipe from the local state
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Your Saved Recipes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          All your favorite recipes in one place
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {savedRecipes.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" align="center">
                You haven't saved any recipes yet.
              </Typography>
            </Grid>
          ) : (
            savedRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.image}
                    alt={recipe.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      minHeight: '3em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {recipe.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {recipe.readyInMinutes} minutes
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        View Recipe
                      </Button>
                      <IconButton
                        onClick={() => handleUnsaveRecipe(recipe.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Favorite />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SavedRecipes; 