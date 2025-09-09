// src/components/IdeationTool.js
import React, { useState, useEffect } from 'react';
import { 
  Brain, Lightbulb, ChevronRight, Sparkles, Settings, Sun, Moon,
  Heart, Bookmark, Trash2, Calendar
} from 'lucide-react';
import IdeationForm from './IdeationForm.js';
import ExpandedView from './ExpandedView.js';
import { 
  createPrompt, 
  createExpansionPrompt, 
  callOpenAI, 
  generateDemoIdeas, 
  generateDemoExpansion,
  parseApiResponse
} from '../utils/apiUtils.js';
import { 
  loadDarkModePreference, 
  saveDarkModePreference, 
  loadFavorites,
  addToFavorites,
  removeFromFavorites,
  isIdeaFavorited,
  generateIdeaId,
  getDifficultyColor,
  getThemeClasses,
  defaultFormData,
  defaultApiConfig,
  delay,
  getGenerationSteps,
  getExpansionSteps,
  getApiGenerationSteps,
  formatDate
} from '../utils/helpers.js';

const IdeationTool = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [apiConfig, setApiConfig] = useState(defaultApiConfig);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandedData, setExpandedData] = useState(null);
  
  // New favorites state
  const [favorites, setFavorites] = useState([]);
  const [currentView, setCurrentView] = useState('ideas'); // 'ideas' or 'favorites'

  // Load preferences and favorites on component mount
  useEffect(() => {
    const savedMode = loadDarkModePreference();
    const savedFavorites = loadFavorites();
    setDarkMode(savedMode);
    setFavorites(savedFavorites);
  }, []);

  // Save dark mode preference whenever it changes
  useEffect(() => {
    saveDarkModePreference(darkMode);
  }, [darkMode]);

  const theme = getThemeClasses(darkMode);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApiConfigChange = (field, value) => {
    setApiConfig(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFavorite = (idea) => {
    const ideaId = generateIdeaId(idea);
    if (isIdeaFavorited(idea)) {
      const updatedFavorites = removeFromFavorites(ideaId);
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = addToFavorites(idea);
      setFavorites(updatedFavorites);
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites? This action cannot be undone.')) {
      setFavorites([]);
      try {
        localStorage.removeItem('ai-ideation-favorites');
      } catch (error) {
        console.warn('Error clearing favorites:', error);
      }
    }
  };

  const expandIdea = async (idea) => {
    setExpandedIdea(idea);
    setIsExpanding(true);
    setExpandedData(null);
    
    try {
      if (apiConfig.provider === 'demo') {
        const steps = getExpansionSteps();
        
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          await delay(800);
        }
        
        const expansion = generateDemoExpansion(idea);
        setExpandedData(expansion);
      } else {
        if (!apiConfig.apiKey.trim()) {
          setError('Please enter your OpenAI API key to expand ideas');
          setShowApiConfig(true);
          setIsExpanding(false);
          return;
        }
        
        const steps = getExpansionSteps();
        const prompt = createExpansionPrompt(idea);
        
        for (let i = 0; i < steps.length - 1; i++) {
          setCurrentStep(i);
          await delay(1200);
        }
        
        setCurrentStep(steps.length - 1);
        
        const response = await callOpenAI(prompt, apiConfig.apiKey);
        const expansionData = parseApiResponse(response, false);
        
        setExpandedData(expansionData);
      }
    } catch (error) {
      console.error('Error expanding idea:', error);
      setError(error.message || 'Failed to expand idea. Please try again.');
    } finally {
      setIsExpanding(false);
    }
  };

  const generateIdeas = async () => {
    if (apiConfig.provider === 'demo') {
      setIsGenerating(true);
      setCurrentStep(0);
      setError('');
      
      const steps = getGenerationSteps();
      
      try {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          await delay(800);
        }
        
        const ideas = await generateDemoIdeas(formData);
        setGeneratedIdeas(ideas);
        
      } catch (error) {
        console.error('Error generating demo ideas:', error);
        setError('Failed to generate demo ideas. Please try again.');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (!apiConfig.apiKey.trim()) {
      setError('Please enter your OpenAI API key in the settings or try Demo Mode');
      setShowApiConfig(true);
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setError('');
    
    const steps = getApiGenerationSteps();
    
    try {
      const prompt = createPrompt(formData);
      
      for (let i = 0; i < steps.length - 1; i++) {
        setCurrentStep(i);
        await delay(1000);
      }
      
      setCurrentStep(steps.length - 1);
      
      const response = await callOpenAI(prompt, apiConfig.apiKey);
      let ideas = parseApiResponse(response, true);
      
      if (!Array.isArray(ideas) || ideas.length === 0) {
        throw new Error('No ideas generated. Please try again with different parameters.');
      }
      
      setGeneratedIdeas(ideas);
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      setError(error.message || 'Failed to generate ideas. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const backToIdeas = () => {
    setExpandedIdea(null);
    setExpandedData(null);
    setIsExpanding(false);
  };

  const IdeaCard = ({ idea, showFavoriteDate = false }) => {
    const isFavorited = isIdeaFavorited(idea);
    
    return (
      <div
        className={`border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group relative ${
          darkMode 
            ? 'border-gray-600 hover:border-purple-500/50' 
            : 'border-gray-200 hover:border-purple-300'
        }`}
      >
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(idea);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            isFavorited
              ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
              : darkMode
                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        <div 
          className="cursor-pointer pr-12"
          onClick={() => expandIdea(idea)}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className={`font-semibold text-lg group-hover:text-purple-600 transition-colors duration-200 ${theme.text.primary}`}>
              {idea.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(idea.difficulty, darkMode)}`}>
                {idea.difficulty}
              </span>
              <ChevronRight className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>
          
          <p className={`text-sm mb-3 transition-colors duration-300 ${theme.text.muted}`}>
            {idea.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {idea.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-purple-900/30 text-purple-300' 
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
              {idea.tags.length > 3 && (
                <span className={`px-2 py-1 rounded-md text-xs transition-colors duration-300 ${theme.text.muted}`}>
                  +{idea.tags.length - 3} more
                </span>
              )}
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium transition-colors duration-300 ${theme.text.muted}`}>
                {idea.timeline}
              </span>
              {showFavoriteDate && idea.favoritedAt && (
                <div className={`text-xs mt-1 transition-colors duration-300 ${theme.text.muted}`}>
                  Saved: {formatDate(idea.favoritedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (expandedIdea) {
    return (
      <ExpandedView
        expandedIdea={expandedIdea}
        expandedData={expandedData}
        isExpanding={isExpanding}
        currentStep={currentStep}
        darkMode={darkMode}
        onBack={backToIdeas}
        onToggleDarkMode={toggleDarkMode}
        onToggleFavorite={toggleFavorite}
        isFavorited={isIdeaFavorited(expandedIdea)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.background}`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b sticky top-0 z-50 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-900/80 border-purple-800' 
          : 'bg-white/80 border-purple-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Ideation Tool
                </h1>
                <p className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                  Generate innovative project ideas with comprehensive analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setShowApiConfig(!showApiConfig)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${theme.button.secondary}`}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">API Settings</span>
              </button>
              <div className={`flex items-center space-x-2 transition-colors duration-300 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {apiConfig.provider === 'demo' ? 'Demo Mode' : 'OpenAI Powered'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <IdeationForm
            formData={formData}
            apiConfig={apiConfig}
            isGenerating={isGenerating}
            currentStep={currentStep}
            darkMode={darkMode}
            showApiConfig={showApiConfig}
            error={error}
            onInputChange={handleInputChange}
            onApiConfigChange={handleApiConfigChange}
            onGenerateIdeas={generateIdeas}
            onToggleApiConfig={() => setShowApiConfig(!showApiConfig)}
          />

          {/* Ideas/Favorites Display */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-colors duration-300 ${theme.card}`}>
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center space-x-1 rounded-lg p-1 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setCurrentView('ideas')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'ideas'
                      ? `${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-white text-purple-600'} shadow-sm`
                      : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
                  }`}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Generated Ideas</span>
                </button>
                <button
                  onClick={() => setCurrentView('favorites')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'favorites'
                      ? `${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-white text-purple-600'} shadow-sm`
                      : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites ({favorites.length})</span>
                </button>
              </div>

              {currentView === 'favorites' && favorites.length > 0 && (
                <button
                  onClick={clearAllFavorites}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    darkMode
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                  title="Clear all favorites"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Content based on current view */}
            {currentView === 'ideas' ? (
              // Generated Ideas View
              generatedIdeas.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center ${
                    darkMode ? 'from-purple-900/30 to-blue-900/30' : ''
                  }`}>
                    <Lightbulb className={`h-12 w-12 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <p className={`mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
                    No ideas generated yet
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                    Fill out the form and click "Generate Project Ideas" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <IdeaCard key={index} idea={idea} />
                  ))}
                </div>
              )
            ) : (
              // Favorites View
              favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center ${
                    darkMode ? 'from-red-900/30 to-pink-900/30' : ''
                  }`}>
                    <Heart className={`h-12 w-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <p className={`mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
                    No favorites yet
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                    Click the heart icon on any idea to save it to your favorites
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((idea, index) => (
                    <IdeaCard key={idea.id || index} idea={idea} showFavoriteDate={true} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeationTool;