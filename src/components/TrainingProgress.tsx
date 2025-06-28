import React, { useEffect, useState } from 'react';
import { Brain, Loader2, Zap } from 'lucide-react';
import { FileData, TrainingResponse } from '../types';
import { useTrainingJobs } from '../hooks/useTrainingJobs';
import { useAuth } from '../contexts/AuthContext';

interface TrainingProgressProps {
  fileData: FileData;
  taskType: 'classification' | 'generation';
  onComplete: (results: TrainingResponse) => void;
  onError: (error: string) => void;
}

export default function TrainingProgress({ 
  fileData, 
  taskType, 
  onComplete, 
  onError 
}: TrainingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Preparing data...');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const { createJob, updateJob } = useTrainingJobs();
  const { user } = useAuth();

  useEffect(() => {
    const trainModel = async () => {
      try {
        // Create training job record if user is authenticated
        let jobId: string | null = null;
        if (user) {
          const job = await createJob(fileData.name, taskType);
          jobId = job.id;
          setCurrentJobId(jobId);
          
          // Update job status to training
          await updateJob(jobId, { status: 'training' });
        }

        // Simulate progress updates
        const steps = [
          'Preparing data...',
          'Validating dataset...',
          'Initializing model...',
          'Starting fine-tuning...',
          'Training in progress...',
          'Finalizing model...',
          'Generating deployment...'
        ];

        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i]);
          setProgress(((i + 1) / steps.length) * 80); // Leave 20% for actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Create FormData for API request
        const formData = new FormData();
        
        // Convert data back to file format for API
        let fileContent: string;
        if (fileData.name.endsWith('.json')) {
          fileContent = JSON.stringify(fileData.data, null, 2);
        } else {
          // Convert to CSV
          const headers = Object.keys(fileData.data[0]);
          const csvRows = [
            headers.join(','),
            ...fileData.data.map(row => 
              headers.map(header => 
                typeof row[header] === 'string' && row[header].includes(',') 
                  ? `"${row[header]}"` 
                  : row[header]
              ).join(',')
            )
          ];
          fileContent = csvRows.join('\n');
        }

        const blob = new Blob([fileContent], { 
          type: fileData.name.endsWith('.json') ? 'application/json' : 'text/csv' 
        });
        const file = new File([blob], fileData.name, { type: blob.type });
        
        formData.append('file', file);
        formData.append('task_type', taskType);

        setCurrentStep('Submitting to training service...');
        setProgress(90);

        // Make API request
        const response = await fetch('https://huggingface.co/spaces/JR-Digital/AutoTrainerAI/train', {
          method: 'POST',
          body: formData,
        });

        setProgress(100);

        if (!response.ok) {
          throw new Error(`Training service returned error: ${response.status}`);
        }

        const results: TrainingResponse = await response.json();
        
        if (results.status === 'success') {
          // Update job record with success
          if (jobId) {
            await updateJob(jobId, {
              status: 'completed',
              model_url: results.model_url,
              completed_at: new Date().toISOString()
            });
          }
          onComplete(results);
        } else {
          const errorMessage = results.error || results.message || 'Training failed';
          
          // Update job record with failure
          if (jobId) {
            await updateJob(jobId, {
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString()
            });
          }
          
          onError(errorMessage);
        }

      } catch (error) {
        console.error('Training error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Training failed';
        
        // Update job record with failure
        if (currentJobId) {
          try {
            await updateJob(currentJobId, {
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString()
            });
          } catch (updateError) {
            console.error('Failed to update job status:', updateError);
          }
        }
        
        onError(errorMessage);
      }
    };

    trainModel();
  }, [fileData, taskType, onComplete, onError, user, createJob, updateJob]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Training Your AI Model</h2>
            <p className="text-gray-600">
              Sit back and relax while we fine-tune your custom AI model
            </p>
            
            {user && (
              <p className="text-sm text-blue-600 mt-2">
                This training session will be saved to your account
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-900">Training Progress</span>
                <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center mt-4">
                <Zap className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">{currentStep}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border text-center">
                <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Task Type</p>
                <p className="text-xs text-gray-600 capitalize">{taskType}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border text-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-bold text-green-600">{fileData.data.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Data Points</p>
                <p className="text-xs text-gray-600">Training samples</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border text-center">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-bold text-purple-600">AI</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Model</p>
                <p className="text-xs text-gray-600">Custom fine-tuned</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What's happening:</strong> Your dataset is being processed and used to fine-tune a pre-trained language model. 
                This creates a custom AI model optimized for your specific task and data patterns.
                {user && ' This training session is being saved to your account for future reference.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center text-sm text-gray-500">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Estimated time: 2-5 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}