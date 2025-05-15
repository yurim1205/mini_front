import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import owlImg from "../assets/img/owl.png"; 
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
import AnalysisBtn from "../components/common/analysisBtn";

function FileFeedback() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
  };

  const handleClearFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalysis = async () => {
    try {
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);

      // 1. POST 요청 시작 및 응답 대기
      const response = await fetch('http://192.168.0.195:8000/api/speech/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      const filteredSegments = data.segments.filter(
        segment =>
          CATEGORY_META.some(cat => segment[cat.id])
      );

      const visibleCategoryCounts = CATEGORY_META.map(cat => {
        const count = filteredSegments.filter(segment =>
          segment[cat.id]
        ).length;
        return { ...cat, visibleCount: count };
      });

      navigate('/loading', { state: { data, fileName } });
    } catch (error) {
      console.error('파일 처리 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div
        className="relative h-screen flex flex-col items-center max-w-[360px] w-full"
        style={{
          background: "linear-gradient(to bottom, #6699E6 0%, #fff 100%)"
        }}
      >
        <div className="flex items-center w-full px-4 pt-6 justify-between">
          <button
            onClick={() => navigate("/")}
            className="bg-transparent p-0 leading-none"
            style={{ width: '2.25rem', height: '2.25rem' }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-xl font-semibold text-white text-center flex-1">
            음성 파일로 피드백 받기
          </span>
          <div style={{width: '2.25rem'}} />
        </div>

        <img
          src={owlImg}
          alt="owl"
          className="w-32 mx-auto mt-12"
        />

        <div
          className="rounded-3xl rounded-b-none shadow-md w-full px-6 py-6 mt-0 flex flex-col items-center min-h-screen"
          style={{
            background: "linear-gradient(to bottom, #e0eaff 0%, #fff 60%)"
          }}
        >
          {/* 파일 업로드 부분 */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              className="border border-black px-3 py-2 w-full placeholder-gray-400 pr-24 font-bold text-gray-600"
              placeholder="파일을 선택하세요"
              readOnly
              value={fileName}
            />
            {fileName ? (
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
                onClick={handleClearFile}
                tabIndex={-1}
              >
                <XMarkIcon className="w-5 h-5 text-[#666666] bg-[#E1EBFA] rounded-full" />
              </button>
            ) : (
              <button
                type="button"
                className="
                  absolute top-1/2 right-2 -translate-y-1/2
                  border border-black
                  px-2 py-1
                  bg-white
                  rounded-none
                  text-sm
                  shadow
                  hover:shadow-md
                  active:shadow-inner
                  transition
                "
                onClick={handleButtonClick}
                style={{height: 'calc(100% - 8px)'}}
              >
                파일 선택
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".wav,.mp3,.m4a"      // 파일 확장자 제한
            />
          </div>
          <ul className="text-sm text-gray-500 w-full list-disc pl-4">
            <li>파일의 확장자는 .wav, .mp3, .m4a여야 하며 최대 nMB까지의 파일만 업로드 가능합니다.</li>
            <li>길이가 n분을 초과하면 정확도가 떨어질 수 있습니다.</li>
            <li>음성이 너무 작거나 주변 소음이 심하면 정확도가 떨어질 수 있습니다.</li>
          </ul>

          <AnalysisBtn 
            onClick={handleAnalysis} 
            className={`w-56 ${!fileName && 'opacity-50 cursor-not-allowed'}`}
            disabled={!fileName}
          />
        </div>
      </div>
    </div>
  );
}

export default FileFeedback;