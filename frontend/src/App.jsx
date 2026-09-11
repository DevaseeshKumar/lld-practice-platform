import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';
import WorkspacePage from './pages/WorkspacePage';
import HelpPage from './pages/HelpPage';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('catalog'); // 'catalog' | 'workspace' | 'help'
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  // Current practice attempt & submission state
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [evaluatorType, setEvaluatorType] = useState('deterministic');
  const [rightPanelMode, setRightPanelMode] = useState('workspace'); // 'workspace' | 'evaluation' | 'history'
  
  // Form input state
  const [formData, setFormData] = useState({
    requirementsUnderstanding: '',
    assumptions: '',
    classes: '',
    responsibilities: '',
    relationships: '',
    edgeCases: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState(null);
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadProblems = async () => {
    try {
      setLoadingProblems(true);
      const data = await api.getProblems();
      setProblems(data);
    } catch (err) {
      console.error('Failed to load problems:', err);
      showToast('Could not connect to backend. Please ensure the server is running on port 5000.');
    } finally {
      setLoadingProblems(false);
    }
  };

  // Fetch problems on mount
  useEffect(() => {
    loadProblems();
  }, []);

  const handleSelectProblem = async (problem) => {
    try {
      let fullProblem = problem;
      try {
        const fetched = await api.getProblem(problem._id || problem.slug);
        if (fetched) fullProblem = fetched;
      } catch (e) {
        console.warn('Using passed problem object:', e);
      }

      setSelectedProblem(fullProblem);
      setCurrentPage('workspace');
      setRightPanelMode('workspace');
      setFormData({
        requirementsUnderstanding: '',
        assumptions: '',
        classes: '',
        responsibilities: '',
        relationships: '',
        edgeCases: ''
      });
      setLatestEvaluation(null);
      setLatestSubmission(null);

      // Start an attempt on backend
      const attempt = await api.startAttempt(problem._id);
      setCurrentAttempt(attempt);
      setAttemptHistory([]);
      showToast(`Started practice session for: ${problem.title}`);
    } catch (err) {
      console.error('Failed to start attempt:', err);
      showToast(`Error starting attempt: ${err.message}`);
    }
  };

  const handleSubmitDesign = async () => {
    if (!currentAttempt) {
      showToast('No active attempt found. Starting attempt...');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        attemptId: currentAttempt._id,
        ...formData,
        evaluatorType
      };

      const result = await api.submitDesign(payload);
      
      setLatestSubmission(result.submission);
      setLatestEvaluation(result.evaluationResult);
      if (result.attempt) {
        setCurrentAttempt(result.attempt);
      }

      // Fetch updated history
      const history = await api.getSubmissionsByAttempt(currentAttempt._id);
      setAttemptHistory(history);

      setRightPanelMode('evaluation');
      showToast(`Design evaluated. Overall Score: ${result.evaluationResult.overallScore}%`);
    } catch (err) {
      console.error('Submission error:', err);
      showToast(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    // Keep previous form data in editor so learner can iterate smoothly
    setRightPanelMode('workspace');
    showToast(`Ready for Iteration #${(currentAttempt?.currentSubmissionNumber || 1) + 1}. Refine your design.`);
  };

  const handleViewHistory = async () => {
    if (currentAttempt) {
      const history = await api.getSubmissionsByAttempt(currentAttempt._id);
      setAttemptHistory(history);
    }
    setRightPanelMode('history');
  };

  const handleLoadSnapshotIntoWorkspace = (sub) => {
    if (!sub) return;
    setFormData({
      requirementsUnderstanding: sub.requirementsUnderstanding || '',
      assumptions: sub.assumptions || '',
      classes: sub.classes || '',
      responsibilities: sub.responsibilities || '',
      relationships: sub.relationships || '',
      edgeCases: sub.edgeCases || ''
    });
    setRightPanelMode('workspace');
    showToast(`Loaded iteration #${sub.submissionNumber} into workspace.`);
  };

  const handleNavigateHome = () => {
    setCurrentPage('catalog');
    setSelectedProblem(null);
    setCurrentAttempt(null);
    setLatestEvaluation(null);
    setLatestSubmission(null);
    setAttemptHistory([]);
    setRightPanelMode('workspace');
  };

  const handleNavigateHelp = () => {
    setCurrentPage('help');
  };

  return (
    <div className="app-container">
      <Navbar
        currentPage={currentPage}
        onNavigateHome={handleNavigateHome}
        onNavigateHelp={handleNavigateHelp}
        activeProblem={currentPage === 'workspace' ? selectedProblem : null}
        evaluatorType={evaluatorType}
        onEvaluatorChange={setEvaluatorType}
      />

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          padding: '12px 20px',
          borderRadius: '8px',
          zIndex: 100,
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}

      <main className="main-content">
        {currentPage === 'catalog' && (
          <CatalogPage
            problems={problems}
            onSelectProblem={handleSelectProblem}
            loading={loadingProblems}
            onNavigateHelp={handleNavigateHelp}
          />
        )}

        {currentPage === 'help' && (
          <HelpPage onNavigateCatalog={handleNavigateHome} />
        )}

        {currentPage === 'workspace' && selectedProblem && (
          <WorkspacePage
            problem={selectedProblem}
            currentAttempt={currentAttempt}
            formData={formData}
            setFormData={setFormData}
            onSubmitDesign={handleSubmitDesign}
            submitting={submitting}
            evaluatorType={evaluatorType}
            setEvaluatorType={setEvaluatorType}
            rightPanelMode={rightPanelMode}
            setRightPanelMode={setRightPanelMode}
            latestSubmission={latestSubmission}
            latestEvaluation={latestEvaluation}
            attemptHistory={attemptHistory}
            onRetry={handleRetry}
            onViewHistory={handleViewHistory}
            onLoadSnapshotIntoWorkspace={handleLoadSnapshotIntoWorkspace}
          />
        )}
      </main>
    </div>
  );
}
