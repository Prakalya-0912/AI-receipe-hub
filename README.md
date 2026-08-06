# AI Recipe Hub 🍳

A full-stack web application that helps users discover, create, and manage recipes using AI-powered search and real recipe APIs.

## Features

### 🔐 Authentication System
- User registration and login
- Secure JWT-based authentication
- User profile management
- Password hashing with bcrypt

### 🔍 Recipe Discovery
- Search recipes by name/description
- Find recipes by available ingredients
- Integration with Spoonacular API
- Fallback mock data when API unavailable

### 👤 User Features
- Save favorite recipes
- Create custom recipes
- Dietary preferences management
- Personal recipe collection

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Beautiful gradient backgrounds
- Interactive components

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for security

### External APIs
- **Spoonacular API** for recipe data
- Fallback mock data system
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive UI**: Smooth animations and engaging user experience

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with tab switcher
│   ├── AIRecipeWriter.tsx  # AI recipe generation component
│   ├── IngredientFinder.tsx # Ingredient-based recipe finder
│   └── RecipeDisplay.tsx   # Recipe display component
├── types/
│   └── Recipe.ts           # Recipe type definitions
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
└── index.css              # Global styles with Tailwind
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Modern CSS Grid & Flexbox** for layouts

Frontend(https://ai-receipe-hub.onrender.com)

Backend(https://ai-receipe-hub-backend.onrender.com)

## Color Scheme

- **Primary**: Warm orange tones (#f2770a and variations)
- **Secondary**: Fresh green tones (#22c55e and variations)
- **Neutral**: Clean grays for text and backgrounds
- **Light Theme**: Soft, welcoming background gradients

## Future Enhancements

- Integration with real AI APIs (OpenAI, Claude, etc.)
- Recipe saving and favorites
- User authentication
- Recipe sharing functionality
- Nutritional information
- Shopping list generation
- Recipe rating and reviews

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
