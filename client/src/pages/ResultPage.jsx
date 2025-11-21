import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { REPORT_TITLE, REPORT_PREFIX } from "../branding";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/result.css"; // We'll create this file next

export default function ResultPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadResult = async () => {
      try {
        if (location.state?.result) {
          // Simulate loading for better UX
          await new Promise(resolve => setTimeout(resolve, 500));
          setResult(location.state.result);
        } else {
          throw new Error("No assessment result found");
        }
      } catch (err) {
        console.error("Error loading results:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [location.state]);

  const downloadPDF = async () => {
    try {
      const root = document.getElementById("result-print");
      if (!root) return;

      const canvas = await html2canvas(root, { 
        scale: 2, 
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ 
        orientation: "portrait", 
        unit: "pt", 
        format: "a4" 
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 40;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      pdf.save(`${REPORT_PREFIX}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="loading-spinner"></div>
        <p>Generating your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-container">
        <div className="error-card">
          <h2>Unable to Load Results</h2>
          <p>{error}</p>
          <button 
            className="btn primary-btn" 
            onClick={() => navigate('/assessment')}
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container">
        <div className="card no-results">
          <h2>No Results Found</h2>
          <p>Please complete the assessment to view your results.</p>
          <button 
            className="btn primary-btn" 
            onClick={() => navigate('/assessment')}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="container">
        <div id="result-print" className="result-card">
          <header className="result-header">
            <div>
              <h1>{REPORT_TITLE}</h1>
              <p className="subtitle">Your Personalized Assessment Results</p>
            </div>
            <div className="result-meta">
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">
                  {new Date(result.timestamp || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Time:</span>
                <span className="meta-value">
                  {new Date(result.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </header>

          <section className="score-section">
            <h2>Your Overall Score</h2>
            <div className="score-container">
              <div className="score-circle">
                <span className="score-value">{result.total}</span>
                <span className="score-label">Total Score</span>
              </div>
              <div className="score-details">
                <h3>{result.label}</h3>
                <p className="score-range">Range: 0 - {result.maxScore || 100}</p>
                <p className="score-description">
                  {getScoreDescription(result.total, result.maxScore || 100)}
                </p>
              </div>
            </div>
          </section>

          <section className="answers-section">
            <h2>Your Responses</h2>
            <div className="table-container">
              <table className="answers-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Your Response</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.answers || {}).map(([question, answer]) => (
                    <tr key={question}>
                      <td>{question}</td>
                      <td>
                        <span className={`response-badge ${getResponseClass(answer)}`}>
                          {answer}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="recommendations-section">
            <h2>Recommendations</h2>
            <div className="recommendation-card">
              <h3>Based on your results:</h3>
              <p>{getRecommendationText(result.total)}</p>
              <div className="action-buttons">
                <button 
                  className="btn primary-btn"
                  onClick={() => navigate('/therapist')}
                >
                  Talk to AI Therapist
                </button>
                <button 
                  className="btn secondary-btn"
                  onClick={() => navigate('/relax')}
                >
                  Try Relaxation Exercises
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="action-bar">
          <button 
            className="btn download-btn"
            onClick={downloadPDF}
            aria-label="Download results as PDF"
          >
            <Download size={18} className="icon" />
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getScoreDescription(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "Severe symptoms - Professional help recommended";
  if (percentage >= 60) return "Moderate to severe symptoms";
  if (percentage >= 40) return "Mild to moderate symptoms";
  if (percentage >= 20) return "Mild symptoms";
  return "Minimal or no symptoms";
}

function getRecommendationText(score) {
  if (score >= 51) return "Your results indicate symptoms that may benefit from professional support. We recommend consulting with a mental health professional for a comprehensive evaluation. In the meantime, our AI therapist can provide support and guidance.";
  if (score >= 31) return "Your results suggest you may benefit from structured support. Consider trying our guided CBT modules or speaking with our AI therapist to develop coping strategies.";
  if (score >= 16) return "Your results show some areas that might benefit from attention. Our relaxation exercises and self-help resources could be helpful in managing these symptoms.";
  return "Your results are within the typical range. Continue practicing self-care and check back regularly to monitor your well-being.";
}

function getResponseClass(answer) {
  const num = Number(answer);
  if (isNaN(num)) return 'neutral';
  if (num >= 3) return 'high';
  if (num >= 1) return 'medium';
  return 'low';
}