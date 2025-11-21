import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Users, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Home
} from 'react-feather';
import { ASSESSMENT_TYPES, STORAGE_KEY } from '../constants/assessmentTypes';
import '../styles/global.css';
import '../styles/assessment.css';

function AssessmentPage() {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState(null);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedAssessments, setCompletedAssessments] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? Math.round(((currentQuestion + 1) / totalQuestions) * 100) : 0;
  const hasAnswered = answers[`q-${currentQuestion}`] !== undefined;
  const completedCount = Object.keys(completedAssessments).length;
  const totalAssessments = Object.keys(ASSESSMENT_TYPES).length;

  // Load completed assessments from localStorage
  useEffect(() => {
    const savedAssessments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    setCompletedAssessments(savedAssessments);
  }, []);

  const handleAnswer = (value) => {
    const newAnswers = {
      ...answers,
      [`q-${currentQuestion}`]: value
    };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        handleNext();
      }, 300);
    } else {
      const score = test.calculateScore(newAnswers);
      const percentage = Math.round((score / test.maxScore) * 100);
      const severity = test.scoring.ranges.find(range => percentage <= range.max) || 
                     test.scoring.ranges[test.scoring.ranges.length - 1];

      const assessmentResult = {
        score,
        percentage,
        severity: severity.label,
        timestamp: new Date().toISOString()
      };

      const updatedAssessments = {
        ...completedAssessments,
        [currentTest]: assessmentResult
      };

      setCompletedAssessments(updatedAssessments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAssessments));
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAssessmentSelect = (key) => {
    const selectedTest = ASSESSMENT_TYPES[key];
    setCurrentTest(key);
    setTest(selectedTest);
    setQuestions(selectedTest.questions || []);
    setCurrentQuestion(0);
    setAnswers({});
    setShowInstructions(false);
    setShowResults(false);
  };

  const handleCompleteAssessment = () => {
    setShowFeedback(false);
    if (completedCount + 1 >= totalAssessments) {
      setShowResults(true);
    } else {
      setShowInstructions(true);
    }
  };

  const renderAssessmentSelector = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Select an Assessment</h2>
        <p className="text-muted-foreground">Choose the assessment that best fits your needs.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(ASSESSMENT_TYPES).map(([key, assessment], index) => (
          <motion.div
            key={key}
            className="bg-card p-6 rounded-xl shadow-sm border border-border/50 cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleAssessmentSelect(key)}
            onKeyDown={(e) => e.key === 'Enter' && handleAssessmentSelect(key)}
            role="button"
            tabIndex={0}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${
                key === 'SPIN' ? 'bg-primary/10 text-primary' : 
                key === 'BAI' ? 'bg-accent/10 text-accent' : 
                'bg-warning/10 text-warning'
              }`}>
                {key === 'SPIN' && <Users className="w-5 h-5" />}
                {key === 'BAI' && <Activity className="w-5 h-5" />}
                {key === 'FSS' && <AlertTriangle className="w-5 h-5" />}
              </div>
              <h3 className="ml-4 text-lg font-semibold text-foreground">
                {assessment.name}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{assessment.description}</p>
            <div className="flex items-center text-sm text-muted-foreground/80">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{Math.ceil(assessment.questions.length * 0.5)} min • {assessment.questions.length} questions</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderQuestion = () => {
    if (!questions || questions.length === 0) {
      return (
        <motion.div 
          className="bg-card rounded-lg shadow-sm border border-border/50 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">No questions available</h2>
          <motion.button
            onClick={() => setShowInstructions(true)}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Assessments
          </motion.button>
        </motion.div>
      );
    }

    const currentQ = questions[currentQuestion];
    const answer = answers[`q-${currentQuestion}`] ?? 0;
    const isLastQuestion = currentQuestion === totalQuestions - 1;

    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowInstructions(true)}
              className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </motion.button>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent/80"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <motion.div 
          className="bg-card rounded-xl shadow-sm border border-border/50 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {currentQ}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Not at all</span>
              <span>Very much</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={answer}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(
                    to right,
                    var(--accent) 0%,
                    var(--accent) ${(answer / 4) * 100}%,
                    var(--muted) ${(answer / 4) * 100}%,
                    var(--muted) 100%
                  )`
                }}
              />
              
              <div className="flex justify-between mt-6 px-1">
                {[0, 1, 2, 3, 4].map((value) => (
                  <motion.button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                      answer === value
                        ? 'bg-accent text-accent-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50'
                    } transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between pt-2">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2.5 border border-border rounded-lg disabled:opacity-50 text-foreground/80 hover:bg-muted/50 transition-colors flex items-center"
            whileHover={currentQuestion === 0 ? {} : { x: -2 }}
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" />
            Previous
          </motion.button>
          
          {isLastQuestion ? (
            <motion.button
              onClick={() => setShowFeedback(true)}
              disabled={!hasAnswered}
              className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:bg-accent/90 transition-colors"
              whileHover={!hasAnswered ? {} : { scale: 1.03 }}
              whileTap={!hasAnswered ? {} : { scale: 0.98 }}
            >
              Submit Assessment
            </motion.button>
          ) : (
            <motion.button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:bg-accent/90 transition-colors flex items-center"
              whileHover={!hasAnswered ? {} : { scale: 1.03 }}
              whileTap={!hasAnswered ? {} : { scale: 0.98 }}
            >
              Next Question
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  const renderResults = () => {
    const totalScore = Object.values(completedAssessments).reduce(
      (sum, { percentage }) => sum + percentage, 0
    ) / totalAssessments;

    const getSeverityColor = (score) => {
      if (score < 33) return { text: 'Low', color: 'bg-success', textColor: 'text-success-foreground' };
      if (score < 66) return { text: 'Moderate', color: 'bg-warning', textColor: 'text-warning-foreground' };
      return { text: 'High', color: 'bg-destructive', textColor: 'text-destructive-foreground' };
    };

    const { text: overallSeverity, color: severityColor, textColor } = getSeverityColor(totalScore);

    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => {
            setShowResults(false);
            setShowInstructions(true);
          }}
          className="inline-flex items-center text-accent hover:text-accent/80 transition-colors mb-6"
          whileHover={{ x: -2 }}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Assessments
        </motion.button>
        <div className="bg-card rounded-xl shadow-sm border border-border/50 p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Assessment Results</h2>
          
          <div className="space-y-8">
            <div className={`p-6 rounded-lg ${severityColor}/10`}>
              <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Overall Score</h3>
              <div className="flex items-center">
                <div className={`text-4xl font-bold ${textColor} mr-4`}>
                  {Math.round(totalScore)}%
                </div>
                <div>
                  <div className={`text-sm ${textColor} font-medium`}>{overallSeverity} Level</div>
                  <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                    <motion.div 
                      className={`h-full rounded-full ${severityColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${totalScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Individual Assessments</h3>
              {Object.entries(completedAssessments).map(([testId, result]) => (
                <div key={testId} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {ASSESSMENT_TYPES[testId]?.name || testId}
                      </h4>
                      <p className="text-sm text-muted-foreground">{result.severity}</p>
                    </div>
                    <div className={`text-2xl font-bold ${textColor}`}>
                      {result.percentage}%
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${result.percentage}%`,
                        backgroundColor: result.percentage < 33 ? 'var(--success)' : 
                                       result.percentage < 66 ? 'var(--warning)' : 'var(--destructive)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {showInstructions ? (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.h1 
                className="text-3xl font-bold text-foreground mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Mental Health Assessments
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Take an assessment to better understand your mental health status.
              </motion.p>
            </div>
            {renderAssessmentSelector()}
          </motion.div>
        ) : showFeedback ? (
          <motion.div 
            className="bg-card rounded-xl shadow-sm border border-border/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Assessment Complete! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              {completedCount + 1 >= totalAssessments
                ? 'You have completed all assessments. View your results below.'
                : `You've completed ${completedCount + 1} of ${totalAssessments} assessments.`}
            </p>
            <div className="flex justify-end">
              <motion.button
                onClick={handleCompleteAssessment}
                className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 font-medium transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {completedCount + 1 >= totalAssessments ? 'View Results' : 'Next Assessment'}
              </motion.button>
            </div>
          </motion.div>
        ) : showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderResults()}
          </motion.div>
        ) : (
          renderQuestion()
        )}
      </div>
    </div>
  );
}

export default AssessmentPage;