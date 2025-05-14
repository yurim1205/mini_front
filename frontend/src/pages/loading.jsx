import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img/owl.png";
import img2 from "../assets/img/owl2.png";
import img3 from "../assets/img/owl3.png";
import img4 from "../assets/img/owl4.png";
import img5 from "../assets/img/owl5.png";
import img6 from "../assets/img/owl6.png";
import img7 from "../assets/img/owl.7png";
// API가 나오면, setTimeout 대신 API 호출 코드로 수정하기

function Loading() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
          navigate('/result');
        }, 20000);
    
        return () => clearTimeout(timer);
      }, [navigate]);

      return (
        <div className="w-screen h-screen flex justify-center items-center bg-white">
          <div className="relative h-screen flex flex-col items-center max-w-[360px] w-full justify-center">
            <div className="relative w-60 h-60 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, #0E7EDA 0%, #0E7EDA 40%, #E1EBFA 70%, #fff 100%)",
                  filter: "blur(48px)",
                }}
              />
              <span className="relative text-black text-sm font-extrabold z-10 text-center">
                조금만 기다려주세요<br />음성을 분석하고 있어요
              </span>
            </div>
          </div>
        </div>
      );
}

export default Loading;