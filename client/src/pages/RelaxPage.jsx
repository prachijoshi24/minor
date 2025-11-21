// src/pages/RelaxPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, RefreshCw, ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import '../styles/relax.css';

const RelaxationCard = ({ title, description, icon: Icon, onClick }) => (
  <motion.div 
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
    whileHover={{ y: -4 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <div className="flex items-center text-primary-600 font-medium">
      <span>Start exercise</span>
      <ArrowRight size={18} className="ml-2" />
    </div>
  </motion.div>
);

const RelaxPage = () => {
  const navigate = useNavigate();

  const techniques = [
    {
      id: 'breathing',
      title: 'Box Breathing',
      description: 'A powerful technique to reduce stress and improve concentration by controlling your breath in a rhythmic pattern.',
      icon: (props) => <Play {...props} />
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'A mindfulness exercise that helps bring your attention to the present moment by engaging your senses.',
      icon: (props) => <BookOpen {...props} />
    },
    {
      id: 'progressive',
      title: 'Progressive Muscle Relaxation',
      description: 'A method that helps relieve tension by systematically tensing and relaxing different muscle groups.',
      icon: (props) => <RefreshCw {...props} />
    }
  ];

  const handleCardClick = (id) => {
    navigate(`/relax/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Relaxation Techniques</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore these guided exercises to reduce stress, improve focus, and enhance your overall well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {techniques.map((technique) => (
          <RelaxationCard
            key={technique.id}
            title={technique.title}
            description={technique.description}
            icon={technique.icon}
            onClick={() => handleCardClick(technique.id)}
          />
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Practice Relaxation?</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-6">
          Regular relaxation practice can help reduce stress, lower blood pressure, improve sleep,
          boost mood, and enhance overall quality of life. Even just a few minutes a day can make a difference.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {[
            { icon: '😌', text: 'Reduces stress and anxiety' },
            { icon: '😴', text: 'Improves sleep quality' },
            { icon: '🧠', text: 'Enhances mental clarity' }
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-3xl mb-2 inline-block">{item.icon}</span>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelaxPage;