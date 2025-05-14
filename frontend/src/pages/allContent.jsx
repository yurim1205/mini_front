import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import FeedbackModal from "../components/madals/feedbackModal";

function AllContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { feedbackData } = location.state || {};
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  if (!feedbackData) {
    navigate('/');
    return null;
  }

  const handleFeedbackClick = (feedbackId, text) => {
    const category = feedbackData.summary.feedback_categories.find(c => c.id === feedbackId);
    setSelectedFeedback({
      ...category,
      text: text
    });
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-start bg-gray-100 relative">
      <div
        className="relative min-h-screen flex flex-col items-center justify-start max-w-[360px] w-full"
        style={{
          background: "linear-gradient(to top, #fff 0%, #fff 25%, #6699E6 60%)"
        }}
      >
        <div className="flex items-center w-full px-4 pt-4 justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent p-0 leading-none"
            style={{ width: '2.25rem', height: '2.25rem' }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-xl font-semibold text-white text-center flex-1">
            전체 내용 보기
          </span>
          <div style={{ width: '2.25rem' }} />
        </div>

        {/* 내용 카드 */}
        <div className="border border-white rounded-xl shadow p-4 mt-6 w-[92%] mx-auto bg-transparent flex flex-col h-[600px]">
          <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto">
            {feedbackData.segments.map((segment) => {
              const warningFeedbacks = segment.feedback
                .map(feedbackId => {
                  const category = feedbackData.summary.feedback_categories.find(c => c.id === feedbackId);
                  return category && category.level === 'warning' ? category : null;
                })
                .filter(Boolean);

              return (
                <div key={segment.id} className="mb-4">
                  <div className="relative inline-block">
                    <p className="text-gray-800 leading-relaxed">
                      {segment.text}
                    </p>
                    {warningFeedbacks.length > 0 && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-400"></span>
                    )}
                  </div>
                  {warningFeedbacks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {warningFeedbacks.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleFeedbackClick(category.id, segment.text)}
                          className="inline-flex items-center px-2 py-0.5 bg-white border border-red-400 text-red-500 text-xs rounded"
                        >
                          <span className="mr-1">⚠️</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <FeedbackModal 
          feedback={selectedFeedback} 
          onClose={() => setSelectedFeedback(null)}
          text={selectedFeedback?.text}
        />
      </div>
    </div>
  );
}

export default AllContent;