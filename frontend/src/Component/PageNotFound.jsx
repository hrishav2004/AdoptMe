import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PiPawPrintFill } from 'react-icons/pi';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center text-purple-700 font-bold mb-4">
          <span className="text-8xl md:text-9xl">4</span>
          <PiPawPrintFill className="text-yellow-400 text-7xl md:text-8xl mx-2 transform rotate-12" />
          <span className="text-8xl md:text-9xl">4</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          It looks like you've wandered off the beaten path. Let's get you back home!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition inline-flex items-center text-lg"
        >
          <FaHome className="mr-2" />
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
