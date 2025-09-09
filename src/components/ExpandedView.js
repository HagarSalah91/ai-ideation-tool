// src/components/ExpandedView.js
import React from 'react';
import { 
  ArrowLeft, TrendingUp, Star, Package, Play, CheckCircle, 
  AlertCircle, Target, Brain, Sun, Moon, Heart
} from 'lucide-react';
import { getDifficultyColor, getThemeClasses } from '../utils/helpers.js';

// Safe rendering utility functions
const SafeText = ({ content, fallback = "Information not available" }) => {
  if (!content) return <span className="italic opacity-75">{fallback}</span>;
  
  if (typeof content === 'string') {
    return <span>{content}</span>;
  }
  
  if (typeof content === 'object' && content !== null) {
    return <span>{JSON.stringify(content, null, 2)}</span>;
  }
  
  return <span>{String(content)}</span>;
};

const SafeList = ({ items, fallback = ["No items available"], className = "" }) => {
  const safeItems = Array.isArray(items) && items.length > 0 ? items : fallback;
  
  return (
    <ul className={`space-y-1 ${className}`}>
      {safeItems.map((item, index) => (
        <li key={index} className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
          <SafeText content={item} />
        </li>
      ))}
    </ul>
  );
};

const SafeBenefitsList = ({ benefits, className = "" }) => {
  const safeBenefits = Array.isArray(benefits) && benefits.length > 0 
    ? benefits 
    : ["Benefits information not available"];
  
  return (
    <ul className={`space-y-1 ${className}`}>
      {safeBenefits.map((benefit, index) => (
        <li key={index} className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <SafeText content={benefit} />
        </li>
      ))}
    </ul>
  );
};

const SafeTimeframe = ({ timeframe, className = "", darkMode = false }) => {
  if (!timeframe) {
    return <span className={`italic opacity-75 ${className}`}>Timeline not available</span>;
  }
  
  if (typeof timeframe === 'string') {
    return <span className={className}>{timeframe}</span>;
  }
  
  if (typeof timeframe === 'object' && timeframe !== null) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Object.entries(timeframe).map(([phase, details], index) => {
          // Handle if details is an object with duration/milestone structure
          if (typeof details === 'object' && details !== null) {
            return (
              <div key={index} className={`border-l-3 border-purple-300 pl-4 py-2 rounded-r-lg ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <div className={`font-semibold text-sm mb-1 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {phase}
                </div>
                {details.duration && (
                  <div className={`text-xs mb-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Duration: {details.duration}
                  </div>
                )}
                {details.milestone && (
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {details.milestone}
                  </div>
                )}
                {/* Handle other possible fields */}
                {Object.entries(details).map(([key, value]) => {
                  if (key !== 'duration' && key !== 'milestone' && value) {
                    return (
                      <div key={key} className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {key}: {String(value)}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }
          
          // Handle simple phase: description format
          return (
            <div key={index} className="border-l-3 border-purple-300 pl-4 py-2">
              <div className={`font-semibold text-sm ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {phase}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <SafeText content={details} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  return <span className={className}>{String(timeframe)}</span>;
};

const SafeStepsList = ({ steps, className = "" }) => {
  const safeSteps = Array.isArray(steps) && steps.length > 0 
    ? steps 
    : ["Implementation steps not available"];
  
  return (
    <div className={`space-y-4 ${className}`}>
      {safeSteps.map((step, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-purple-600 text-white">
            {index + 1}
          </div>
          <div className="text-sm">
            <SafeText content={step} />
          </div>
        </div>
      ))}
    </div>
  );
};

const DataSection = ({ title, icon: Icon, children, theme, darkMode }) => (
  <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-colors duration-300 ${theme.card}`}>
    <div className="flex items-center space-x-3 mb-6">
      <Icon className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      <h3 className={`text-xl font-semibold transition-colors duration-300 ${theme.text.primary}`}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const InfoBlock = ({ title, content, theme, type = "text", darkMode = false }) => (
  <div>
    <h4 className={`font-medium mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
      {title}
    </h4>
    <div className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
      {type === "list" && <SafeList items={content} className={theme.text.muted} />}
      {type === "benefits" && <SafeBenefitsList benefits={content} className={theme.text.muted} />}
      {type === "timeframe" && <SafeTimeframe timeframe={content} className={theme.text.muted} darkMode={darkMode} />}
      {type === "steps" && <SafeStepsList steps={content} className={theme.text.muted} />}
      {type === "text" && <SafeText content={content} />}
    </div>
  </div>
);

const ExpandedView = ({
  expandedIdea,
  expandedData,
  isExpanding,
  currentStep,
  darkMode,
  onBack,
  onToggleDarkMode,
  onToggleFavorite,
  isFavorited = false
}) => {
  const theme = getThemeClasses(darkMode);
  
  const expansionSteps = [
    "Connecting to AI research assistant...",
    "Conducting market research...",
    "Analyzing value proposition...",
    "Calculating implementation details...",
    "Finalizing comprehensive analysis..."
  ];

  // Safe data extraction with fallbacks
  const safeData = expandedData ? {
    marketResearch: {
      marketSize: expandedData.marketResearch?.marketSize || "Market analysis not available",
      competitors: expandedData.marketResearch?.competitors || [],
      trends: expandedData.marketResearch?.trends || "Trend analysis not available",
      targetAudience: expandedData.marketResearch?.targetAudience || "Target audience analysis not available"
    },
    valueProposition: {
      problemSolved: expandedData.valueProposition?.problemSolved || "Problem analysis not available",
      uniqueValue: expandedData.valueProposition?.uniqueValue || "Value proposition not available",
      benefits: expandedData.valueProposition?.benefits || [],
      whyNeeded: expandedData.valueProposition?.whyNeeded || "Market need analysis not available"
    },
    implementation: {
      materials: expandedData.implementation?.materials || [],
      estimatedCost: expandedData.implementation?.estimatedCost || "Cost analysis not available",
      detailedTimeframe: expandedData.implementation?.detailedTimeframe || "Timeline not available",
      steps: expandedData.implementation?.steps || []
    },
    risks: expandedData.risks || [],
    successMetrics: expandedData.successMetrics || []
  } : null;

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
            {/* Left side - Back button and Favorite button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${theme.button.secondary}`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Ideas</span>
              </button>

              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(expandedIdea, expandedData)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isFavorited
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : theme.button.secondary
                  }`}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </span>
                </button>
              )}
            </div>
            
            {/* Center - Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Idea Analysis
                </h1>
                <p className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                  Comprehensive market research and implementation plan
                </p>
              </div>
            </div>

            {/* Right side - Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Idea Header */}
        <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 mb-8 transition-colors duration-300 ${theme.card}`}>
          <div className="flex items-start justify-between mb-4">
            <h2 className={`text-3xl font-bold transition-colors duration-300 ${theme.text.primary}`}>
              {expandedIdea?.title || "Untitled Project"}
            </h2>
            {expandedIdea?.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(expandedIdea.difficulty, darkMode)}`}>
                {expandedIdea.difficulty}
              </span>
            )}
          </div>
          
          <p className={`text-lg mb-4 transition-colors duration-300 ${theme.text.secondary}`}>
            {expandedIdea?.description || "No description available"}
          </p>
          
          {expandedIdea?.tags && expandedIdea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {expandedIdea.tags.map((tag, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isExpanding && (
          <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-colors duration-300 ${theme.card}`}>
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              <p className={`mb-2 transition-colors duration-300 ${theme.text.secondary}`}>
                AI is conducting comprehensive analysis...
              </p>
              <p className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {expansionSteps[currentStep] || "Processing..."}
              </p>
              <div className={`w-full rounded-full h-2 mt-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-800"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expanded Analysis */}
        {safeData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market Research */}
            <DataSection title="Market Research" icon={TrendingUp} theme={theme} darkMode={darkMode}>
              <div className="space-y-6">
                <InfoBlock 
                  title="Market Size & Opportunity" 
                  content={safeData.marketResearch.marketSize} 
                  theme={theme}
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Key Competitors" 
                  content={safeData.marketResearch.competitors} 
                  theme={theme} 
                  type="list"
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Market Trends" 
                  content={safeData.marketResearch.trends} 
                  theme={theme}
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Target Audience" 
                  content={safeData.marketResearch.targetAudience} 
                  theme={theme}
                  darkMode={darkMode}
                />
              </div>
            </DataSection>

            {/* Value Proposition */}
            <DataSection title="Value Proposition" icon={Star} theme={theme} darkMode={darkMode}>
              <div className="space-y-6">
                <InfoBlock 
                  title="Problem Solved" 
                  content={safeData.valueProposition.problemSolved} 
                  theme={theme}
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Unique Value" 
                  content={safeData.valueProposition.uniqueValue} 
                  theme={theme}
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Key Benefits" 
                  content={safeData.valueProposition.benefits} 
                  theme={theme} 
                  type="benefits"
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Why Needed Now" 
                  content={safeData.valueProposition.whyNeeded} 
                  theme={theme}
                  darkMode={darkMode}
                />
              </div>
            </DataSection>

            {/* Implementation Plan */}
            <DataSection title="Implementation Details" icon={Package} theme={theme} darkMode={darkMode}>
              <div className="space-y-6">
                <InfoBlock 
                  title="Required Materials & Tools" 
                  content={safeData.implementation.materials} 
                  theme={theme} 
                  type="list"
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Estimated Cost" 
                  content={safeData.implementation.estimatedCost} 
                  theme={theme}
                  darkMode={darkMode}
                />
                <InfoBlock 
                  title="Detailed Timeframe" 
                  content={safeData.implementation.detailedTimeframe} 
                  theme={theme} 
                  type="timeframe"
                  darkMode={darkMode}
                />
              </div>
            </DataSection>

            {/* Implementation Steps */}
            <DataSection title="Step-by-Step Plan" icon={Play} theme={theme} darkMode={darkMode}>
              <InfoBlock 
                title="" 
                content={safeData.implementation.steps} 
                theme={theme} 
                type="steps"
                darkMode={darkMode}
              />
            </DataSection>

            {/* Risks & Success Metrics */}
            <div className={`lg:col-span-2 backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-colors duration-300 ${theme.card}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${theme.text.primary}`}>
                      Potential Risks
                    </h4>
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                    <SafeList 
                      items={safeData.risks} 
                      fallback={["Risk analysis not available"]}
                      className={theme.text.muted}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${theme.text.primary}`}>
                      Success Metrics
                    </h4>
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${theme.text.muted}`}>
                    <SafeList 
                      items={safeData.successMetrics} 
                      fallback={["Success metrics not available"]}
                      className={theme.text.muted}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isExpanding && !safeData && (
          <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 text-center transition-colors duration-300 ${theme.card}`}>
            <AlertCircle className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${theme.text.primary}`}>
              Analysis Not Available
            </h3>
            <p className={`transition-colors duration-300 ${theme.text.muted}`}>
              Unable to load the detailed analysis for this idea. Please try expanding the idea again.
            </p>
            <button
              onClick={onBack}
              className={`mt-4 px-6 py-2 rounded-lg transition-all duration-300 ${theme.button.secondary}`}
            >
              Return to Ideas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandedView;