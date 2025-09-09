import React, { useState, useEffect } from 'react';
import { Lightbulb, Wand2, Sparkles, Brain, Target, Clock, Users, DollarSign, Zap, RefreshCw, ChevronRight, Star, Key, Settings, Eye, EyeOff, AlertCircle } from 'lucide-react';

const IdeationTool = () => {
  const [formData, setFormData] = useState({
    domain: '',
    timeframe: '',
    budget: '',
    teamSize: '',
    skillLevel: '',
    target: '',
    constraints: ''
  });
  
  const [apiConfig, setApiConfig] = useState({
    provider: 'openai', // 'openai' or 'claude'
    apiKey: '',
    showKey: false
  });
  
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);

  const domains = [
    'Technology & Software',
    'Health & Medicine',
    'Education',
    'Environment & Sustainability',
    'Business & Finance',
    'Arts & Entertainment',
    'Social Impact',
    'IoT & Hardware',
    'Mobile Applications',
    'Web Development',
    'AI & Machine Learning',
    'Gaming'
  ];

  const timeframes = ['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year+'];
  const budgets = ['$0-100', '$100-500', '$500-2000', '$2000-5000', '$5000+'];
  const teamSizes = ['Solo', '2-3 people', '4-6 people', '7+ people'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApiConfigChange = (field, value) => {
    setApiConfig(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const createPrompt = () => {
    const constraints = [];
    if (formData.domain) constraints.push(`Domain: ${formData.domain}`);
    if (formData.timeframe) constraints.push(`Timeframe: ${formData.timeframe}`);
    if (formData.budget) constraints.push(`Budget: ${formData.budget}`);
    if (formData.teamSize) constraints.push(`Team size: ${formData.teamSize}`);
    if (formData.skillLevel) constraints.push(`Skill level: ${formData.skillLevel}`);
    if (formData.constraints) constraints.push(`Additional constraints: ${formData.constraints}`);

    return `Generate 5 innovative and feasible project ideas based on these constraints:

${constraints.join('\n')}

For each idea, provide:
1. A catchy, descriptive title
2. A detailed description (2-3 sentences) explaining what the project does and its value proposition
3. 3-4 relevant tags/technologies
4. Estimated difficulty level (Beginner, Intermediate, Advanced, or Expert)
5. Realistic timeline estimate

Format your response as a JSON array with this structure:
[
  {
    "title": "Project Title",
    "description": "Detailed description of the project...",
    "tags": ["tag1", "tag2", "tag3"],
    "difficulty": "Intermediate",
    "timeline": "2-3 months"
  }
]

Make sure the ideas are:
- Innovative and solve real problems
- Feasible within the given constraints
- Varied in approach and technology
- Practical and implementable
- Engaging and marketable`;
  };

  const callOpenAI = async (prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert innovation consultant and project ideation specialist. Generate creative, feasible project ideas based on user constraints.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const callClaude = async (prompt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiConfig.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Claude API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  };

  const generateIdeas = async () => {
    if (!apiConfig.apiKey.trim()) {
      setError('Please enter your API key in the settings');
      setShowApiConfig(true);
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setError('');
    
    const steps = [
      "Connecting to AI service...",
      "Analyzing your constraints...",
      "Generating creative concepts...",
      "Refining and structuring ideas...",
      "Finalizing recommendations..."
    ];
    
    try {
      const prompt = createPrompt();
      
      // Step through the process
      for (let i = 0; i < steps.length - 1; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setCurrentStep(steps.length - 1);
      
      // Make API call
      let response;
      if (apiConfig.provider === 'openai') {
        response = await callOpenAI(prompt);
      } else {
        response = await callClaude(prompt);
      }
      
      // Parse the JSON response
      let ideas;
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          ideas = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Raw response:', response);
        throw new Error('Failed to parse AI response. Please try again.');
      }
      
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
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
                <p className="text-gray-600 text-sm">Generate innovative project ideas with real AI power</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowApiConfig(!showApiConfig)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
              >
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">API Settings</span>
              </button>
              <div className="flex items-center space-x-2 text-purple-600">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Real AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Configuration Panel */}
        {showApiConfig && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">API Configuration</h3>
              </div>
              <button
                onClick={() => setShowApiConfig(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
                <select
                  value={apiConfig.provider}
                  onChange={(e) => handleApiConfigChange('provider', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="openai">OpenAI (GPT-4)</option>
                  <option value="claude">Anthropic (Claude)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={apiConfig.showKey ? "text" : "password"}
                    value={apiConfig.apiKey}
                    onChange={(e) => handleApiConfigChange('apiKey', e.target.value)}
                    placeholder={apiConfig.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleApiConfigChange('showKey', !apiConfig.showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {apiConfig.showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">API Key Instructions:</p>
                  <ul className="space-y-1 text-xs">
                    <li><strong>OpenAI:</strong> Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                    <li><strong>Claude:</strong> Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com</a></li>
                    <li>Your API key is stored locally and never sent to our servers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Define Your Project Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Domain</label>
                <select
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a domain...</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeframe
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select timeframe...</option>
                  {timeframes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select budget...</option>
                  {budgets.map(budget => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team Size
                </label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select team size...</option>
                  {teamSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Skill Level
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select skill level...</option>
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Additional Constraints */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Constraints or Preferences</label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) => handleInputChange('constraints', e.target.value)}
                  placeholder="e.g., must be mobile-first, should use specific technologies, environmental focus..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateIdeas}
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
                    <Wand2 className="h-5 w-5" />
                    <span>Generate AI Ideas</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">AI Generated Ideas</h2>
            </div>

            {isGenerating && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white animate-pulse" />
                </div>
                <p className="text-gray-600 mb-2">AI is thinking...</p>
                <p className="text-sm text-purple-600 font-medium">
                  {["Connecting to AI service...", "Analyzing your constraints...", "Generating creative concepts...", "Refining and structuring ideas...", "Finalizing recommendations..."][currentStep]}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-800"
                    style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!isGenerating && generatedIdeas.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="bg-gray-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No ideas generated yet</p>
                <p className="text-sm text-gray-400">Configure your API key and fill out the form to get AI-powered ideas!</p>
              </div>
            )}

            {generatedIdeas.length > 0 && (
              <div className="space-y-4">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-200 group">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {idea.title}
                      </h3>
                      <Star className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{idea.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {idea.tags && idea.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs">
                        {idea.difficulty && (
                          <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(idea.difficulty)}`}>
                            {idea.difficulty}
                          </span>
                        )}
                        {idea.timeline && (
                          <span className="text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {idea.timeline}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1 group/btn">
                        <span>Explore Idea</span>
                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={generateIdeas}
                  className="w-full mt-4 bg-white border-2 border-purple-200 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generate More Ideas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeationTool;