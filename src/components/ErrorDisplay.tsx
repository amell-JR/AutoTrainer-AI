import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function ErrorDisplay({ error, onRetry, onBack }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">
              We encountered an issue while processing your request. Don't worry, you can try again.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Error Details
            </h3>
            <p className="text-red-800 text-sm leading-relaxed font-mono bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Common Solutions:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">•</span>
                Check that your file contains the correct column headers ("text"/"label\" or "input"/"output")
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">•</span>
                Ensure your file is under 10MB and contains at least a few data rows
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">•</span>
                Verify that your CSV file is properly formatted with commas separating columns
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">•</span>
                Make sure your JSON file contains an array of objects with consistent properties
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">•</span>
                Try again in a few moments - the training service may be temporarily unavailable
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}