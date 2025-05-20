import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const CATEGORY_META = [
  { id: "speed", name: "속도", description: "말이 너무 빨라요. 조금만 천천히 해주세요." },
  { id: "volume", name: "볼륨", description: "음성이 너무 작아요. 더 크게 말해보세요." },
  { id: "intonation", name: "억양", description: "억양을 자연스럽게 해주세요." },
  { id: "pronunciation", name: "발음", description: "발음을 명확하게 해주세요." },
  { id: "filler", name: "말버릇", description: "말버릇이 자주 나타납니다. 주의가 필요해요." },
  { id: "vocabulary", name: "어휘", description: "과장된 표현입니다." },
  { id: "silence", name: "침묵", description: "침묵이 너무 길어요." }
];

const FeedbackModal = ({ feedback, onClose, text }) => {
  if (!feedback) return null;

  // 어떤 카테고리 버튼이 눌렸는지 판별 (speed, volume 등)
  const categoryId = feedback.categoryId || CATEGORY_META.find(cat => feedback[cat.id])?.id;
  const categoryName = CATEGORY_META.find(cat => cat.id === categoryId)?.name;
  const categoryDesc = CATEGORY_META.find(cat => cat.id === categoryId)?.description;

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
        {/* 상단: 피드백 유형 */}
        <div className="flex items-center justify-start mb-2">
          <span className="text-lg font-bold text-yellow-600 flex items-center">
            <span className="mr-2">⚠️</span>
            {categoryName}
          </span>
        </div>
        {/* 중간: 해당 segment의 텍스트 */}
        {text && (
          <p className="text-gray-600 text-sm mb-2 bg-[#CCDDF7] p-2 rounded text-center">
            "{text}"
          </p>
        )}
        {/* 하단: 유형별 상세 피드백 */}
        <div className="text-center text-gray-700 mt-2">
          {categoryDesc}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 