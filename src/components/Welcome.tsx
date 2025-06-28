import React from 'react';
import { Upload, Zap, Share2, Brain, History, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AutoTrainer AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Upload. Train. Deploy. Your custom AI in minutes.
          </p>
          
          <p className="text-sm text-gray-500 font-medium mb-8">
            Powered by <span className="text-blue-600 font-semibold">JR-Solvy</span>
          </p>

          {user && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-8 inline-block">
              <p className="text-green-800 font-medium">
                Welcome back, {user.email}! Ready to train your next AI model?
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Transform Your Data Into AI Models
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Upload your dataset and watch as our platform automatically detects your task type, 
              fine-tunes a custom AI model, and provides you with a deployable solution. 
              {user ? ' Your models are saved to your account for easy access.' : ' Sign up to save and manage your models.'}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Data</h3>
                <p className="text-sm text-gray-600">
                  CSV or JSON files with classification or generation format
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Train</h3>
                <p className="text-sm text-gray-600">
                  Automatic task detection and model fine-tuning
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Deploy</h3>
                <p className="text-sm text-gray-600">
                  Get shareable links to your custom AI model
                </p>
              </div>
            </div>

            {user && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border">
                  <History className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Training History</h4>
                  <p className="text-xs text-gray-600">Access all your previous models</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border">
                  <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">Secure Storage</h4>
                  <p className="text-xs text-gray-600">Your models are safely stored</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Supported Formats:</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-600">Classification:</span>
                  <p className="text-gray-600">Files with "text" and "label" columns</p>
                </div>
                <div>
                  <span className="font-medium text-green-600">Generation:</span>
                  <p className="text-gray-600">Files with "input" and "output" columns</p>
                </div>
              </div>
            </div>

            <button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              Start Training Your AI Model
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Demo-scale datasets only. Data is processed temporarily and securely.
          </p>
        </div>
      </div>
    </div>
  );
}