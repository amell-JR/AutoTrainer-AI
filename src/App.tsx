import React, { useState } from 'react';
import Welcome from './components/Welcome';
import FileUpload from './components/FileUpload';
import TrainingProgress from './components/TrainingProgress';
import Results from './components/Results';
import ErrorDisplay from './components/ErrorDisplay';
import { AppState, FileData, TrainingResponse } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 'welcome',
    fileData: null,
    taskType: null,
    trainingProgress: 0,
    results: null,
    error: null
  });

  const handleStart = () => {
    setAppState(prev => ({ ...prev, currentStep: 'upload' }));
  };

  const handleFileProcessed = (fileData: FileData, taskType: 'classification' | 'generation') => {
    setAppState(prev => ({
      ...prev,
      currentStep: 'training',
      fileData,
      taskType,
      error: null
    }));
  };

  const handleTrainingComplete = (results: TrainingResponse) => {
    setAppState(prev => ({
      ...prev,
      currentStep: 'results',
      results,
      trainingProgress: 100
    }));
  };

  const handleError = (error: string) => {
    setAppState(prev => ({
      ...prev,
      currentStep: 'error',
      error
    }));
  };

  const handleBackToWelcome = () => {
    setAppState({
      currentStep: 'welcome',
      fileData: null,
      taskType: null,
      trainingProgress: 0,
      results: null,
      error: null
    });
  };

  const handleBackToUpload = () => {
    setAppState(prev => ({
      ...prev,
      currentStep: 'upload',
      error: null
    }));
  };

  const handleRetry = () => {
    if (appState.fileData && appState.taskType) {
      setAppState(prev => ({
        ...prev,
        currentStep: 'training',
        error: null,
        trainingProgress: 0
      }));
    } else {
      handleBackToUpload();
    }
  };

  switch (appState.currentStep) {
    case 'welcome':
      return <Welcome onStart={handleStart} />;
    
    case 'upload':
      return (
        <FileUpload
          onFileProcessed={handleFileProcessed}
          onError={handleError}
          onBack={handleBackToWelcome}
        />
      );
    
    case 'training':
      return (
        <TrainingProgress
          fileData={appState.fileData!}
          taskType={appState.taskType!}
          onComplete={handleTrainingComplete}
          onError={handleError}
        />
      );
    
    case 'results':
      return (
        <Results
          results={appState.results!}
          onStartNew={handleBackToWelcome}
        />
      );
    
    case 'error':
      return (
        <ErrorDisplay
          error={appState.error!}
          onRetry={handleRetry}
          onBack={handleBackToWelcome}
        />
      );
    
    default:
      return <Welcome onStart={handleStart} />;
  }
}

export default App;