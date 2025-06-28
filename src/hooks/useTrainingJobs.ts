import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TrainingJob } from '../types';

export function useTrainingJobs() {
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchJobs = async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch training jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (fileName: string, taskType: 'classification' | 'generation') => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('training_jobs')
      .insert({
        user_id: user.id,
        file_name: fileName,
        task_type: taskType,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateJob = async (
    jobId: string, 
    updates: Partial<Pick<TrainingJob, 'status' | 'model_url' | 'error_message' | 'completed_at'>>
  ) => {
    const { error } = await supabase
      .from('training_jobs')
      .update(updates)
      .eq('id', jobId);

    if (error) throw error;
    await fetchJobs(); // Refresh the jobs list
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob
  };
}