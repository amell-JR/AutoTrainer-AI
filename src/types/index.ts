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

export type AppStep = 'welcome' | 'upload' | 'training' | 'results' | 'error';

export interface AppState {
  currentStep: AppStep;
  fileData: FileData | null;
  taskType: 'classification' | 'generation' | null;
  trainingProgress: number;
  results: TrainingResponse | null;
  error: string | null;
}