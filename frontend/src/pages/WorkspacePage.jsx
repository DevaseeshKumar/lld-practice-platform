import React from 'react';
import ProblemDetail from '../components/ProblemDetail';
import Workspace from '../components/Workspace';
import EvaluationView from '../components/EvaluationView';
import AttemptHistory from '../components/AttemptHistory';

export default function WorkspacePage({
  problem,
  currentAttempt,
  formData,
  setFormData,
  onSubmitDesign,
  submitting,
  evaluatorType,
  setEvaluatorType,
  rightPanelMode,
  setRightPanelMode,
  latestSubmission,
  latestEvaluation,
  attemptHistory,
  onRetry,
  onViewHistory,
  onLoadSnapshotIntoWorkspace
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(340px, 460px) 1fr',
      gap: '24px',
      height: 'calc(100vh - 110px)',
      minHeight: '650px'
    }}>
      {/* Left Column: Problem Details & Rubric */}
      <ProblemDetail problem={problem} />

      {/* Right Column: Dynamic Workspace / Evaluation / History */}
      {rightPanelMode === 'workspace' && (
        <Workspace
          problem={problem}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmitDesign}
          submitting={submitting}
          evaluatorType={evaluatorType}
          setEvaluatorType={setEvaluatorType}
          submissionNumber={(currentAttempt?.currentSubmissionNumber || 0) + 1}
        />
      )}

      {rightPanelMode === 'evaluation' && (
        <EvaluationView
          evaluationResult={latestEvaluation}
          submission={latestSubmission}
          onRetry={onRetry}
          onViewHistory={onViewHistory}
        />
      )}

      {rightPanelMode === 'history' && (
        <AttemptHistory
          submissionsWithEvaluations={attemptHistory}
          onClose={() => setRightPanelMode(latestEvaluation ? 'evaluation' : 'workspace')}
          onLoadIntoWorkspace={onLoadSnapshotIntoWorkspace}
        />
      )}
    </div>
  );
}
