/*
  # Create training jobs table

  1. New Tables
    - `training_jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `task_type` (text, either 'classification' or 'generation')
      - `status` (text, training status)
      - `model_url` (text, nullable)
      - `error_message` (text, nullable)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `training_jobs` table
    - Add policy for users to read their own training jobs
    - Add policy for users to insert their own training jobs
    - Add policy for users to update their own training jobs
*/

CREATE TABLE IF NOT EXISTS training_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('classification', 'generation')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'training', 'completed', 'failed')),
  model_url text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE training_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own training jobs"
  ON training_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training jobs"
  ON training_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training jobs"
  ON training_jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_training_jobs_user_id ON training_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_training_jobs_created_at ON training_jobs(created_at DESC);