// src/pages/guides/GroundingGuide.jsx
import React, { useState } from 'react';
import { Play, Pause, ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import '../../styles/relax.css';

const GroundingGuide = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      number: 5,
      sense: 'Sight',
      description: 'Look around and name 5 things you can see',
      examples: 'e.g., a book, a plant, a picture on the wall'
    },
    {
      number: 4,
      sense: 'Touch',
      description: 'Acknowledge 4 things you can touch',
      examples: 'e.g., your clothes, the chair, the floor beneath your feet'
    },
    {
      number: 3,
      sense: 'Hearing',
      description: 'Notice 3 things you can hear',
      examples: 'e.g., birds chirping, the hum of a computer, your breath'
    },
    {
      number: 2,
      sense: 'Smell',
      description: 'Identify 2 things you can smell',
      examples: 'e.g., fresh air, your shampoo, a nearby meal'
    },
    {
      number: 1,
      sense: 'Taste',
      description: 'Recognize 1 thing you can taste',
      examples: 'e.g., the taste of coffee, toothpaste, or gum'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = steps[currentStep];

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
        <h1>5-4-3-2-1 Grounding Technique</h1>
        <p className="guide-subtitle">
          A mindfulness exercise to help you stay present and reduce anxiety
        </p>
      </header>

      <div className="guide-content">
        <div className="guide-section">
          <h2>Current Step</h2>
          <div className="grounding-step">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-800 text-2xl font-bold mb-4 mx-auto">
              {currentStepData.number}
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              {currentStepData.sense}
            </h3>
            <p className="text-lg text-center text-gray-700 mb-2">
              {currentStepData.description}
            </p>
            <p className="text-sm text-center text-gray-500">
              {currentStepData.examples}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg ${currentStep === 0 ? 'bg-gray-200 text-gray-500' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 rounded-lg ${currentStep === steps.length - 1 ? 'bg-gray-200 text-gray-500' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
            >
              Next
            </button>
          </div>
        </div>

        <div className="guide-section">
          <h2>All Steps</h2>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  currentStep === index
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentStep === index ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{step.sense}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-section">
          <h2>How to Use This Technique</h2>
          <ol className="space-y-3 list-decimal list-inside">
            {[
              'Find a quiet place where you can sit or stand comfortably',
              'Start with the first step (5 things you can see)',
              'Take your time with each step, really noticing each sensation',
              'If your mind wanders, gently bring your focus back to the exercise',
              'Continue through all 5 steps at your own pace',
              'Repeat as needed until you feel more grounded and present'
            ].map((tip, index) => (
              <li key={index} className="text-gray-700">
                {tip}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GroundingGuide;