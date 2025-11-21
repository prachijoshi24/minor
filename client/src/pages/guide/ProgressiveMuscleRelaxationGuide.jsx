// src/pages/guides/ProgressiveMuscleRelaxationGuide.jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import '../../styles/relax.css';

const ProgressiveMuscleRelaxationGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [phase, setPhase] = useState('ready'); // ready, tensing, holding, releasing

  const muscleGroups = [
    { 
      id: 'feet', 
      name: 'Feet', 
      instructions: 'Curl your toes downward and tense the muscles in your feet',
      icon: '🦶'
    },
    { 
      id: 'calves', 
      name: 'Calves', 
      instructions: 'Lift your toes toward your shins to tense your calf muscles',
      icon: '🦵'
    },
    { 
      id: 'thighs', 
      name: 'Thighs', 
      instructions: 'Straighten your legs and squeeze your thigh muscles',
      icon: '🦵'
    },
    { 
      id: 'buttocks', 
      name: 'Buttocks', 
      instructions: 'Squeeze your buttocks together',
      icon: '👖'
    },
    { 
      id: 'stomach', 
      name: 'Stomach', 
      instructions: 'Tighten your abdominal muscles as if bracing for a punch',
      icon: '👕'
    },
    { 
      id: 'back', 
      name: 'Back', 
      instructions: 'Arch your lower back and squeeze your shoulder blades together',
      icon: '👔'
    },
    { 
      id: 'hands', 
      name: 'Hands', 
      instructions: 'Make fists and squeeze',
      icon: '✊'
    },
    { 
      id: 'arms', 
      name: 'Arms', 
      instructions: 'Bend your arms and tense your biceps',
      icon: '💪'
    },
    { 
      id: 'shoulders', 
      name: 'Shoulders', 
      instructions: 'Shrug your shoulders up toward your ears',
      icon: '👔'
    },
    { 
      id: 'neck', 
      name: 'Neck', 
      instructions: 'Gently tilt your head back and press it against your shoulders',
      icon: '👔'
    },
    { 
      id: 'face', 
      name: 'Face', 
      instructions: 'Scrunch up your facial muscles',
      icon: '😠'
    },
    { 
      id: 'jaw', 
      name: 'Jaw', 
      instructions: 'Clench your jaw gently',
      icon: '😬'
    }
  ];

  const currentMuscle = muscleGroups[currentStep];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase or next muscle
            if (phase === 'ready') {
              setPhase('tensing');
              return 5; // Tense for 5 seconds
            } else if (phase === 'tensing') {
              setPhase('holding');
              return 5; // Hold for 5 seconds
            } else if (phase === 'holding') {
              setPhase('releasing');
              return 10; // Release for 10 seconds
            } else {
              // Move to next muscle or stop
              if (currentStep >= muscleGroups.length - 1) {
                setIsPlaying(false);
                setPhase('complete');
                return 0;
              }
              setCurrentStep(prev => prev + 1);
              setPhase('ready');
              return 5; // Ready for next muscle
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, phase, currentStep]);

  const togglePlay = () => {
    if (!isPlaying && phase === 'complete') {
      // Reset if starting over from completion
      setCurrentStep(0);
      setPhase('ready');
      setTimeLeft(5);
    }
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPhase('ready');
    setTimeLeft(5);
  };

  const getPhaseInstructions = () => {
    switch (phase) {
      case 'ready':
        return `Get ready to tense your ${currentMuscle.name.toLowerCase()}`;
      case 'tensing':
        return `Tense your ${currentMuscle.name.toLowerCase()}: ${currentMuscle.instructions}`;
      case 'holding':
        return `Hold the tension in your ${currentMuscle.name.toLowerCase()}`;
      case 'releasing':
        return `Release all tension from your ${currentMuscle.name.toLowerCase()}. Notice the difference between tension and relaxation.`;
      default:
        return '';
    }
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
        <h1>Progressive Muscle Relaxation</h1>
        <p className="guide-subtitle">
          A systematic technique for achieving deep relaxation by tensing and relaxing muscle groups
        </p>
      </header>

      <div className="guide-content">
        <div className="guide-section">
          <h2>Current Exercise</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 text-4xl flex items-center justify-center mx-auto mb-4">
                {currentMuscle.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {currentMuscle.name}
              </h3>
              <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block mt-2 ${
                phase === 'ready' ? 'bg-blue-100 text-blue-800' :
                phase === 'tensing' ? 'bg-yellow-100 text-yellow-800' :
                phase === 'holding' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {timeLeft}s
              </div>
              <p className="text-gray-700">
                {getPhaseInstructions()}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={togglePlay}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                  isPlaying 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>{phase === 'complete' ? 'Start Over' : 'Start'}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetExercise}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="guide-section">
          <h2>Muscle Groups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {muscleGroups.map((muscle, index) => (
              <div
                key={muscle.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  currentStep === index
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setCurrentStep(index);
                  setPhase('ready');
                  setTimeLeft(5);
                  setIsPlaying(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    currentStep === index ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {muscle.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{muscle.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{muscle.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-section">
          <h2>How to Practice</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-900">
                <li>Find a quiet, comfortable place to sit or lie down</li>
                <li>Take a few deep breaths to relax</li>
                <li>Focus on the muscle group shown</li>
                <li>When instructed, tense the muscle group for 5 seconds</li>
                <li>Hold the tension, then release and relax for 10 seconds</li>
                <li>Notice the difference between tension and relaxation</li>
                <li>Continue with the next muscle group</li>
              </ol>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-800 mb-2">Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-purple-900">
                <li>Breathe normally throughout the exercise</li>
                <li>Don't strain - use about 75% of your maximum tension</li>
                <li>Focus on the sensation of relaxation after releasing tension</li>
                <li>Practice in a quiet environment with minimal distractions</li>
                <li>Try to do this exercise daily for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveMuscleRelaxationGuide;