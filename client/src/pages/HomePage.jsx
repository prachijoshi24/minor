// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "Assessment",
    description: "Take our anxiety assessment to get personalized insights",
    icon: "📊",
    to: "/assessment",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Relaxation",
    description: "Guided exercises to calm your mind and body",
    icon: "🧘‍♀️",
    to: "/relax",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Exposure",
    description: "Gradually face your fears in a controlled way",
    icon: "🌅",
    to: "/exposure",
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Journal",
    description: "Track your progress and reflect on your journey",
    icon: "📔",
    to: "/journal",
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Progress",
    description: "Visualize your improvement over time",
    icon: "📈",
    to: "/progress",
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "AI Guide",
    description: "Get personalized support 24/7",
    icon: "🤖",
    to: "/therapist",
    color: "from-indigo-600 to-purple-600"
  }
];

const FeatureCard = ({ title, description, icon, to, color }) => (
  <Link to={to} className="block h-full">
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`h-full p-8 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="opacity-90 text-lg">{description}</p>
    </motion.div>
  </Link>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Mental Health Toolkit</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive set of tools designed to help you manage anxiety and improve your well-being.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Begin Your Journey?</h2>
          <Link 
            to="/assessment" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-lg"
          >
            Start with Assessment
          </Link>
        </motion.div>
      </div>
    </div>
  );
}