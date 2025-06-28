import React, { useCallback, useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileProcessed: (fileData: FileData, taskType: 'classification' | 'generation') => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export default function FileUpload({ onFileProcessed, onError, onBack }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const validateAndProcessFile = useCallback(async (file: File) => {
    setProcessing(true);
    
    try {
      // Validate file type
      const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      if (!validTypes.some(type => 
        file.type === type || 
        fileExtension === 'csv' || 
        fileExtension === 'json'
      )) {
        throw new Error('Invalid file type. Please upload a CSV or JSON file.');
      }

      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit. Please choose a smaller file.');
      }

      // Read and parse file
      const text = await file.text();
      let data: any[];
      let columns: string[];

      if (fileExtension === 'json') {
        const jsonData = JSON.parse(text);
        if (!Array.isArray(jsonData)) {
          throw new Error('JSON file must contain an array of objects.');
        }
        data = jsonData;
        columns = data.length > 0 ? Object.keys(data[0]) : [];
      } else {
        // Parse CSV
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least a header row and one data row.');
        }
        
        columns = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
          const obj: any = {};
          columns.forEach((col, idx) => {
            obj[col] = values[idx] || '';
          });
          return obj;
        });
      }

      if (data.length === 0) {
        throw new Error('File contains no data rows.');
      }

      // Auto-detect task type
      let taskType: 'classification' | 'generation';
      
      const hasTextAndLabel = columns.includes('text') && columns.includes('label');
      const hasInputAndOutput = columns.includes('input') && columns.includes('output');

      if (hasTextAndLabel && !hasInputAndOutput) {
        taskType = 'classification';
      } else if (hasInputAndOutput && !hasTextAndLabel) {
        taskType = 'generation';
      } else if (hasTextAndLabel && hasInputAndOutput) {
        throw new Error('File contains both classification (text/label) and generation (input/output) columns. Please use only one format.');
      } else {
        throw new Error('Invalid file format. File must contain either "text" and "label" columns for classification, or "input" and "output" columns for generation.');
      }

      const fileData: FileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: data
      };

      onFileProcessed(fileData, taskType);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setProcessing(false);
    }
  }, [onFileProcessed, onError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Dataset</h2>
            <p className="text-gray-600">
              Choose a CSV or JSON file containing your training data
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : processing
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={processing}
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {processing ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                ) : uploadedFile ? (
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                ) : (
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                )}
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {processing
                    ? 'Processing file...'
                    : uploadedFile
                    ? 'File uploaded successfully!'
                    : 'Drop your file here or click to browse'
                  }
                </h3>
                
                {!processing && !uploadedFile && (
                  <p className="text-gray-500 mb-4">
                    Supports CSV and JSON files up to 10MB
                  </p>
                )}

                {uploadedFile && !processing && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <File className="w-4 h-4 mr-2" />
                    <span>{uploadedFile.name}</span>
                    <span className="ml-2">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Required Format</h4>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-blue-600 mb-2">Classification Tasks</h5>
                <p className="text-gray-600 mb-2">Required columns:</p>
                <ul className="text-gray-600 text-xs">
                  <li>• <code className="bg-gray-100 px-1 rounded">text</code> - Input text to classify</li>
                  <li>• <code className="bg-gray-100 px-1 rounded">label</code> - Category or class</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-green-600 mb-2">Generation Tasks</h5>
                <p className="text-gray-600 mb-2">Required columns:</p>
                <ul className="text-gray-600 text-xs">
                  <li>• <code className="bg-gray-100 px-1 rounded">input</code> - Input prompt</li>
                  <li>• <code className="bg-gray-100 px-1 rounded">output</code> - Expected response</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={onBack}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              disabled={processing}
            >
              ← Back to Welcome
            </button>
            
            {uploadedFile && !processing && (
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors duration-200"
              >
                Choose Different File
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}