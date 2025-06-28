import React, { useState } from 'react';
import { 
  History, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  Download, 
  Share2, 
  Trash2, 
  Filter,
  Search,
  Calendar,
  BarChart3,
  RefreshCw,
  Eye,
  Copy
} from 'lucide-react';
import { useTrainingJobs } from '../hooks/useTrainingJobs';
import { TrainingJob } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const { jobs, loading, error, fetchJobs } = useTrainingJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesTaskType = taskTypeFilter === 'all' || job.task_type === taskTypeFilter;
    return matchesSearch && matchesStatus && matchesTaskType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'training':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'training':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const handleCopyUrl = async (url: string, jobId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(jobId);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShare = async (job: TrainingJob) => {
    if (job.model_url && navigator.share) {
      try {
        await navigator.share({
          title: `AI Model: ${job.file_name}`,
          text: `Check out my custom AI model trained with AutoTrainer AI!`,
          url: job.model_url,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
  };

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    training: jobs.filter(j => j.status === 'training').length,
    failed: jobs.filter(j => j.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your training history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center"
              >
                ← Back to Training
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <History className="w-8 h-8 mr-3" />
                Training Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage and monitor your AI model training history</p>
            </div>
            <button
              onClick={fetchJobs}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Models</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Loader2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Training</p>
                <p className="text-2xl font-bold text-gray-900">{stats.training}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="training">Training</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={taskTypeFilter}
                onChange={(e) => setTaskTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="classification">Classification</option>
                <option value="generation">Generation</option>
              </select>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredJobs.length} of {jobs.length} models
            </div>
          </div>
        </div>

        {/* Training Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {jobs.length === 0 ? 'No Training History' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {jobs.length === 0 
                ? 'Start training your first AI model to see it here.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {jobs.length === 0 && (
              <button
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Training
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {getStatusIcon(job.status)}
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">{job.file_name}</h3>
                        <span className={`ml-3 ${getStatusBadge(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Started {formatDistanceToNow(job.created_at)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            job.task_type === 'classification' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                          {job.task_type.charAt(0).toUpperCase() + job.task_type.slice(1)}
                        </div>
                        {job.completed_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Completed {formatDistanceToNow(job.completed_at)}
                          </div>
                        )}
                      </div>

                      {job.error_message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-red-800">{job.error_message}</p>
                        </div>
                      )}

                      {job.model_url && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <p className="text-sm font-medium text-green-900 mb-1">Model URL</p>
                              <p className="text-sm text-green-700 font-mono break-all">{job.model_url}</p>
                            </div>
                            <button
                              onClick={() => handleCopyUrl(job.model_url!, job.id)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                copiedUrl === job.id
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                              }`}
                            >
                              {copiedUrl === job.id ? 'Copied!' : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      {job.status === 'completed' && job.model_url && (
                        <>
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <a
                            href={job.model_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Open Model"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                          {navigator.share && (
                            <button
                              onClick={() => handleShare(job)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                              title="Share Model"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Model Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Model Details</h2>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">File Name</p>
                      <p className="text-sm text-gray-900">{selectedJob.file_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Task Type</p>
                      <p className="text-sm text-gray-900 capitalize">{selectedJob.task_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={getStatusBadge(selectedJob.status)}>
                        {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created</p>
                      <p className="text-sm text-gray-900">{new Date(selectedJob.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedJob.model_url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Access</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Model URL</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedJob.model_url}
                          readOnly
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                        />
                        <button
                          onClick={() => handleCopyUrl(selectedJob.model_url!, selectedJob.id)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Close
                  </button>
                  {selectedJob.model_url && (
                    <a
                      href={selectedJob.model_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Model
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}