import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img/owl.png";
import img2 from "../assets/img/owl2.png";
import img3 from "../assets/img/owl3.png";
import img4 from "../assets/img/owl4.png";
import img5 from "../assets/img/owl5.png";
import img6 from "../assets/img/owl6.png";
import img7 from "../assets/img/owl7.png";
// API가 나오면, setTimeout 대신 API 호출 코드로 수정하기

function Loading() {
    const navigate = useNavigate();
    const images = [img1, img2, img3, img4, img5, img6, img7];
    const [currentImg, setCurrentImg] = useState(img1);

    useEffect(() => {
        // 0.5초마다 랜덤 이미지 변경
        const interval = setInterval(() => {
          const randomIdx = Math.floor(Math.random() * images.length);
          setCurrentImg(images[randomIdx]);
        }, 900);
        return () => clearInterval(interval);
      }, [images]);

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
              <img
                src={currentImg}
                alt="owl"
                className="absolute z-20 w-24 h-24 object-contain left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <span className="block mt-0 text-black text-sm font-extrabold text-center">
              조금만 기다려주세요<br />음성을 분석하고 있어요
            </span>
          </div>
        </div>
      );
}

export default Loading;