import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function AllContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [qaPairs, setQaPairs] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState(null);
  const [fullText, setFullText] = useState("");

  useEffect(() => {
    if (location.state?.fullText) {
      console.log("fullText:", location.state.fullText);
      setFullText(location.state.fullText);
    }
  }, [location.state]);

  const handleGenerateQuestions = async () => {
    if (!fullText) {
      setQaError('full_text가 없습니다.');
      return;
    }
    setQaLoading(true);
    setQaError(null);
    try {
      const formData = new FormData();
      formData.append("text", fullText);
      const res = await fetch('http://192.168.0.195:8000/api/speech/questions', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('질문 생성 실패');
      const data = await res.json();
      console.log('API 응답:', data);
      setQaPairs(data.questions_and_answers || []);
    } catch (e) {
      setQaError('질문/답변 생성 중 오류가 발생했습니다.');
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-start bg-gray-100 relative">
      <div className="relative min-h-screen flex flex-col items-center justify-start max-w-[360px] w-full"
        style={{ background: "linear-gradient(to top, #fff 0%, #fff 25%, #6699E6 60%)" }}>
        <div className="flex items-center w-full px-4 pt-4 justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent p-0 leading-none"
            style={{ width: '2.25rem', height: '2.25rem' }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-xl font-semibold text-white text-center flex-1">
            예상 질문 확인
          </span>
          <div style={{ width: '2.25rem' }} />
        </div>
        <div className="border border-white rounded-xl shadow p-4 mt-6 w-[92%] mx-auto bg-transparent flex flex-col h-[600px]">
          <div className="p-4 h-[calc(100vh-220px)] overflow-y-auto">
            {!fullText && <div className="text-gray-500">full_text가 없습니다. 이전 단계에서 분석을 완료해주세요.</div>}
            {qaLoading && <div>예상 질문을 불러오는 중...</div>}
            {qaError && <div className="text-red-500">{qaError}</div>}
            {qaPairs.map((qa, idx) => (
              <div
                key={qa.id || idx}
                className="mb-4 p-4 rounded"
              >
                <div className="font-bold text-blue-900 mb-1">
                  Q{idx + 1}. {qa.question}
                </div>
                <div className="font-bold text-gray-800 mb-2">
                  A{idx + 1}. <span className="font-normal">{qa.answer}</span>
                </div>
                <hr className="border-t border-blue-200 my-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllContent;