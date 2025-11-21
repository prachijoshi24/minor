// src/pages/guides/BreathingGuide.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, Volume2, VolumeX, Clock, ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import '../../styles/relax.css';

const BreathingGuide = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const phases = [
    { name: 'Breathe In', duration: 4, color: '#4f46e5', className: 'inhale' },
    { name: 'Hold', duration: 4, color: '#7c3aed', className: 'hold' },
    { name: 'Breathe Out', duration: 4, color: '#8b5cf6', className: 'exhale' },
    { name: 'Hold', duration: 4, color: '#a78bfa', className: 'hold' }
  ];

  const currentPhase = phases.find(p => p.className === phase) || phases[0];

  useEffect(() => {
    let interval;
    
    if (isActive) {
      let phaseIndex = phases.findIndex(p => p.className === phase);
      
      interval = setInterval(() => {
        setCount(prevCount => {
          if (prevCount <= 1) {
            const nextIndex = (phaseIndex + 1) % phases.length;
            setPhase(phases[nextIndex].className);
            if (nextIndex === 0) setCycle(prev => prev + 1);
            return phases[nextIndex].duration;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleBreathing = () => {
    if (!isActive && count === 0) {
      setCount(phases[0].duration);
      setPhase('inhale');
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCount(phases[0].duration);
    setPhase('inhale');
    setCycle(0);
  };

  return (
    <div className="guide-page">
      <button 
        className="back-button"
        onClick={() => navigate('/relax')}
        aria-label="Go back to relaxation techniques"
      >
        <ArrowLeft size={20} />
        Back to Techniques
      </button>

      <header className="guide-header">
        <h1>Box Breathing Guide</h1>
        <p className="guide-subtitle">
          A simple yet powerful technique to reduce stress and improve focus
        </p>
      </header>

      <div className="guide-content">
        <div className="guide-section">
          <h2>How to Practice</h2>
          <div className="breathing-container">
            <div className="breathing-visual">
              <motion.div 
                className={`breathing-circle ${currentPhase.className}`}
                style={{ backgroundColor: currentPhase.color }}
                animate={{
                  scale: currentPhase.className === 'inhale' ? 1.1 : 
                         currentPhase.className === 'exhale' ? 0.9 : 1,
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                <span className="count">{count}</span>
                <span className="phase">{currentPhase.name}</span>
              </motion.div>
            </div>

            <div className="breathing-controls">
              <button 
                className={`control-btn ${isActive ? 'active' : ''}`}
                onClick={toggleBreathing}
                aria-label={isActive ? 'Pause breathing' : 'Start breathing'}
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                className="control-btn"
                onClick={resetExercise}
                disabled={!isActive && count === phases[0].duration}
                aria-label="Reset exercise"
              >
                <RefreshCw size={18} />
              </button>
              
              <div className="cycle-counter">
                <Clock size={16} />
                <span>Cycle: {cycle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="guide-section">
          <h2>Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Reduces stress and anxiety',
              'Improves focus and concentration',
              'Lowers blood pressure',
              'Enhances respiratory function',
              'Promotes better sleep',
              'Increases energy levels'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-section">
          <h2>Instructions</h2>
          <ol className="space-y-3">
            {[
              'Find a comfortable seated position with your back straight',
              'Place one hand on your chest and the other on your belly',
              'Close your eyes and take a few normal breaths to settle in',
              'Follow the visual guide for the 4-4-4-4 breathing pattern:',
              '• Inhale through your nose for 4 seconds',
              '• Hold your breath for 4 seconds',
              '• Exhale slowly through your mouth for 4 seconds',
              '• Hold your breath for 4 seconds',
              'Repeat for 5-10 minutes or as needed'
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;