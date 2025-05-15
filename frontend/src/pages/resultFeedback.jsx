import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
import owlImg from "../assets/img/owl.png";
import GoHomeBtn from "../components/buttons/gohomeBtn";
import AllTextBtn from "../components/buttons/allTextBtn";
import FeedbackModal from "../components/madals/feedbackModal";

function ResultFeedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedbackData, setFeedbackData] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // 여기에 API 추가하기 !!!!!!
  // API로부터 데이터를 받아오는 함수
  const fetchFeedbackData = async () => {
    try {
      // 임시 더미 데이터
      const dummyData = {
        summary: {
          total_count: 6,
          feedback_categories: [
            {
              id: "habit",
              name: "말버릇",
              count: 2,
              level: "warning",
              description: "말이 너무 빨라요. 조금만 천천히 해주세요."
            },
            {
              id: "speed",
              name: "속도",
              count: 1,
              level: "warning",
              description: "말이 너무 빨라요. 조금만 천천히 해주세요."
            },
          ]
        },
        segments: [
          {
            id: 1,
            startTime: "00:02",
            endTime: "00:05",
            text: "안녕하세요. 발표자 김강현입니다.",
            feedback: ["habit"]
          },
          {
            id: 2,
            startTime: "00:13",
            endTime: "00:15",
            text: "드디어 미니 프로젝트가 끝이 났는데요.",
            feedback: ["speed", "habit"]
          },
          {
            id: 3,
            startTime: "00:31",
            endTime: "00:35",
            text: "음.. 그럼 이제 저희 프로젝트를 소개하겠습니다.",
            feedback: ["pronunciation", "pronunciation", "intonation"]
          }
        ]
      };
      
      setFeedbackData(dummyData);
    } catch (error) {
      console.error('피드백 데이터를 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    // location.state가 없으면 홈으로 리다이렉트
    if (!location.state?.fileName) {
      navigate('/');
      return;
    }
    fetchFeedbackData();
  }, [location.state?.fileName]);

  if (!feedbackData) {
    return null;
  }

  const handleFeedbackClick = (feedbackId, text) => {
    const category = feedbackData.summary.feedback_categories.find(c => c.id === feedbackId);
    setSelectedFeedback({
      ...category,
      text: text
    });
  };

  // 총 피드백 건수를 카테고리별 count 합산으로 계산
  const totalCount = feedbackData.summary.feedback_categories.reduce(
    (sum, cat) => sum + cat.count, 0
  );

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
                {Array.from({ length: Math.ceil(feedbackData.summary.feedback_categories.length / 2) }).map((_, rowIdx) => (
                  <div className="grid grid-cols-2 gap-x-2" key={rowIdx}>
                    {feedbackData.summary.feedback_categories.slice(rowIdx * 2, rowIdx * 2 + 2).map(cat => (
                      <span
                        key={cat.id}
                        className={cat.level === "warning" ? "text-red-500 font-bold" : "text-green-600 font-bold"}
                      >
                        ㆍ{cat.name} <span className="text-gray-500">{cat.count}건</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-gray-500 mt-2 text-right">총 {totalCount}건 피드백</div>
            </div>
          </div>
          
          {/* 피드백 상세 리스트 */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 pr-2 space-y-3">
            {feedbackData.segments
              .filter(segment =>
                segment.feedback &&
                segment.feedback.some(feedbackId =>
                  feedbackData.summary.feedback_categories.some(cat => cat.id === feedbackId)
                )
              )
              .map((segment) => (
                <div key={segment.id}>
                  <div className="flex items-start">
                    <div className="text-xs text-blue-900 w-24 flex-shrink-0 pt-1">
                      {segment.startTime} - {segment.endTime}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start flex-wrap gap-2">
                        <span className="text-base text-gray-800 relative group">
                          {segment.text}
                          {segment.feedback.some(feedbackId => {
                            const category = feedbackData.summary.feedback_categories.find(c => c.id === feedbackId);
                            return category && category.level === 'warning';
                          }) && (
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-400"></span>
                          )}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {segment.feedback.map(feedbackId => {
                            const category = feedbackData.summary.feedback_categories.find(c => c.id === feedbackId);
                            if (!category || category.level !== 'warning') return null;
                            
                            return (
                              <button
                                key={category.id}
                                onClick={() => handleFeedbackClick(feedbackId, segment.text)}
                                className="px-2 py-0.5 bg-white border border-red-400 text-red-500 text-xs rounded flex items-center font-bold"
                              >
                                <span className="mr-1">⚠️</span>
                                {category.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
          <AllTextBtn 
            onClick={() => navigate("/allContent", { 
              state: { 
                feedbackData,
                fileName: location.state?.fileName 
              }
            })} 
            className="flex-1 text-sm" 
          />
        </div>
      </div>
    </div>
  );
}

export default ResultFeedback;