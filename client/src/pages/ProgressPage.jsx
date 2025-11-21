import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { 
  ArrowLeft,
  BarChart2,
  Home,
  Activity,
  AlertTriangle,
  Users,
  Zap,
  Info,
  TrendingUp,
  TrendingDown,
  Send,
  MessageSquare,
  Heart,
  Clock,
  Award,
  BookOpen,
  Activity as ActivityIcon
} from 'react-feather';
import { ASSESSMENT_TYPES, STORAGE_KEY } from '../constants/assessmentTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// AI Assistant Component with Advanced AI Features
const AIGuide = ({ assessments, severityCounts }) => {
  const [showMore, setShowMore] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');
  const [savedTips, setSavedTips] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  
  // Initialize with welcome message
  useEffect(() => {
    if (assessments.length > 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: generateWelcomeMessage(assessments[0]),
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, [assessments]);

  // AI Response Generator
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an AI API
    let response;
    const message = userMessage.toLowerCase();
    
    if (message.includes('help') || message.includes('support')) {
      response = "I'm here to help! You can ask me about your progress, request tips, or get recommendations for managing stress. What would you like to know?";
    } else if (message.includes('tip') || message.includes('advice')) {
      response = getPersonalizedTip(assessments[0]);
    } else if (message.includes('progress')) {
      const trend = getProgressTrend(assessments);
      response = `Your progress shows ${trend}. ${getEncouragement(trend)}`;
    } else {
      response = getContextualResponse(message, assessments);
    }
    
    return {
      id: Date.now() + 1,
      text: response,
      sender: 'ai',
      timestamp: new Date()
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    
    // Get AI response
    const aiResponse = await generateAIResponse(userInput);
    setChatMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  // Enhanced AI Analysis with more context
  const getAIAnalysis = () => {
    const analysis = {
      severity: '',
      insight: '',
      suggestion: '',
      tips: [],
      resources: [],
      progress: '',
      color: 'bg-blue-50 text-blue-800',
      icon: <ActivityIcon className="w-5 h-5 text-blue-500" />,
      personalizedInsights: getPersonalizedInsights(assessments),
      recommendedActions: getPersonalizedRecommendations(assessments),
      progressPredictions: getProgressTrend(assessments)
    };

    // Severity analysis
    if (severityCounts.severe >= severityCounts.moderate + severityCounts.mild) {
      analysis.severity = 'elevated';
      const trend = getProgressTrend(assessments);
      analysis.insight = `Your recent assessments indicate elevated stress levels. ${trend.includes('upward') ? 'This is higher than your previous assessment.' : 'This is a new assessment.'}`;
      analysis.suggestion = 'Consider scheduling a session with a mental health professional.';
      analysis.tips = [
        'Practice the 4-7-8 breathing technique',
        'Try a 10-minute body scan meditation',
        'Take a short walk outside'
      ];
      analysis.resources = ['/meditations', '/breathing-exercises'];
      analysis.color = 'bg-red-50 text-red-800';
      analysis.icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
    } else if (severityCounts.moderate > severityCounts.mild) {
      analysis.severity = 'moderate';
      analysis.insight = `You're managing moderate stress levels. Your trend is stable.`;
      analysis.suggestion = 'Regular mindfulness practice could help maintain balance.';
      analysis.tips = [
        'Try a 5-minute mindfulness break',
        'Practice gratitude journaling',
        'Engage in physical activity you enjoy'
      ];
      analysis.resources = ['/mindfulness', '/journaling'];
      analysis.color = 'bg-yellow-50 text-yellow-800';
      analysis.icon = <ActivityIcon className="w-5 h-5 text-yellow-500" />;
    } else {
      analysis.severity = 'mild';
      analysis.insight = `Great job! Your stress levels are well managed.`;
      analysis.suggestion = 'Continue with your current routine to maintain this balance.';
      analysis.tips = [
        'Share what works for you in our community',
        'Try a new wellness activity',
        'Help others by sharing your experience'
      ];
      analysis.resources = ['/community', '/wellness-activities'];
      analysis.color = 'bg-green-50 text-green-800';
      analysis.icon = <TrendingDown className="w-5 h-5 text-green-500" />;
    }

    // Add progress analysis
    const daysBetweenAssessments = assessments.length > 1 ? 
      Math.ceil((new Date(assessments[0].timestamp) - new Date(assessments[1].timestamp)) / (1000 * 60 * 60 * 24)) : 0;
      
    if (daysBetweenAssessments > 14) {
      analysis.progress = `Consider taking assessments more frequently (last one was ${daysBetweenAssessments} days ago).`;
    } else if (daysBetweenAssessments > 7) {
      analysis.progress = 'Good assessment frequency. Keep tracking your progress!';
    } else {
      analysis.progress = 'You\'re tracking your progress actively. Well done!';
    }

    return analysis;
  };

  const analysis = getAIAnalysis();
  const handleSaveTip = (tip) => {
    if (!savedTips.includes(tip)) {
      setSavedTips([...savedTips, tip]);
    }
  };

  return (
    <div className={`p-6 rounded-xl mb-8 bg-white border border-gray-200 shadow-sm`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel - Chat Interface */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Wellness Assistant</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'chat' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
              >
                Chat
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'insights' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
              >
                Insights
              </button>
            </div>
          </div>

          {activeTab === 'chat' ? (
            <div className="flex flex-col h-[500px] bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask me anything about your progress..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Enhanced Insights View */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">Your Wellness Snapshot</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">Current Status</p>
                    <p className="font-semibold">{getCurrentStatus(assessments[0])}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500">30-Day Trend</p>
                    <p className="font-semibold">{getTrend(assessments)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3">Personalized Recommendations</h4>
                <div className="space-y-3">
                  {getPersonalizedRecommendations(assessments).map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${rec.iconBg} ${rec.iconText}`}>
                        {rec.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rec.title}</p>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                        {rec.action && (
                          <button className="mt-2 text-xs text-indigo-600 hover:underline">
                            {rec.action}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Assessment Summary */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Assessment Summary</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Total Assessments</p>
                <p className="text-lg font-semibold">{assessments.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Assessment</p>
                <p className="text-lg font-semibold">
                  {assessments[0] ? new Date(assessments[0].timestamp).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <button 
                  onClick={() => window.location.href = '/assessments'}
                  className="w-full py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Take New Assessment
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const tip = getRandomTip();
                  const newMessage = {
                    id: Date.now(),
                    text: `Here's a tip for you: ${tip}`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, newMessage]);
                  setActiveTab('chat');
                }}
                className="w-full text-left p-3 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Get a wellness tip
              </button>
              <button 
                onClick={() => {
                  const resources = getRecommendedResources(assessments[0]);
                  const newMessage = {
                    id: Date.now(),
                    text: `Here are some resources that might help: ${resources.join(', ')}`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, newMessage]);
                  setActiveTab('chat');
                }}
                className="w-full text-left p-3 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                View recommended resources
              </button>
              <button 
                onClick={() => {
                  const progress = getProgressSummary(assessments);
                  const newMessage = {
                    id: Date.now(),
                    text: progress,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, newMessage]);
                  setActiveTab('chat');
                }}
                className="w-full text-left p-3 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Check my progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate personalized insights based on assessment data
const getPersonalizedInsights = (assessments) => {
  if (assessments.length === 0) return [];
  
  const latest = assessments[0];
  const insights = [];
  
  // Add severity insight
  if (latest.severity === 'severe') {
    insights.push({
      title: 'High Stress Detected',
      description: 'Your recent assessment shows high stress levels. Consider reaching out to a professional for support.',
      icon: '⚠️',
      priority: 'high'
    });
  }
  
  // Add trend insight
  if (assessments.length > 1) {
    const trend = getProgressTrend(assessments);
    if (trend.includes('upward')) {
      insights.push({
        title: 'Stress Trend Increasing',
        description: 'Your stress levels have been increasing. Try incorporating daily relaxation techniques.',
        icon: '📈',
        priority: 'medium'
      });
    } else if (trend.includes('downward')) {
      insights.push({
        title: 'Improving Wellbeing',
        description: 'Great job! Your stress levels are trending downward.',
        icon: '📉',
        priority: 'low'
      });
    }
  }
  
  // Add frequency insight
  if (assessments.length >= 3) {
    const daysBetween = (new Date(assessments[0].timestamp) - new Date(assessments[2].timestamp)) / (1000 * 60 * 60 * 24);
    if (daysBetween < 14) {
      insights.push({
        title: 'Frequent Assessments',
        description: 'You\'re checking in frequently, which is great for tracking progress!',
        icon: '✅',
        priority: 'low'
      });
    } else if (daysBetween > 30) {
      insights.push({
        title: 'Infrequent Check-ins',
        description: 'Consider checking in more regularly to better track your progress.',
        icon: '🔄',
        priority: 'medium'
      });
    }
  }
  
  return insights;
};

// Helper functions for AI responses
const generateWelcomeMessage = (latestAssessment) => {
  const time = new Date().getHours();
  let timeGreeting = "Hello";
  
  if (time < 12) timeGreeting = "Good morning";
  else if (time < 18) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";
  
  return `${timeGreeting}! I'm your AI Wellness Assistant. I see your last assessment showed ${
    latestAssessment?.severity || 'moderate'
  } stress levels. How can I help you today?`;
};

const getPersonalizedTip = (assessment) => {
  const tips = {
    severe: [
      "Consider scheduling a session with a mental health professional for personalized support.",
      "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8.",
      "Even a short 10-minute walk outside can help reduce stress levels."
    ],
    moderate: [
      "A 5-minute mindfulness break can help reset your focus and reduce stress.",
      "Try writing down three things you're grateful for today.",
      "Progressive muscle relaxation can help release tension in your body."
    ],
    mild: [
      "Maintain your routine with regular exercise and good sleep habits.",
      "Consider trying a new wellness activity to continue your positive progress.",
      "Your consistent self-care is paying off! Keep up the great work."
    ]
  };
  
  const severity = assessment?.severity?.toLowerCase() || 'moderate';
  return tips[severity]?.[Math.floor(Math.random() * tips[severity].length)] || 
         "Remember to take breaks and practice self-care throughout your day.";
};

const getProgressTrend = (assessments) => {
  if (assessments.length < 2) return "not enough data yet";
  const trend = assessments[0].percentage - assessments[1].percentage;
  if (trend > 5) return "an upward trend in stress levels";
  if (trend < -5) return "a downward trend in stress levels";
  return "stable stress levels";
};

const getEncouragement = (trend) => {
  if (trend.includes("upward")) return "Let's work on bringing those levels down. Would you like some stress-reduction techniques?";
  if (trend.includes("downward")) return "Great job! Your efforts are making a difference.";
  return "Consistency is key. Keep tracking your progress!";
};

const getContextualResponse = (message, assessments) => {
  if (message.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with today?";
  } else if (message.includes("hello") || message.includes("hi")) {
    return "Hello! How can I assist you with your wellness journey today?";
  } else if (message.includes("stress") || message.includes("anxious")) {
    return "I understand you're feeling stressed. Would you like me to guide you through a quick relaxation exercise?";
  } else if (message.includes("sleep")) {
    return "Quality sleep is crucial for mental health. Try establishing a regular sleep schedule and creating a relaxing bedtime routine.";
  } else {
    return "I'm here to help you with your wellness journey. You can ask me about your progress, request tips, or get recommendations for managing stress.";
  }
};

const getCurrentStatus = (assessment) => {
  if (!assessment) return "No recent assessment";
  const severity = assessment.severity?.toLowerCase() || 'moderate';
  const statusMap = {
    severe: "Needs Attention",
    moderate: "Stable",
    mild: "Doing Well"
  };
  return statusMap[severity] || "Stable";
};

const getTrend = (assessments) => {
  if (assessments.length < 2) return "Insufficient data";
  const trend = assessments[0].percentage - assessments[1].percentage;
  if (trend > 5) return "Increasing";
  if (trend < -5) return "Decreasing";
  return "Stable";
};

const getPersonalizedRecommendations = (assessments) => {
  if (!assessments.length) return [];
  
  const lastAssessment = assessments[0];
  const severity = lastAssessment.severity?.toLowerCase() || 'moderate';
  
  const recommendations = [
    {
      title: "Daily Check-in",
      description: "Complete a quick mood check to track your progress",
      icon: <MessageSquare className="w-5 h-5" />,
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      action: "Start Check-in"
    }
  ];

  if (severity === 'severe') {
    recommendations.push(
      {
        title: "Emergency Support",
        description: "If you're in crisis, please contact a mental health professional immediately",
        icon: <AlertTriangle className="w-5 h-5" />,
        iconBg: "bg-red-100",
        iconText: "text-red-600",
        action: "Get Help Now"
      },
      {
        title: "Guided Meditation",
        description: "Try this 10-minute meditation for stress relief",
        icon: <Activity className="w-5 h-5" />,
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        action: "Play Meditation"
      }
    );
  } else if (severity === 'moderate') {
    recommendations.push(
      {
        title: "Mindfulness Break",
        description: "Take 5 minutes to center yourself with a quick breathing exercise",
        icon: <Activity className="w-5 h-5" />,
        iconBg: "bg-yellow-100",
        iconText: "text-yellow-600",
        action: "Start Exercise"
      },
      {
        title: "Gratitude Journal",
        description: "Write down three things you're grateful for today",
        icon: <BookOpen className="w-5 h-5" />,
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        action: "Start Journaling"
      }
    );
  } else {
    recommendations.push(
      {
        title: "Wellness Challenge",
        description: "Try a new wellness activity this week",
        icon: <Award className="w-5 h-5" />,
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        action: "View Challenges"
      },
      {
        title: "Community Support",
        description: "Connect with others on a similar wellness journey",
        icon: <Users className="w-5 h-5" />,
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
        action: "Join Community"
      }
    );
  }

  return recommendations;
};

const getRandomTip = () => {
  const tips = [
    "Take three deep breaths when you feel stressed to help calm your nervous system.",
    "Spend 5 minutes in nature to reduce stress and improve mood.",
    "Practice the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "Set a timer for 2 minutes and focus solely on your breathing.",
    "Write down one thing you're grateful for today.",
    "Stretch your body for 2 minutes to release tension.",
    "Drink a glass of water to stay hydrated and support brain function.",
    "Take a short break from screens every hour to rest your eyes and mind."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

const getRecommendedResources = (assessment) => {
  const severity = assessment?.severity?.toLowerCase() || 'moderate';
  const resources = {
    severe: [
      "Crisis Support Line",
      "Therapist Directory",
      "Emergency Mental Health Resources"
    ],
    moderate: [
      "Guided Meditations",
      "Stress Management Course",
      "Mindfulness Exercises"
    ],
    mild: [
      "Wellness Podcasts",
      "Self-Care Tips",
      "Community Support Groups"
    ]
  };
  return resources[severity] || resources.moderate;
};

const getProgressSummary = (assessments) => {
  if (assessments.length < 2) {
    return "You've just started tracking your progress. Check back after a few more assessments to see your trends.";
  }
  
  const first = assessments[assessments.length - 1].percentage;
  const last = assessments[0].percentage;
  const difference = last - first;
  const absDifference = Math.abs(difference);
  
  if (difference > 10) {
    return `Your stress levels have increased by ${absDifference}% since you started. Let's work on some stress-reduction techniques.`;
  } else if (difference < -10) {
    return `Great progress! Your stress levels have decreased by ${absDifference}% since you started. Keep up the good work!`;
  } else {
    return `Your stress levels have remained relatively stable (${absDifference}% change). Consistency is key to long-term wellness.`;
  }
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const savedAssessments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const formattedAssessments = Object.entries(savedAssessments)
        .map(([key, value]) => ({
          ...value,
          type: key,
          name: ASSESSMENT_TYPES[key]?.name || key,
          date: new Date(value.timestamp).toLocaleDateString(),
          severity: (value.severity || 'unknown').toLowerCase()
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setAssessments(formattedAssessments);
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate severity distribution
  const severityCounts = assessments.reduce((acc, cur) => {
    const severity = cur.severity?.toLowerCase() || 'unknown';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, { mild: 0, moderate: 0, severe: 0, unknown: 0 });

  // Prepare chart data
  const chartData = {
    labels: ['Mild', 'Moderate', 'Severe'],
    datasets: [{
      label: 'Severity Distribution',
      data: [
        severityCounts.mild || 0,
        severityCounts.moderate || 0,
        severityCounts.severe || 0
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      y: { 
        beginAtZero: true, 
        ticks: { 
          stepSize: 1 
        } 
      } 
    },
    plugins: { 
      legend: { 
        display: false 
      } 
    }
  };

  const getAssessmentIcon = (type) => {
    const icons = {
      'SPIN': <Users className="w-5 h-5 mr-2" />,
      'BAI': <Activity className="w-5 h-5 mr-2" />,
      'FSS': <AlertTriangle className="w-5 h-5 mr-2" />
    };
    return icons[type] || <BarChart2 className="w-5 h-5 mr-2" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Wellness Dashboard</h1>
          <div className="w-24"></div>
        </div>

        {/* AI Assistant Section */}
        <AIGuide assessments={assessments} severityCounts={severityCounts} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Assessments</h3>
            <p className="text-3xl font-bold text-indigo-600">{assessments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {assessments.length > 0 
                ? Math.round(assessments.reduce((sum, a) => sum + (a.percentage || 0), 0) / assessments.length) 
                : 0}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Last Assessment</h3>
            <p className="text-lg text-gray-600">
              {assessments[0]?.date || 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Assessment History</h2>
          {assessments.length > 0 ? (
            <div className="space-y-3">
              {assessments.map((assessment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {getAssessmentIcon(assessment.type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{assessment.name}</h3>
                      <p className="text-sm text-gray-500">{assessment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{assessment.percentage || 0}%</p>
                    <p className="text-sm text-gray-500 capitalize">{assessment.severity || 'unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart2 className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No assessment history found</p>
              <button
                onClick={() => navigate('/assessments')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Take an Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;