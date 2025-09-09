// src/constants/data.js

export const domains = [
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

export const timeframes = ['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year+'];
export const budgets = ['$0-100', '$100-500', '$500-2000', '$2000-5000', '$5000+'];
export const teamSizes = ['Solo', '2-3 people', '4-6 people', '7+ people'];
export const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const demoIdeas = [
  {
    title: "Smart Campus Navigation System",
    description: "An AR-powered mobile app that helps students navigate large university campuses, find available study spaces, and locate friends in real-time using GPS and crowd-sourced data.",
    tags: ["Mobile", "AR", "GPS", "Social"],
    difficulty: "Intermediate",
    timeline: "2-3 months"
  },
  {
    title: "Sustainable Habit Tracker",
    description: "A gamified application that helps users build eco-friendly habits with community challenges, carbon footprint tracking, and local green business partnerships for rewards.",
    tags: ["Sustainability", "Gamification", "Social", "Mobile"],
    difficulty: "Beginner",
    timeline: "1 month"
  },
  {
    title: "AI-Powered Study Buddy",
    description: "An intelligent tutoring system that adapts to individual learning styles, generates personalized quizzes, and provides real-time feedback using machine learning algorithms.",
    tags: ["AI", "Education", "Machine Learning", "Personalization"],
    difficulty: "Advanced",
    timeline: "6 months"
  },
  {
    title: "Local Event Discovery Engine",
    description: "A recommendation platform that suggests local events, meetups, and activities based on user interests, social connections, and past attendance patterns with smart filtering.",
    tags: ["Social", "Recommendation", "Local", "Web"],
    difficulty: "Intermediate",
    timeline: "2-3 months"
  },
  {
    title: "Micro-Investment Platform for Students",
    description: "A mobile platform that allows students to invest spare change from purchases into diversified portfolios while providing educational content about financial literacy and market trends.",
    tags: ["FinTech", "Education", "Mobile", "Investment"],
    difficulty: "Advanced",
    timeline: "6 months"
  }
];

export const demoExpansionTemplate = {
  marketResearch: {
    marketSize: "Target market estimated at $2.5B+ with 15% annual growth in the digital solution space",
    competitors: ["Existing Solution A", "Traditional Method B", "Emerging Platform C"],
    trends: "Growing demand for digital solutions, increased mobile adoption, and focus on user experience",
    targetAudience: "Primary users aged 18-35, tech-savvy individuals seeking efficient solutions"
  },
  valueProposition: {
    problemSolved: "Addresses the inefficiency and frustration users face with current manual processes",
    uniqueValue: "Combines cutting-edge technology with user-centered design for seamless experience",
    benefits: ["Save 60% time on routine tasks", "Improve accuracy by 85%", "Enhance user satisfaction", "Reduce operational costs"],
    whyNeeded: "Current solutions are outdated, inefficient, and don't meet modern user expectations"
  },
  implementation: {
    materials: ["React/React Native framework", "Cloud hosting (AWS/Vercel)", "Database (PostgreSQL)", "API integrations", "Design tools (Figma)", "Testing frameworks"],
    estimatedCost: "$2,500 - $8,000 for initial development (varies by features and complexity)",
    detailedTimeframe: "Phase 1: Planning & Design (2 weeks) → Phase 2: Core Development (4-6 weeks) → Phase 3: Testing & Refinement (2 weeks) → Phase 4: Launch & Optimization (1-2 weeks)",
    steps: [
      "Market research and user interviews",
      "Create wireframes and user flow diagrams", 
      "Design UI/UX and create prototype",
      "Set up development environment and architecture",
      "Develop core features and functionality",
      "Integrate APIs and third-party services",
      "Conduct testing and gather user feedback",
      "Deploy to production and monitor performance"
    ]
  },
  risks: ["Market competition from established players", "Technical challenges with scalability", "User adoption slower than expected"],
  successMetrics: ["Monthly active users", "User retention rate", "Feature adoption rate", "Customer satisfaction score"]
};