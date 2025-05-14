import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import owlImg from "../assets/img/owl.png"; 
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function FileFeedback() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // 파일명 표시 등 원하는 동작
    // 예: setFileName(e.target.files[0]?.name || "");
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
            onClick={() => navigate(-1)}
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
              className="border border-black px-3 py-2 w-full placeholder-gray-400 pr-24"
              placeholder="파일을 선택하세요"
              readOnly
            />
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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".wav,.mp3,.m4a"
            />
          </div>
          <ul className="text-sm text-gray-500 w-full list-disc pl-4">
            <li>파일의 확장자는 .wav, .mp3, .m4a여야 하며 최대 nMB까지의 파일만 업로드 가능합니다.</li>
            <li>길이가 n분을 초과하면 정확도가 떨어질 수 있습니다.</li>
            <li>음성이 너무 작거나 주변 소음이 심하면 정확도가 떨어질 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileFeedback;