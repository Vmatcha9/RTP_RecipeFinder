import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Chip,
  TextField,
} from '@mui/material';
import { 
  ArrowBack, 
  Favorite, 
  FavoriteBorder, 
  AccessTime, 
  Restaurant, 
  LocalFireDepartment, 
  Edit, 
  Save,
  Kitchen,
  MenuBook
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { spoonacularApi } from '../api';
import api from '../api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRecipe();
      await checkIfSaved();
      await fetchNotes();
    };
    fetchData();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await spoonacularApi.getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.get(`/recipes/saved/${id}`);
      setSaved(response.data.saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      if (saved) {
        await api.delete(`/recipes/saved/${id}`);
      } else {
        await api.post('/recipes/save', { recipe });
      }
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/recipes/notes/${id}`);
      if (response.data && response.data.notes !== undefined) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes('');
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await api.post('/recipes/notes', { recipeId: id, notes });
      if (response.data && response.data.message === 'Notes saved successfully') {
        setIsEditingNotes(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const cleanAndFormatInstructions = (instructions) => {
    if (!instructions) return [];
    
    // If instructions is already an array, clean each instruction
    if (Array.isArray(instructions)) {
      return instructions.map(instruction => {
        // Remove HTML tags and decode HTML entities
        const cleanText = instruction
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        return cleanText;
      }).filter(instruction => instruction.length > 0); // Remove empty instructions
    }
    
    // If instructions is a string with HTML
    if (typeof instructions === 'string' && (instructions.includes('<li>') || instructions.includes('<ol>'))) {
      // Extract text from li elements
      const matches = instructions.match(/<li[^>]*>(.*?)<\/li>/g);
      if (matches) {
        return matches.map(match => {
          const cleanText = match
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return cleanText;
        }).filter(instruction => instruction.length > 0);
      }
    }
    
    // If instructions is a plain string, split by periods or numbers
    if (typeof instructions === 'string') {
      return instructions
        .split(/(?:\d+\.|\.|\n)/)
        .map(step => step.trim())
        .filter(step => step.length > 0);
    }

    return [];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Recipe not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Recipe Image and Title */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={recipe.image}
                alt={recipe.title}
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1,
                }}
              >
                <IconButton
                  onClick={handleSaveRecipe}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  {saved ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>
            </Paper>

            {/* Recipe Title and Info */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {recipe.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  icon={<AccessTime />}
                  label={`${recipe.readyInMinutes} minutes`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<Restaurant />}
                  label={`${recipe.servings} servings`}
                  color="primary"
                  variant="outlined"
                />
                {recipe.nutrition && (
                  <Chip
                    icon={<LocalFireDepartment />}
                    label={`${Math.round(recipe.nutrition.nutrients[0].amount)} calories`}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Notes Section */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    Your Notes
                  </Typography>
                  {isEditingNotes ? (
                    <IconButton onClick={handleSaveNotes} color="primary">
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setIsEditingNotes(true)} color="primary">
                      <Edit />
                    </IconButton>
                  )}
                </Box>
                {isEditingNotes ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    variant="outlined"
                    placeholder="Add your notes here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: 'background.default',
                      borderRadius: 2,
                      minHeight: '100px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => setIsEditingNotes(true)}
                  >
                    <Typography variant="body1" color={notes ? 'text.primary' : 'text.secondary'}>
                      {notes || 'Click to add notes...'}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Column - Recipe Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Ingredients */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Kitchen sx={{ color: 'primary.main', fontSize: '2rem' }} />
                <Typography variant="h5" gutterBottom>
                  Ingredients
                </Typography>
              </Box>
              <List>
                {recipe.extendedIngredients.map((ingredient) => (
                  <ListItem key={ingredient.id} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={ingredient.original}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '1.1rem',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Instructions */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBook sx={{ color: 'primary.main', fontSize: '2rem' }} />
                <Typography variant="h5">
                  Instructions
                </Typography>
              </Box>
              {recipe.instructions ? (
                <Box component="ol" sx={{ 
                  pl: 3,
                  '& li': {
                    mb: 2,
                    color: 'text.primary',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                  '& li::marker': {
                    color: 'primary.main',
                    fontWeight: 'bold',
                  }
                }}>
                  {cleanAndFormatInstructions(recipe.instructions).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No instructions available for this recipe.
                </Typography>
              )}
            </Paper>

            {/* Nutrition Information */}
            {recipe.nutrition && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Nutrition Information
                </Typography>
                <Grid container spacing={2}>
                  {recipe.nutrition.nutrients.slice(0, 6).map((nutrient) => (
                    <Grid item xs={6} sm={4} key={nutrient.name}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          backgroundColor: 'background.default',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          {nutrient.name}
                        </Typography>
                        <Typography variant="h6">
                          {Math.round(nutrient.amount)} {nutrient.unit}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetail; 