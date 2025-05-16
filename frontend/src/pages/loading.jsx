import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img1 from "../assets/img/owl.png";
import img2 from "../assets/img/owl2.png";
import img3 from "../assets/img/owl3.png";
import img4 from "../assets/img/owl4.png";
import img5 from "../assets/img/owl5.png";
import img6 from "../assets/img/owl6.png";
import img7 from "../assets/img/owl7.png";

function Loading() {
    const navigate = useNavigate();
    const location = useLocation();
    const images = [img1, img2, img3, img4, img5, img6, img7];
    const [currentImg, setCurrentImg] = useState(img1);

    useEffect(() => {
      // recordFeedback에서 온 경우: recognizedText로 피드백 생성
      if (location.state?.recognizedText) {
        const recognizedText = location.state.recognizedText;
        setTimeout(() => {
          const speedFeedback = recognizedText.length < 10 ? "발화 속도가 빠릅니다." : null;
          const fillerFeedback = recognizedText.includes("음") ? "말버릇(음...)이 감지되었습니다." : null;
          const result = {
            segments: [
              {
                id: 1,
                startPoint: 0,
                endPoint: recognizedText.length,
                word: recognizedText,
                speed: speedFeedback,
                volume: null,
                intonation: null,
                pronunciation: null,
                filler: fillerFeedback,
                silence: null
              }
            ]
          };
          navigate('/resultFeedback', { state: { result } });
        }, 1200);
        return;
      }
      // 파일 업로드 플로우: file 객체가 넘어온 경우
      if (location.state?.file) {
        const formData = new FormData();
        formData.append('file', location.state.file);
        fetch('http://192.168.0.195:8000/api/speech/analyze', {
          method: 'POST',
          body: formData,
        })
          .then(res => res.json())
          .then(data => {
            navigate('/resultFeedback', { state: { result: data } });
          })
          .catch(() => {
            alert('분석에 실패했습니다.');
            navigate('/');
          });
        return;
      }
      // 기존 파일 업로드 플로우 (data, fileName만 있는 경우)
      if (!location.state?.fileName) {
        navigate('/');
        return;
      }
      if (location.state?.data) {
        setTimeout(() => {
          navigate('/resultFeedback', { state: { result: location.state.data } });
        }, 1200);
      }
    }, [location.state, navigate]);

    useEffect(() => {
        // 0.5초마다 랜덤 이미지 변경
        const interval = setInterval(() => {
          const randomIdx = Math.floor(Math.random() * images.length);
          setCurrentImg(images[randomIdx]);
        }, 2000);
        return () => clearInterval(interval);
      }, [images]);

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