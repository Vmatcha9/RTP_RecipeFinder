# Recipe Finder

A modern web application for discovering and saving recipes using the Edamam API.

## Features

- User authentication (login/register)
- Recipe search with filters
- Save favorite recipes
- View recipe details
- Filter by cuisine type, cooking time, and allergens
- Responsive design
- Modern UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Edamam API credentials

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/recipe-finder
   JWT_SECRET=your-secret-key-here
   EDAMAM_APP_ID=your-edamam-app-id
   EDAMAM_APP_KEY=your-edamam-app-key
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Start the backend server:
   ```bash
   npm run server
   ```

## API Documentation

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Recipes

- GET `/api/recipes/search` - Search recipes with filters
- GET `/api/recipes/saved` - Get saved recipes
- POST `/api/recipes/save/:id` - Save a recipe
- GET `/api/recipes/recent` - Get recently viewed recipes
- POST `/api/recipes/recent/:id` - Add to recently viewed

## Technologies Used

- React
- Material-UI
- Node.js
- Express
- MongoDB
- Edamam API
- JWT Authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 