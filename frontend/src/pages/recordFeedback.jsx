import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import owlImg from "../assets/img/owl.png"; 
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function RecordFeedback() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
            녹음해서 피드백 받기
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
          
        
        </div>
      </div>
    </div>
  );
}

export default RecordFeedback;