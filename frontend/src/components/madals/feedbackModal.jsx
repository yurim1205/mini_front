import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const FeedbackModal = ({ feedback, onClose, text }) => {
  if (!feedback) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-4 w-[300px] relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 bg-transparent p-0"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>
        <div className="flex items-center mb-2">
          <span className="mr-2">⚠️</span>
          <span className="text-red-500 font-bold">
            {feedback.name}
          </span>
        </div>
        {text && (
          <p className="text-gray-600 text-sm mb-2 bg-[#CCDDF7] p-2 rounded">
            "{text}"
          </p>
        )}
        <p className="text-gray-700 text-sm">
          {feedback.description}
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal; 