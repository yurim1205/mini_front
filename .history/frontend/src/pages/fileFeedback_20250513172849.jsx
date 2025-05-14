import React from "react";
import { useNavigate } from "react-router-dom";
import owlImg from "../assets/img/owl.png"; // 부엉이 이미지 경로에 맞게 수정

function FileUploadPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div
        className="relative h-screen flex flex-col items-center max-w-[360px] w-full"
        style={{
          background: "linear-gradient(to bottom, #6699E6 0%, #6699E6 40%, #fff 100%)"
        }}
      >
        {/* 상단: 뒤로가기 + 타이틀 */}
        <div className="flex items-center w-full px-4 pt-6">
          <button onClick={() => navigate(-1)} className="text-2xl mr-2">{'←'}</button>
          <span className="text-lg font-semibold mx-auto">음성 파일로 피드백 받기</span>
        </div>

        {/* 중앙: 부엉이 이미지 */}
        <img
          src={owlImg}
          alt="owl"
          className="w-32 mx-auto mt-8"
        />

        {/* 카드 박스 */}
        <div className="bg-white rounded-t-2xl shadow-md w-full px-6 py-6 mt-8 flex flex-col items-center">
          {/* 파일 업로드 영역 */}
          <div className="flex w-full mb-4">
            <input
              type="text"
              className="border border-black rounded-l px-2 py-1 flex-1"
              placeholder="파일을 선택하세요"
              readOnly
            />
            <button className="border border-black border-l-0 rounded-r px-4 py-1 bg-gray-100">
              파일 선택
            </button>
          </div>
          {/* 안내 문구 */}
          <ul className="text-xs text-gray-700 w-full list-disc pl-4">
            <li>파일의 확장자는 .wav, .mp3, .m4a여야 하며 최대 nMB까지의 파일만 업로드 가능합니다.</li>
            <li>길이가 n분을 초과하면 정확도가 떨어질 수 있습니다.</li>
            <li>음성이 너무 작거나 주변 소음이 심하면 정확도가 떨어질 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileUploadPage;