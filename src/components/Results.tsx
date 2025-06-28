import React from 'react';
import { CheckCircle2, Copy, Share2, ExternalLink, RotateCcw } from 'lucide-react';
import { TrainingResponse } from '../types';

interface ResultsProps {
  results: TrainingResponse;
  onStartNew: () => void;
}

export default function Results({ results, onStartNew }: ResultsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = async () => {
    if (results.model_url) {
      try {
        await navigator.clipboard.writeText(results.model_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  const handleShare = async () => {
    if (results.model_url && navigator.share) {
      try {
        await navigator.share({
          title: 'My Custom AI Model',
          text: 'Check out my custom AI model created with AutoTrainer AI!',
          url: results.model_url,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Your AI Model is Ready!
            </h2>
            <p className="text-gray-600">
              Congratulations! Your custom AI model has been successfully trained and deployed.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2" />
              Your Model URL
            </h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={results.model_url}
                readOnly
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleCopyUrl}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {copied && (
              <p className="text-sm text-green-600 mb-4">✓ URL copied to clipboard!</p>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href={results.model_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Model
              </a>

              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Model
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-green-600 mr-2">1.</span>
                Test your model by visiting the URL above
              </li>
              <li className="flex items-start">
                <span className="font-medium text-green-600 mr-2">2.</span>
                Share your model with colleagues or integrate it into your applications
              </li>
              <li className="flex items-start">
                <span className="font-medium text-green-600 mr-2">3.</span>
                Use the model for inference on new data similar to your training set
              </li>
              <li className="flex items-start">
                <span className="font-medium text-green-600 mr-2">4.</span>
                Return here to train additional models with different datasets
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo deployment. For production use, consider implementing 
              proper authentication, rate limiting, and monitoring for your AI model.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onStartNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Train Another Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}