import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import owlImg from "../assets/img/owl.png";
import GoHomeBtn from "../components/buttons/gohomeBtn";
import AllTextBtn from "../components/buttons/allTextBtn";

function ResultFeedback() {
  const navigate = useNavigate();

  // 더미 피드백 데이터
  const feedbackSummary = [
    { type: "말버릇", count: 2, color: "text-red-500" },
    { type: "속도", count: 1, color: "text-red-500" },
    { type: "억양", count: 1, color: "text-green-600" },
    { type: "발음", count: 2, color: "text-green-600" },
  ];
  const totalCount = feedbackSummary.reduce((acc, cur) => acc + cur.count, 0);

  // 피드백 상세 더미 데이터
  const feedbackList = [
    {
      time: "00:02",
      text: "안녕하세요. 발표자 김강현입니다.",
      badges: [],
    },
    {
      time: "00:13",
      text: "드디어 미니 프로젝트가 끝이 났는데요.",
      badges: ["속도"],
    },
    {
      time: "00:31",
      text: "음.. 그럼 이제 저희 프로젝트를 소개하겠습니다.",
      badges: ["속도", "발음", "억양"],
    },
  ];

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
            onClick={() => navigate("/filefeedback")}
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
        <div className="border border-white rounded-xl shadow p-4 mt-6 w-[92%] mx-auto bg-transparent">
          {/* 상단 요약 카드만 별도 div로 묶고 배경색 지정 */}
          <div className="flex items-center mb-2 bg-white rounded-lg px-3 py-2">
            <img src={owlImg} alt="owl" className="w-14 h-14 mr-3" />
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1 items-center">
                <span className="text-red-500 font-bold">ㆍ말버릇 <span className="text-gray-500">2건</span></span>
                <span className="text-red-500 font-bold">ㆍ속도 <span className="text-gray-500">1건</span></span>
                <span className="text-green-300 font-bold">ㆍ억양 <span className="text-gray-500">1건</span></span>
                <span className="text-green-300 font-bold">ㆍ발음 <span className="text-gray-500">2건</span></span>
              </div>
              <div className="text-gray-500 mt-1">총 {totalCount}건 피드백</div>
            </div>
          </div>
          {/* 피드백 상세 리스트 */}
          <div className="w-full">
            {feedbackList.map((item, idx) => (
              <div key={idx} className="mb-3">
                {item.time && <div className="text-xs text-blue-900 mb-1">{item.time}</div>}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-base text-gray-800">{item.text}</span>
                  {item.badges.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-white border border-red-400 text-red-500 text-xs rounded flex items-center font-bold">
                      <span className="mr-1">⚠️</span>{item.badges.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 버튼 수평 배치 */}
        <div className="flex w-full gap-x-2 px-4 mt-6">
          <GoHomeBtn onClick={() => navigate("/")} className="flex-1 text-sm" />
          <AllTextBtn onClick={() => navigate("/")} className="flex-1 text-sm" />
        </div>
      </div>
    </div>
  );
}

export default ResultFeedback;