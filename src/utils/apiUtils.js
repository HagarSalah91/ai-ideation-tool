// src/utils/apiUtils.js
import { demoIdeas, demoExpansionTemplate } from '../constants/data.js';

export const createPrompt = (formData) => {
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

IMPORTANT: Respond with ONLY a valid JSON array in this exact format, with no additional text, explanations, or markdown formatting:

[
  {
    "title": "Project Title",
    "description": "Detailed description of the project explaining what it does and its value proposition...",
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "difficulty": "Intermediate",
    "timeline": "2-3 months"
  },
  {
    "title": "Another Project Title",
    "description": "Another detailed description...",
    "tags": ["tag1", "tag2", "tag3"],
    "difficulty": "Beginner",
    "timeline": "1 month"
  }
]

Make sure the ideas are:
- Innovative and solve real problems
- Feasible within the given constraints
- Varied in approach and technology
- Practical and implementable
- Engaging and marketable

Return ONLY the JSON array, no other text.`;
};

export const createExpansionPrompt = (idea) => {
  return `Provide a comprehensive analysis and implementation plan for this project idea: "${idea.title}"

Description: ${idea.description}
Tags: ${idea.tags.join(', ')}
Difficulty: ${idea.difficulty}
Timeline: ${idea.timeline}

Please provide a detailed analysis in the following JSON format:

{
  "marketResearch": {
    "marketSize": "Description of target market size and potential",
    "competitors": ["List of 3-4 main competitors or similar solutions"],
    "trends": "Current market trends and opportunities",
    "targetAudience": "Detailed description of target users/customers"
  },
  "valueProposition": {
    "problemSolved": "Clear description of the problem this solves",
    "uniqueValue": "What makes this solution unique and valuable",
    "benefits": ["3-4 key benefits for users"],
    "whyNeeded": "Explanation of why this product is needed now"
  },
  "implementation": {
    "materials": ["List of required tools, technologies, and resources"],
    "estimatedCost": "Breakdown of development costs",
    "detailedTimeframe": "Phase-by-phase timeline with milestones",
    "steps": ["Step-by-step implementation plan with 6-8 key steps"]
  },
  "risks": ["2-3 potential challenges or risks"],
  "successMetrics": ["3-4 key metrics to measure success"]
}

Provide realistic, actionable information based on current market conditions and technology capabilities. Return ONLY the JSON object, no other text.`;
};

export const callOpenAI = async (prompt, apiKey) => {
  const modelsToTry = ['gpt-3.5-turbo', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4'];
  
  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert innovation consultant, market researcher, and project planning specialist. Provide detailed, realistic, and actionable information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: model === 'gpt-3.5-turbo' ? 2000 : 3000
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        const errorData = await response.json();
        
        if (errorData.error?.code === 'model_not_found' || 
            errorData.error?.message?.includes('model') ||
            errorData.error?.message?.includes('access')) {
          if (i === modelsToTry.length - 1) {
            throw new Error(`No available OpenAI models found. Please check your API key permissions.`);
          }
          continue;
        } else {
          throw new Error(errorData.error?.message || 'OpenAI API request failed');
        }
      }
    } catch (error) {
      if (i === modelsToTry.length - 1) {
        throw error;
      }
      continue;
    }
  }
};

export const generateDemoIdeas = async (formData) => {
  const filteredIdeas = [...demoIdeas];
  let ideas = filteredIdeas;
  
  if (formData.skillLevel) {
    const skillOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2, 'Expert': 3 };
    const userSkillLevel = skillOrder[formData.skillLevel] || 1;
    ideas = ideas.filter(idea => 
      skillOrder[idea.difficulty] <= userSkillLevel + 1
    );
  }
  
  if (formData.timeframe) {
    const timeOrder = { '1-2 weeks': 0, '1 month': 1, '2-3 months': 2, '6 months': 3, '1 year+': 4 };
    const userTime = timeOrder[formData.timeframe] || 2;
    ideas = ideas.filter(idea => 
      timeOrder[idea.timeline] <= userTime + 1
    );
  }
  
  return ideas.sort(() => Math.random() - 0.5).slice(0, 5);
};

export const generateDemoExpansion = (idea) => {
  return { ...demoExpansionTemplate };
};

export const parseApiResponse = (response, isArray = true) => {
  const cleanResponse = response.trim()
    .replace(/```json\s*/g, '')
    .replace(/```\s*$/g, '')
    .replace(/```\s*/g, '');
  
  const jsonMatch = isArray ? 
    cleanResponse.match(/\[[\s\S]*\]/) : 
    cleanResponse.match(/\{[\s\S]*\}/);
    
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    throw new Error(`No valid JSON ${isArray ? 'array' : 'object'} found in AI response`);
  }
};