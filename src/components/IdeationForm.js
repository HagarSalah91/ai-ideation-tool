// src/components/IdeationForm.js
import React from 'react';
import { Target, Clock, DollarSign, Users, Zap, RefreshCw, Key, Settings, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { domains, timeframes, budgets, teamSizes, skillLevels } from '../constants/data.js';
import { getThemeClasses } from '../utils/helpers.js';

const IdeationForm = ({
  formData,
  apiConfig,
  isGenerating,
  currentStep,
  darkMode,
  showApiConfig,
  error,
  onInputChange,
  onApiConfigChange,
  onGenerateIdeas,
  onToggleApiConfig
}) => {
  const theme = getThemeClasses(darkMode);
  
  const generationSteps = [
    "Simulating AI processing...",
    "Analyzing your constraints...",
    "Generating creative concepts...",
    "Refining and structuring ideas...",
    "Finalizing recommendations..."
  ];

  return (
    <div className="space-y-8">
      {/* API Configuration Panel */}
      {showApiConfig && (
        <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${theme.card}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Key className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme.text.primary}`}>
                API Configuration
              </h3>
            </div>
            <button
              onClick={onToggleApiConfig}
              className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
                AI Provider
              </label>
              <select
                value={apiConfig.provider}
                onChange={(e) => onApiConfigChange('provider', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
              >
                <option value="demo">Demo Mode (No API Key Required)</option>
                <option value="openai">OpenAI (GPT-3.5/4)</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
                API Key
              </label>
              <div className="relative">
                <input
                  type={apiConfig.showKey ? "text" : "password"}
                  value={apiConfig.apiKey}
                  onChange={(e) => onApiConfigChange('apiKey', e.target.value)}
                  placeholder={
                    apiConfig.provider === 'demo' ? 'Not required for demo mode' : 'sk-...'
                  }
                  disabled={apiConfig.provider === 'demo'}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-100 disabled:bg-gray-700 disabled:text-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onApiConfigChange('showKey', !apiConfig.showKey)}
                  disabled={apiConfig.provider === 'demo'}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {apiConfig.showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-xl transition-colors duration-300 ${
            darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}>
            <div className="flex items-start space-x-2">
              <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                <p className="font-medium mb-1">Mode Information:</p>
                <ul className="space-y-1 text-xs">
                  {apiConfig.provider === 'demo' ? (
                    <>
                      <li><strong>Demo Mode:</strong> Uses pre-built example ideas and analysis - perfect for testing!</li>
                      <li>No API key required, works offline</li>
                      <li>Includes sample market research and implementation plans</li>
                    </>
                  ) : (
                    <>
                      <li><strong>OpenAI:</strong> Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a> - Free tier supported!</li>
                      <li>Your API key is stored locally and never sent to our servers</li>
                      <li>Provides real AI-powered ideas and comprehensive market analysis</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`border rounded-xl p-4 transition-colors duration-300 ${
          darkMode 
            ? 'bg-red-900/30 border-red-500/50' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`font-medium transition-colors duration-300 ${
              darkMode ? 'text-red-300' : 'text-red-800'
            }`}>
              Error
            </p>
          </div>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            darkMode ? 'text-red-400' : 'text-red-700'
          }`}>
            {error}
          </p>
        </div>
      )}

      {/* Input Form */}
      <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-colors duration-300 ${theme.card}`}>
        <div className="flex items-center space-x-3 mb-6">
          <Target className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <h2 className={`text-xl font-semibold transition-colors duration-300 ${theme.text.primary}`}>
            Define Your Project Parameters
          </h2>
        </div>

        <div className="space-y-6">
          {/* Domain */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
              Project Domain
            </label>
            <select
              value={formData.domain}
              onChange={(e) => onInputChange('domain', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
            >
              <option value="">Select a domain...</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-300 ${theme.text.secondary}`}>
              <Clock className="h-4 w-4 mr-2" />
              Timeframe
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => onInputChange('timeframe', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
            >
              <option value="">Select timeframe...</option>
              {timeframes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-300 ${theme.text.secondary}`}>
              <DollarSign className="h-4 w-4 mr-2" />
              Budget Range
            </label>
            <select
              value={formData.budget}
              onChange={(e) => onInputChange('budget', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
            >
              <option value="">Select budget...</option>
              {budgets.map(budget => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </select>
          </div>

          {/* Team Size */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-300 ${theme.text.secondary}`}>
              <Users className="h-4 w-4 mr-2" />
              Team Size
            </label>
            <select
              value={formData.teamSize}
              onChange={(e) => onInputChange('teamSize', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
            >
              <option value="">Select team size...</option>
              {teamSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div>
            <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-300 ${theme.text.secondary}`}>
              <Zap className="h-4 w-4 mr-2" />
              Skill Level
            </label>
            <select
              value={formData.skillLevel}
              onChange={(e) => onInputChange('skillLevel', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${theme.input}`}
            >
              <option value="">Select skill level...</option>
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Additional Constraints */}
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
              Additional Constraints or Preferences
            </label>
            <textarea
              value={formData.constraints}
              onChange={(e) => onInputChange('constraints', e.target.value)}
              placeholder="e.g., must be mobile-first, should use specific technologies, environmental focus..."
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={onGenerateIdeas}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating Ideas...</span>
              </>
            ) : (
              <>
                <Target className="h-5 w-5" />
                <span>Generate Project Ideas</span>
              </>
            )}
          </button>

          {/* Loading Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <p className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {generationSteps[currentStep]}
              </p>
              <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-800"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeationForm;