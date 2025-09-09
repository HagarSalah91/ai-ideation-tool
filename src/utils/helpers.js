// src/utils/helpers.js

export const getDifficultyColor = (difficulty, darkMode) => {
  const colors = darkMode ? {
    'Beginner': 'bg-green-900/30 text-green-300 border-green-500/30',
    'Intermediate': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
    'Advanced': 'bg-orange-900/30 text-orange-300 border-orange-500/30',
    'Expert': 'bg-red-900/30 text-red-300 border-red-500/30'
  } : {
    'Beginner': 'bg-green-100 text-green-800 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Advanced': 'bg-orange-100 text-orange-800 border-orange-200',
    'Expert': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[difficulty] || (darkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200');
};

// Dark mode persistence
export const loadDarkModePreference = () => {
  try {
    const savedMode = localStorage.getItem('ai-ideation-darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  } catch (error) {
    console.warn('Error loading dark mode preference:', error);
    return false;
  }
};

export const saveDarkModePreference = (darkMode) => {
  try {
    localStorage.setItem('ai-ideation-darkMode', JSON.stringify(darkMode));
  } catch (error) {
    console.warn('Error saving dark mode preference:', error);
  }
};

// Favorites persistence
export const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem('ai-ideation-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.warn('Error loading favorites:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem('ai-ideation-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.warn('Error saving favorites:', error);
  }
};

export const addToFavorites = (idea, analysisData = null) => {
  const favorites = loadFavorites();
  const ideaWithId = { 
    ...idea, 
    id: generateIdeaId(idea), 
    favoritedAt: new Date().toISOString(),
    analysisData: analysisData // Store the analysis if provided
  };
  
  // Check if already exists
  const existingIndex = favorites.findIndex(fav => fav.id === ideaWithId.id);
  if (existingIndex === -1) {
    const updatedFavorites = [...favorites, ideaWithId];
    saveFavorites(updatedFavorites);
    return updatedFavorites;
  } else {
    // Update existing favorite with analysis data if provided
    if (analysisData) {
      favorites[existingIndex] = { ...favorites[existingIndex], analysisData, updatedAt: new Date().toISOString() };
      saveFavorites(favorites);
    }
  }
  return favorites;
};

export const removeFromFavorites = (ideaId) => {
  const favorites = loadFavorites();
  const updatedFavorites = favorites.filter(fav => fav.id !== ideaId);
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};

export const isIdeaFavorited = (idea) => {
  const favorites = loadFavorites();
  const ideaId = generateIdeaId(idea);
  return favorites.some(fav => fav.id === ideaId);
};

export const getFavoriteAnalysis = (idea) => {
  const favorites = loadFavorites();
  const ideaId = generateIdeaId(idea);
  const favorite = favorites.find(fav => fav.id === ideaId);
  return favorite?.analysisData || null;
};

export const updateFavoriteAnalysis = (idea, analysisData) => {
  const favorites = loadFavorites();
  const ideaId = generateIdeaId(idea);
  const existingIndex = favorites.findIndex(fav => fav.id === ideaId);
  
  if (existingIndex !== -1) {
    favorites[existingIndex] = { 
      ...favorites[existingIndex], 
      analysisData, 
      updatedAt: new Date().toISOString() 
    };
    saveFavorites(favorites);
    return favorites;
  }
  return favorites;
};

export const generateIdeaId = (idea) => {
  // Generate consistent ID based on idea content
  const content = `${idea.title || ''}-${idea.description || ''}-${idea.difficulty || ''}`;
  
  // Simple hash function instead of btoa() to avoid Unicode issues
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive number and then to base36 string
  const id = Math.abs(hash).toString(36);
  return id.substring(0, 16).padStart(8, '0');
};

export const getGenerationSteps = () => [
  "Simulating AI processing...",
  "Analyzing your constraints...",
  "Generating creative concepts...",
  "Refining and structuring ideas...",
  "Finalizing recommendations..."
];

export const getExpansionSteps = () => [
  "Connecting to AI research assistant...",
  "Conducting market research...",
  "Analyzing value proposition...",
  "Calculating implementation details...",
  "Finalizing comprehensive analysis..."
];

export const getApiGenerationSteps = () => [
  "Connecting to AI service...",
  "Analyzing your constraints...",
  "Generating creative concepts...",
  "Refining and structuring ideas...",
  "Finalizing recommendations..."
];

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const validateFormData = (formData) => {
  const errors = [];
  
  if (!formData.domain) {
    errors.push('Please select a project domain');
  }
  
  if (!formData.timeframe) {
    errors.push('Please select a timeframe');
  }
  
  if (!formData.budget) {
    errors.push('Please select a budget range');
  }
  
  if (!formData.teamSize) {
    errors.push('Please select team size');
  }
  
  if (!formData.skillLevel) {
    errors.push('Please select skill level');
  }
  
  return errors;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Theme utilities
export const getThemeClasses = (darkMode) => ({
  background: darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
  
  card: darkMode 
    ? 'bg-gray-900/90 border-purple-800' 
    : 'bg-white/90 border-purple-100',
    
  text: {
    primary: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondary: darkMode ? 'text-gray-300' : 'text-gray-700',
    muted: darkMode ? 'text-gray-400' : 'text-gray-600',
  },
  
  input: darkMode 
    ? 'bg-gray-800 border-gray-600 text-gray-100' 
    : 'bg-white border-gray-300 text-gray-900',
    
  button: {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
    secondary: darkMode 
      ? 'bg-gray-800 text-purple-400 hover:bg-gray-700 border border-purple-500/30' 
      : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
  }
});

export const defaultFormData = {
  domain: '',
  timeframe: '',
  budget: '',
  teamSize: '',
  skillLevel: '',
  constraints: ''
};

export const defaultApiConfig = {
  provider: 'demo',
  apiKey: '',
  showKey: false
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Unknown date';
  }
};