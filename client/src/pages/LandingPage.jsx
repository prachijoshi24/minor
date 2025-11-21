// src/pages/LandingPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_TAGLINE } from "../branding";
import { motion } from "framer-motion";

const preloadFonts = () => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

const guideSteps = [
  {
    title: "Start Assessment",
    description: "Take a quick assessment to understand your anxiety levels",
    icon: "📝",
  },
  {
    title: "Practice Daily",
    description: "Use our tools to manage anxiety and build resilience",
    icon: "🧘",
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement over time",
    icon: "📊",
  }
];

export default function LandingPage() {
  useEffect(() => {
    preloadFonts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Welcome to {BRAND_NAME}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {BRAND_TAGLINE}
            </motion.p>

            <motion.p 
              className="text-gray-500 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              A safe space to understand and manage anxiety through guided exercises
            </motion.p>
          </div>

          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link 
              to="/home" 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link 
              to="/assessment" 
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Take Assessment
            </Link>
          </motion.div>

          {/* Guide */}
          <motion.div 
            className="mt-12 bg-white p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h2>
            <div className="space-y-4">
              {guideSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                >
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}