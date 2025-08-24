import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const ErrorDisplay = ({ 
  message = "It seems we've run into an unexpected issue.", 
  details = "Please try again in a few moments. If the problem persists, please contact support." 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-red-100 border-2 border-red-300 rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-500 text-4xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-red-800 mb-2">
          Oops! Something Went Wrong
        </h1>
        <p className="text-md text-red-700 mb-2">
          {message}
        </p>
        <p className="text-md text-red-600 mb-8">
          {details}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition inline-flex items-center text-lg"
        >
          <FaHome className="mr-2" />
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
