import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-saf-red-100 to-saf-red-200 rounded-full flex items-center justify-center">
            <FileQuestion className="w-16 h-16 text-saf-red-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-saf-dark-900 mb-4">{title}</h1>
        <p className="text-lg text-saf-dark-600 mb-8">
          This page is under development and will be available soon.
        </p>
        
        <div className="space-y-4">
          <div className="inline-block px-6 py-3 bg-saf-red-50 border border-saf-red-200 rounded-lg">
            <p className="text-sm text-saf-dark-700">
              <span className="font-semibold">Status:</span> Coming Soon
            </p>
          </div>
          
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saf-red-600 to-saf-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-saf-dark-900 mb-3">What's Coming Next?</h3>
          <ul className="text-left text-sm text-saf-dark-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-saf-red-600 mt-1">•</span>
              <span>Comprehensive data management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saf-red-600 mt-1">•</span>
              <span>Advanced search and filtering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saf-red-600 mt-1">•</span>
              <span>Real-time updates and notifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-saf-red-600 mt-1">•</span>
              <span>Export and reporting features</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

