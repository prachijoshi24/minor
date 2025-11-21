// src/App.js
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentResult from './pages/AssessmentResult';
import RelaxPage from './pages/RelaxPage';
import ExposureLab from './pages/ExposureLab';
import ExposureAR from './pages/ExposureAR';
import SurfaceDetectionAR from './pages/SurfaceDetectionAR';
import JournalPage from './pages/JournalPage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import AITherapistPage from './pages/AITherapistPage';
import BreathingGuide from './pages/guide/BreathingGuide';
import GroundingGuide from './pages/guide/GroundingGuide';
import ProgressiveMuscleRelaxationGuide from './pages/guide/ProgressiveMuscleRelaxationGuide';
import "./styles/global.css";
import './index.css';
import { theme } from './theme/theme';


function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/result" element={<AssessmentResult />} />
          <Route path="/relax" element={<RelaxPage />} />
          <Route path="/relax/breathing" element={<BreathingGuide />} />
          <Route path="/relax/grounding" element={<GroundingGuide />} />
          <Route path="/relax/progressive" element={<ProgressiveMuscleRelaxationGuide />} />
          <Route path="/exposure" element={<ExposureLab />} />
          <Route path="/exposure/ar" element={<ExposureAR />} />
          <Route path="/exposure/surface" element={<SurfaceDetectionAR />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/therapist" element={<AITherapistPage />} />
        </Routes>
      </main>
      <div className="bg-pill one" />
      <div className="bg-pill two" />
    </div>
  );
}

export default App;