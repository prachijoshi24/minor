// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AssessmentPage from "./pages/AssessmentPage";
import RelaxPage from "./pages/RelaxPage";
import ExposureLab from "./pages/ExposureLab";
import JournalPage from "./pages/JournalPage";
import ProgressPage from "./pages/ProgressPage";
import HistoryPage from "./pages/HistoryPage";
import AITherapistPage from "./pages/AITherapistPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/relax" element={<RelaxPage />} />
          <Route path="/exposure" element={<ExposureLab />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/ai" element={<AITherapistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}