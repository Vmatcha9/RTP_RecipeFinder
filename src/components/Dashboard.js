import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  InputAdornment,
  Divider,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Favorite, FavoriteBorder, Search, AccessTime, Restaurant, TrendingUp, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { spoonacularApi } from '../api';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [filters, setFilters] = useState({
    cuisine: '',
    time: '',
    allergens: '',
    diet: '',
    mealType: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    cuisine: '',
    time: '',
    allergens: '',
    diet: '',
    mealType: '',
  });

  const cuisineTypes = [
    'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
    'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
    'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
    'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish',
    'Thai', 'Vietnamese'
  ];

  const dietTypes = [
    { label: 'Non-vegetarian', value: 'non-veg' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' }
  ];

  const mealTypes = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' }
  ];

  const timeRanges = [
    { label: 'Quick (15 min)', value: 15 },
    { label: 'Medium (30 min)', value: 30 },
    { label: 'Long (60 min)', value: 60 },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    console.log('API Key:', process.env.REACT_APP_SPOONACULAR_API_KEY);
    fetchSavedRecipes();
    fetchRecentRecipes();
    fetchTrendingRecipes();
  }, [navigate]);

  const fetchRecentRecipes = async () => {
    try {
      console.log('Fetching recent recipes...');
      const response = await spoonacularApi.searchRecipes('', '', '', '', 30);
      console.log('Recent recipes response:', response);
      if (response && response.results) {
        setRecentRecipes(response.results.slice(0, 6));
      } else {
        console.error('No results in recent recipes response');
        setError('No recent recipes found');
      }
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
      setError('Failed to fetch recent recipes. Please check your API key.');
    }
  };

  const fetchTrendingRecipes = async () => {
    try {
      console.log('Fetching trending recipes...');
      const response = await spoonacularApi.searchRecipes('popular', '', '', '', 30);
      console.log('Trending recipes response:', response);
      if (response && response.results) {
        setTrendingRecipes(response.results.slice(0, 6));
      } else {
        console.error('No results in trending recipes response');
        setError('No trending recipes found');
      }
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
      setError('Failed to fetch trending recipes. Please check your API key.');
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await spoonacularApi.get('/recipes/saved');
      setSavedRecipes(response.data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      console.log('Saving recipe:', recipe);
      const response = await api.post(`/recipes/save/${recipe.id}`, {
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl || recipe.spoonacularSourceUrl
      });
      
      console.log('Save response:', response.data);
      setSnackbar({
        open: true,
        message: 'Recipe saved successfully!',
      });
      setSavedRecipes(prev => [...prev, recipe]);
      
    } catch (error) {
      console.error('Error saving recipe:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save recipe. Please try again.',
      });
    }
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    handleSearch();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      console.log('Searching recipes with query:', searchQuery);
      console.log('Using filters:', appliedFilters);
      const response = await spoonacularApi.searchRecipes(
        searchQuery,
        appliedFilters.cuisine,
        '',
        appliedFilters.allergens,
        appliedFilters.time
      );
      console.log('Search response:', response);
      
      if (response && response.results && response.results.length > 0) {
        setRecipes(response.results);
      } else {
        setError('No recipes found. Try a different search.');
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('Failed to fetch recipes. Please check your API key and try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const RecipeCard = ({ recipe }) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: 2,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.title}
        sx={{
          objectFit: 'cover',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
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
            onClick={() => window.location.href = `/recipe/${recipe.id}`}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            View Recipe
          </Button>
          <IconButton
            onClick={() => handleSaveRecipe(recipe)}
            sx={{
              color: savedRecipes.some((r) => r.id === recipe.id) ? 'error.main' : 'inherit',
            }}
          >
            {savedRecipes.some((r) => r.id === recipe.id) ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button
            startIcon={<Favorite />}
            onClick={() => navigate('/saved-recipes')}
            color="primary"
          >
            Saved Recipes
          </Button>
          <Button
            startIcon={<Logout />}
            onClick={handleLogout}
            color="primary"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 280,
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #e0e0e0',
            padding: 2,
            overflowY: 'auto',
            zIndex: 1
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Filters
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              label="Cuisine Type"
            >
              <MenuItem value="">Any</MenuItem>
              {cuisineTypes.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Max Cooking Time</InputLabel>
            <Select
              value={filters.time}
              onChange={(e) => handleFilterChange('time', e.target.value)}
              label="Max Cooking Time"
            >
              <MenuItem value="">Any</MenuItem>
              {timeRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Dietary Preference</InputLabel>
            <Select
              value={filters.diet}
              onChange={(e) => handleFilterChange('diet', e.target.value)}
              label="Dietary Preference"
            >
              <MenuItem value="">Any</MenuItem>
              {dietTypes.map((diet) => (
                <MenuItem key={diet.value} value={diet.value}>
                  {diet.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={filters.mealType}
              onChange={(e) => handleFilterChange('mealType', e.target.value)}
              label="Meal Type"
            >
              <MenuItem value="">Any</MenuItem>
              {mealTypes.map((meal) => (
                <MenuItem key={meal.value} value={meal.value}>
                  {meal.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Allergens to Exclude"
            value={filters.allergens}
            onChange={(e) => handleFilterChange('allergens', e.target.value)}
            placeholder="e.g., dairy, nuts, gluten"
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            marginLeft: '280px',
            padding: 3,
            position: 'relative',
            zIndex: 0,
            height: '100vh',
            overflowY: 'auto'
          }}
        >
          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome back, User!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Discover new recipes and cooking inspiration
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                  },
                }}
              />
            </Paper>
          </Box>

          {/* Content Section */}
          <Box sx={{ position: 'relative', zIndex: 0 }}>
            {!searchQuery && (
              <>
                {/* Recent Recipes */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                    Recent Recipes
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 2,
                      pb: 2,
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      msOverflowStyle: 'none',
                      '&:hover': {
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing'
                        }
                      }
                    }}
                  >
                    {recentRecipes.map((recipe) => (
                      <Box key={recipe.id} sx={{ minWidth: 300, flexShrink: 0 }}>
                        <Card
                          sx={{
                            height: '100%',
                            borderRadius: 2,
                            boxShadow: 2,
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
                            sx={{
                              objectFit: 'cover',
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                            }}
                          />
                          <CardContent>
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
                                onClick={() => window.location.href = `/recipe/${recipe.id}`}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                }}
                              >
                                View Recipe
                              </Button>
                              <IconButton
                                onClick={() => handleSaveRecipe(recipe)}
                                sx={{
                                  color: savedRecipes.some((r) => r.id === recipe.id) ? 'error.main' : 'inherit',
                                }}
                              >
                                {savedRecipes.some((r) => r.id === recipe.id) ? (
                                  <Favorite />
                                ) : (
                                  <FavoriteBorder />
                                )}
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Trending Recipes */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                    Trending Recipes
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 2,
                      pb: 2,
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      msOverflowStyle: 'none',
                      '&:hover': {
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing'
                        }
                      }
                    }}
                  >
                    {trendingRecipes.map((recipe) => (
                      <Box key={recipe.id} sx={{ minWidth: 300, flexShrink: 0 }}>
                        <Card
                          sx={{
                            height: '100%',
                            borderRadius: 2,
                            boxShadow: 2,
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
                            sx={{
                              objectFit: 'cover',
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                            }}
                          />
                          <CardContent>
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
                                onClick={() => window.location.href = `/recipe/${recipe.id}`}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                }}
                              >
                                View Recipe
                              </Button>
                              <IconButton
                                onClick={() => handleSaveRecipe(recipe)}
                                sx={{
                                  color: savedRecipes.some((r) => r.id === recipe.id) ? 'error.main' : 'inherit',
                                }}
                              >
                                {savedRecipes.some((r) => r.id === recipe.id) ? (
                                  <Favorite />
                                ) : (
                                  <FavoriteBorder />
                                )}
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {/* Search Results */}
            {searchQuery && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  Search Results
                </Typography>
                <Grid container spacing={3}>
                  {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: 'transform 0.2s',
                        maxWidth: '300px',
                        margin: '0 auto',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={recipe.image}
                          alt={recipe.title}
                          sx={{
                            objectFit: 'cover',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ 
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            minHeight: '2.5em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {recipe.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <AccessTime sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                              {recipe.readyInMinutes} minutes
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                              variant="contained"
                              size="medium"
                              onClick={() => window.location.href = `/recipe/${recipe.id}`}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                py: 0.5,
                                px: 1.5,
                              }}
                            >
                              View Recipe
                            </Button>
                            <IconButton
                              onClick={() => handleSaveRecipe(recipe)}
                              size="medium"
                              sx={{
                                color: savedRecipes.some((r) => r.id === recipe.id) ? 'error.main' : 'inherit',
                                p: 0.5,
                              }}
                            >
                              {savedRecipes.some((r) => r.id === recipe.id) ? (
                                <Favorite fontSize="medium" />
                              ) : (
                                <FavoriteBorder fontSize="medium" />
                              )}
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            message={snackbar.message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 