import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Welcome from './components/Welcome';
import FileUpload from './components/FileUpload';
import TrainingProgress from './components/TrainingProgress';
import Results from './components/Results';
import ErrorDisplay from './components/ErrorDisplay';
import Dashboard from './components/Dashboard';
import { AppState, FileData, TrainingResponse } from './types';

type AppView = 'main' | 'dashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('main');
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
    setCurrentView('main');
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

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackFromDashboard = () => {
    setCurrentView('main');
  };

  const renderMainContent = () => {
    switch (appState.currentStep) {
      case 'welcome':
        return <Welcome onStart={handleStart} onNavigateToDashboard={handleNavigateToDashboard} />;
      
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
            onViewDashboard={handleNavigateToDashboard}
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
        return <Welcome onStart={handleStart} onNavigateToDashboard={handleNavigateToDashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onNavigateToDashboard={handleNavigateToDashboard}
        showDashboardButton={currentView === 'main'}
      />
      
      {currentView === 'dashboard' ? (
        <Dashboard onBack={handleBackFromDashboard} />
      ) : (
        renderMainContent()
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;