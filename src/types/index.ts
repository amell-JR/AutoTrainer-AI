export interface FileData {
  name: string;
  size: number;
  type: string;
  data: any[];
}

export interface TrainingRequest {
  file: File;
  taskType: 'classification' | 'generation';
}

export interface TrainingResponse {
  status: 'success' | 'error';
  model_url?: string;
  message?: string;
  error?: string;
}

export interface TrainingJob {
  id: string;
  user_id: string;
  file_name: string;
  task_type: 'classification' | 'generation';
  status: 'pending' | 'training' | 'completed' | 'failed';
  model_url?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export type AppStep = 'welcome' | 'upload' | 'training' | 'results' | 'error';

export interface AppState {
  currentStep: AppStep;
  fileData: FileData | null;
  taskType: 'classification' | 'generation' | null;
  trainingProgress: number;
  results: TrainingResponse | null;
  error: string | null;
}