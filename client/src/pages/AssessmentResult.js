// src/pages/AssessmentResult.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { ASSESSMENT_TYPES } from '../constants/assessmentTypes';

const ASSESSMENT_INFO = {
  SPIN: {
    description: "The Social Phobia Inventory (SPIN) is a 17-item questionnaire that measures the severity of social anxiety disorder.",
    interpretation: "Higher scores indicate more severe social anxiety symptoms.",
    reference: "Connor, K. M., et al. (2000). Psychometric properties of the Social Phobia Inventory (SPIN). The British Journal of Psychiatry, 176(4), 379-386."
  },
  BAI: {
    description: "The Beck Anxiety Inventory (BAI) is a 21-item self-report inventory that measures the severity of anxiety symptoms.",
    interpretation: "Higher scores indicate more severe anxiety symptoms.",
    reference: "Beck, A. T., & Steer, R. A. (1993). Beck Anxiety Inventory Manual. San Antonio: Psychological Corporation."
  },
  FSS: {
    description: "The Fear Survey Schedule (FSS) measures fear and phobic responses to various stimuli and situations.",
    interpretation: "Higher average scores indicate greater fear intensity across different categories.",
    reference: "Wolpe, J., & Lang, P. J. (1964). A fear survey schedule for use in behaviour therapy. Behaviour Research and Therapy, 2(1), 27-30."
  }
};

function getSeverityColor(severity) {
  const lowerSeverity = severity.toLowerCase();
  if (lowerSeverity.includes('severe')) return 'bg-red-100 text-red-800';
  if (lowerSeverity.includes('moderate')) return 'bg-yellow-100 text-yellow-800';
  if (lowerSeverity.includes('mild')) return 'bg-blue-100 text-blue-800';
  return 'bg-green-100 text-green-800';
}

function getCategoryScores(assessment) {
  if (assessment.testType !== 'FSS') return null;

  const categories = {};
  assessment.answers.forEach((answer, index) => {
    const question = ASSESSMENT_TYPES.FSS.questions[index];
    const category = question.category;
    if (!categories[category]) {
      categories[category] = { sum: 0, count: 0 };
    }
    categories[category].sum += Number(answer);
    categories[category].count++;
  });

  return Object.entries(categories).map(([name, { sum, count }]) => ({
    name,
    average: (sum / count).toFixed(2)
  }));
}

function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    if (location.state?.assessment) {
      setAssessment(location.state.assessment);
    } else {
      // If no assessment data is passed, redirect to assessment page
      navigate('/assessment');
    }
  }, [location, navigate]);

  if (!assessment) return null;

  const testInfo = ASSESSMENT_INFO[assessment.testType] || {};
  const severityColor = getSeverityColor(assessment.severity);
  const normalizedScore = assessment.testType === 'FSS' 
    ? (assessment.score / assessment.maxScore * 100).toFixed(0)
    : (assessment.score / assessment.maxScore * 100).toFixed(0);

  const categoryScores = getCategoryScores(assessment);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Assessment
        </button>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Assessment Results
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {testInfo.description}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Assessment</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {assessment.testName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date Completed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(assessment.timestamp).toLocaleDateString()}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {assessment.score} / {assessment.maxScore} ({normalizedScore}%)
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Severity</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${severityColor}`}>
                    {assessment.severity}
                  </span>
                </dd>
              </div>
              {categoryScores && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Category Breakdown</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="space-y-2">
                      {categoryScores.map(({ name, average }) => (
                        <div key={name} className="flex items-center">
                          <div className="w-1/3">{name}</div>
                          <div className="w-2/3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${average * 10}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{average}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Interpretation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {testInfo.interpretation}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Reference</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p className="italic">{testInfo.reference}</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Next Steps
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Recommendations</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Review your results with a mental health professional</li>
                    <li>Consider regular self-assessments to track your progress</li>
                    <li>Explore relaxation techniques and coping strategies</li>
                    <li>Maintain a journal to track your mood and anxiety levels</li>
                  </ul>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Resources</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => window.open('https://example.com/find-therapist', '_blank')}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Find a Therapist
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => window.open('https://example.com/anxiety-disorders', '_blank')}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Learn about Anxiety Disorders
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => window.open('https://example.com/self-help', '_blank')}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Self-Help Resources
                      </button>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/assessment')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Take Another Assessment
          </button>
          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentResult;