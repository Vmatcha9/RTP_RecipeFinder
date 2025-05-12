import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { 
  Search as SearchIcon, 
  FilterAlt as FilterIcon, 
  Bookmark as BookmarkIcon,
  Timer as TimerIcon,
  RestaurantMenu as MenuIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  overflow: 'hidden',
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -1,
});

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // Lighter overlay to see the video better
  zIndex: 0,
});

const Content = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: '40px',
    color: theme.palette.primary.main,
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <HeroSection>
        <VideoBackground
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/food-background.mp4" type="video/mp4" />
        </VideoBackground>
        <Overlay />
        <Container>
          <Content>
            <Typography variant="h2" component="h1" gutterBottom>
              Discover Amazing Recipes
            </Typography>
            <Typography variant="h5" gutterBottom>
              Find, save, and create your favorite recipes
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mt: 2 }}
            >
              Get Started
            </Button>
          </Content>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          About Us
        </Typography>

        {/* Our Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 500,
                color: 'primary.main',
                mb: 3 
              }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.secondary'
              }}>
                We believe that cooking and sharing meals brings people together. Our mission is to make cooking accessible, 
                enjoyable, and inspiring for everyone. We've created a platform where food enthusiasts can discover, save, 
                and share recipes from around the world. Whether you're a beginner cook or a seasoned chef, our community 
                is here to support your culinary journey. We're committed to helping you find recipes that match your dietary 
                preferences, time constraints, and skill level.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                height: '400px',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 3
              }}>
                <img
                  src="/images/mission-image.jpg"
                  alt="Our Mission"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Our Founding Story Section */}
        <Box>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{
                height: '400px',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 3
              }}>
                <img
                  src="/images/founding-story.jpg"
                  alt="Our Founding Story"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 500,
                color: 'primary.main',
                mb: 3 
              }}>
                Our Founding Story
              </Typography>
              <Typography variant="body1" sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.secondary'
              }}>
                Our journey began with a simple idea: to create a space where people could easily find and share their 
                favorite recipes. Founded by a group of food enthusiasts and tech innovators, we recognized the need for 
                a platform that not only provides recipes but also understands the unique preferences and requirements of 
                each user. Through careful development and community feedback, we've built a platform that combines the joy 
                of cooking with the convenience of modern technology.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 12 }}>
        <Container>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              mb: 6,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Features
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={4}>
                <IconWrapper>
                  <SearchIcon />
                </IconWrapper>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main'
                  }}
                >
                  Smart Search
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                  Find the perfect recipe with our intelligent search system. Filter by:
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>Cooking Time</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <MenuIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>Cuisine Type</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>Popularity</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={4}>
                <IconWrapper>
                  <FilterIcon />
                </IconWrapper>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main'
                  }}
                >
                  Allergen Filtering
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                  Customize your recipe search with our comprehensive allergen filtering system. 
                  Easily exclude ingredients you want to avoid and find recipes that match your dietary needs.
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                  Support for common allergens including nuts, dairy, gluten, shellfish, and more. 
                  Your dietary preferences, your choice.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard elevation={4}>
                <IconWrapper>
                  <BookmarkIcon />
                </IconWrapper>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main'
                  }}
                >
                  Save & Share
                </Typography>
                <Typography sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                  Create your personal recipe collection by saving your favorites. 
                  Build a digital cookbook that reflects your unique taste and cooking style.
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                  Organize recipes into categories, add personal notes, and share your 
                  culinary discoveries with friends and family.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Recipe Finder
              </Typography>
              <Typography variant="body2">
                © {new Date().getFullYear()} Recipe Finder. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit">Facebook</Button>
                <Button color="inherit">Twitter</Button>
                <Button color="inherit">Instagram</Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 