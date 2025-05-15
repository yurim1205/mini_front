import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import owlImg from "../assets/img/owl.png";
import GoHomeBtn from "../components/buttons/gohomeBtn";
// import AllTextBtn from "../components/buttons/allTextBtn";
import FeedbackModal from "../components/madals/feedbackModal";

const CATEGORY_META = [
  { id: "speed", name: "속도", description: "말이 너무 빨라요. 조금만 천천히 해주세요." },
  { id: "volume", name: "볼륨", description: "음성이 너무 작아요. 더 크게 말해보세요." },
  { id: "intonation", name: "억양", description: "억양이 자연스러워요." },
  { id: "pronunciation", name: "발음", description: "발음이 명확해요." },
  { id: "filler", name: "말버릇", description: "말버릇이 자주 나타납니다. 주의가 필요해요." },
  { id: "silence", name: "침묵", description: "침묵이 길어요. 자연스럽게 이어가보세요." }
];

function ResultFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedbackData, setFeedbackData] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    if (!location.state?.result) {
      navigate('/');
      return;
    }
    setFeedbackData(location.state.result);
  }, [location.state?.result, navigate]);

  if (!feedbackData) {
    return null;
  }

  const handleFeedbackClick = (feedbackId, text) => {
    const category = feedbackData.segments.find(c => c.id === feedbackId);
    setSelectedFeedback({
      ...category,
      text: text
    });
  };

  const filteredSegments = feedbackData.segments.filter(
    segment =>
      CATEGORY_META.some(cat => segment[cat.id])
  );
  const visibleCategoryCounts = CATEGORY_META.map(cat => {
    const count = filteredSegments.filter(segment =>
      segment[cat.id]
    ).length;
    return { ...cat, visibleCount: count };
  });
  
  // 총 피드백 수: 화면에 보이는 segment들의 카테고리별 등장 횟수 합산
  const totalCount = visibleCategoryCounts.reduce((sum, cat) => sum + cat.visibleCount, 0);

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
            onClick={() => navigate("/file")}
            className="bg-transparent p-0 leading-none"
            style={{ width: '2.25rem', height: '2.25rem' }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-xl font-semibold text-white text-center flex-1">
            피드백 확인
          </span>
          <div style={{ width: '2.25rem' }} />
        </div>
        {/* 큰 사각형 카드 */}
        <div className="border border-white rounded-xl shadow p-4 mt-6 w-[92%] mx-auto bg-transparent flex flex-col h-[600px]">
         
          {/* 상단 요약 카드 */}
          <div className="flex items-center mb-4 bg-white rounded-lg px-3 py-2 flex-shrink-0">
            <img src={owlImg} alt="owl" className="w-14 h-14 mr-3" />
            <div className="flex-1 text-xs">
              <div className="flex flex-col gap-y-1">
                {Array.from({ length: Math.ceil(visibleCategoryCounts.length / 2) }).map((_, rowIdx) => (
                  <div className="grid grid-cols-2 gap-x-2" key={rowIdx}>
                    {visibleCategoryCounts.slice(rowIdx * 2, rowIdx * 2 + 2).map(cat => (
                      <span
                        key={cat.id}
                        className={"font-bold text-red-500"}
                      >
                        ㆍ{cat.name} <span className="text-gray-500">{cat.visibleCount}건</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-gray-500 mt-2 text-right">총 {totalCount}건 피드백</div>
            </div>
          </div>
          
          {/* 피드백 상세 리스트 */}
          <div className="flex-1 overflow-y-scroll scrollbar scrollbar-thumb-white scrollbar-track-blue-200 pr-2 space-y-3">
            {filteredSegments.map((segment) => {
              // 카테고리 값이 하나라도 있으면 밑줄
              const hasWarning = CATEGORY_META.some(cat => segment[cat.id]);
              return (
                <div key={segment.id}>
                  <div className="flex items-start">
                    <div className="text-xs text-blue-900 w-24 flex-shrink-0 pt-1">
                      {segment.startPoint} - {segment.endPoint}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start flex-wrap gap-2">
                        <span className={`text-base text-gray-800 ${hasWarning ? 'border-b-2 border-red-400' : ''} block`}>
                          {segment.word}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {CATEGORY_META.map(cat => (
                            segment[cat.id] ? (
                              <button
                                key={`${segment.id}-${cat.id}`}
                                onClick={() => handleFeedbackClick(segment.id, segment.word)}
                                className="px-2 py-0.5 bg-white border text-xs rounded flex items-center font-bold border-red-400 text-red-500"
                              >
                                <span className="mr-1 text-red-500">⚠️</span>
                                {cat.name}
                              </button>
                            ) : null
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 피드백 상세 모달 */}
        <FeedbackModal 
          feedback={selectedFeedback} 
          onClose={() => setSelectedFeedback(null)}
          text={selectedFeedback?.text}
        />
        
        {/* 버튼 수평 배치 */}
        <div className="flex w-full gap-x-2 px-4 mt-6">
          <GoHomeBtn onClick={() => navigate("/")} className="flex-1 text-sm" />
          {/* <AllTextBtn 
            onClick={() => navigate("/allContent", { 
              state: { 
                feedbackData,
                fileName: location.state?.fileName 
              }
            })} 
            className="flex-1 text-sm" 
          /> */}
        </div>
      </div>
    </div>
  );
}

export default ResultFeedback;