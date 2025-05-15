import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import owlImg from "../assets/img/owl.png";
import {
  ChevronLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon as StopSquareIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/solid';
import AnalysisBtn from '../components/common/analysisBtn';

const RECORDING_STATE = {
  READY: 'ready',
  REQUESTING_PERMISSION: 'requesting_permission',
  RECORDING: 'recording',
  FINISHED: 'finished',
  ERROR: 'error',
};

const PLAYING_STATE = {
  STOPPED: 'stopped',
  PLAYING: 'playing',
  PAUSED: 'paused',
};

const formatTime = (secondsInput) => {
  const seconds = typeof secondsInput === 'number' && !isNaN(secondsInput) ? Math.round(secondsInput) : 0;
  if (seconds === Infinity || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
};

function RecordFeedback() {
  const navigate = useNavigate();

  const [recordingState, setRecordingState] = useState(RECORDING_STATE.READY);
  const [playingState, setPlayingState] = useState(PLAYING_STATE.STOPPED);
  const [permissionStatus, setPermissionStatus] = useState('idle');

  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordingStartTimeRef = useRef(0);

  useEffect(() => {
    let currentAudioUrl = audioUrl;
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch(e) { console.warn("언마운트 시 레코더 중지 에러", e); }
      }
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (recordingState === RECORDING_STATE.RECORDING) {
      timerIntervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [recordingState]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl && audioUrl) {
      let initialDurationSetAttempted = false;

      const handleLoadedMetadata = () => {
        const newDuration = audioEl.duration;
        if (typeof newDuration === 'number' && !isNaN(newDuration) && newDuration > 0 && newDuration !== Infinity) {
          if (!initialDurationSetAttempted || totalDuration === 0 || Math.abs(totalDuration - newDuration) > 0.1) {
            setTotalDuration(newDuration);
            initialDurationSetAttempted = true;
          }
        }
      };

      const handleDurationChange = () => {
        const newDuration = audioEl.duration;
        if (typeof newDuration === 'number' && !isNaN(newDuration) && newDuration > 0 && newDuration !== Infinity) {
          if (Math.abs(totalDuration - newDuration) > 0.1) {
            setTotalDuration(newDuration);
          }
        }
      };

      const handleCanPlay = () => {
        if (audioEl.duration > 0 && audioEl.duration !== Infinity) {
            handleLoadedMetadata();
        }
      };

      const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime);
      const handleAudioPlay = () => setPlayingState(PLAYING_STATE.PLAYING);
      const handleAudioPause = () => setPlayingState(PLAYING_STATE.PAUSED);
      const handleAudioEnded = () => { setPlayingState(PLAYING_STATE.STOPPED); setCurrentTime(0); };

      audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.addEventListener('durationchange', handleDurationChange);
      audioEl.addEventListener('canplay', handleCanPlay);
      audioEl.addEventListener('timeupdate', handleTimeUpdate);
      audioEl.addEventListener('play', handleAudioPlay);
      audioEl.addEventListener('pause', handleAudioPause);
      audioEl.addEventListener('ended', handleAudioEnded);

      audioEl.src = audioUrl;
      audioEl.load();

      if (audioEl.readyState >= HTMLMediaElement.HAVE_METADATA) {
        handleLoadedMetadata();
      }

      return () => {
        audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioEl.removeEventListener('durationchange', handleDurationChange);
        audioEl.removeEventListener('canplay', handleCanPlay);
        audioEl.removeEventListener('timeupdate', handleTimeUpdate);
        audioEl.removeEventListener('play', handleAudioPlay);
        audioEl.removeEventListener('pause', handleAudioPause);
        audioEl.removeEventListener('ended', handleAudioEnded);
      };
    } else if (!audioUrl) {
      setTotalDuration(0);
      setCurrentTime(0);
      setPlayingState(PLAYING_STATE.STOPPED);
      if (audioRef.current) {
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    }
  }, [audioUrl, totalDuration]);

  const handleMicrophonePermission = async () => {
    if (permissionStatus === 'denied' && recordingState !== RECORDING_STATE.ERROR) {
      alert("마이크 접근 권한이 거부되었습니다. 브라우저 설정을 확인하거나 페이지를 새로고침 후 다시 시도해주세요.");
      return;
    }
    setRecordingState(RECORDING_STATE.REQUESTING_PERMISSION);
    setPermissionStatus('prompt');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      mediaStreamRef.current = stream;
      setPermissionStatus('granted');
      startRecordingInternal(stream);
    } catch (err) {
      console.error("마이크 권한 에러:", err.name, err.message);
      setPermissionStatus('denied');
      setRecordingState(RECORDING_STATE.ERROR);
    }
  };

  const startRecordingInternal = (stream) => {
    if (!stream || !stream.active || stream.getAudioTracks().length === 0 || !stream.getAudioTracks()[0].enabled || stream.getAudioTracks()[0].readyState !== 'live') {
      console.error("유효하지 않은 스트림으로 녹음 시작 불가:", stream);
      setRecordingState(RECORDING_STATE.ERROR);
      if(stream && stream.active) stream.getTracks().forEach(track => track.stop());
      if (mediaStreamRef.current === stream) mediaStreamRef.current = null;
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch(e) { console.warn("이전 MediaRecorder 중지 시 작은 오류:", e); }
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordedAudioBlob(null);
    setPlayingState(PLAYING_STATE.STOPPED);
    audioChunksRef.current = [];
    setRecordingTime(0);
    setCurrentTime(0);
    setTotalDuration(0);

    const options = { mimeType: 'audio/webm' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported on this browser.`);
        alert(`${options.mimeType} 오디오 형식이 브라우저에서 지원되지 않습니다.\n다른 브라우저를 사용해보세요.`);
        setRecordingState(RECORDING_STATE.ERROR);
        stream.getTracks().forEach(track => track.stop());
        if (mediaStreamRef.current === stream) mediaStreamRef.current = null;
        return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.onstart = () => {
        setRecordingState(RECORDING_STATE.RECORDING);
        setRecordingTime(0);
        recordingStartTimeRef.current = Date.now();
      };
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const recordingEndTime = Date.now();
        const actualRecordedMs = recordingEndTime - recordingStartTimeRef.current;
        const actualRecordedSec = Math.max(0.1, actualRecordedMs / 1000);

        if (audioChunksRef.current.length === 0 || actualRecordedSec < 0.2) {
            console.warn("녹음된 데이터가 매우 짧거나 없습니다. 실제 녹음 시간(ms):", actualRecordedMs);
            setRecordingState(RECORDING_STATE.ERROR);
            alert(`녹음 시간이 너무 짧습니다 (${actualRecordedSec.toFixed(1)}초). 최소 0.2초 이상 녹음해주세요.`);
            if (mediaStreamRef.current === stream) { stream.getTracks().forEach(track => track.stop()); mediaStreamRef.current = null; }
            setRecordedAudioBlob(null); setAudioUrl(null); setTotalDuration(0);
            audioChunksRef.current = [];
            return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
        setRecordedAudioBlob(audioBlob);
        const newAudioUrl = URL.createObjectURL(audioBlob);

        setTotalDuration(actualRecordedSec);
        setAudioUrl(newAudioUrl);
        setRecordingState(RECORDING_STATE.FINISHED);

        if (mediaStreamRef.current === stream) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder 오류:", event.error ? event.error.name : 'Unknown error', event.error);
        setRecordingState(RECORDING_STATE.ERROR);
        if (mediaStreamRef.current === stream) { stream.getTracks().forEach(track => track.stop()); mediaStreamRef.current = null; }
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("MediaRecorder 설정 또는 시작 중 오류:", error);
      setRecordingState(RECORDING_STATE.ERROR);
      if (mediaStreamRef.current === stream) { stream.getTracks().forEach(track => track.stop()); mediaStreamRef.current = null; }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePlayPauseAudio = () => {
    const audioEl = audioRef.current;
    if (!audioEl || !audioUrl ) return;

    if (playingState === PLAYING_STATE.PLAYING) {
      audioEl.pause();
    } else {
      audioEl.play().catch(err => {
        console.error("오디오 재생 오류:", err);
        setPlayingState(PLAYING_STATE.STOPPED);
      });
    }
  };

  const handleStopAudioForPlayback = () => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }교
  };

// 녹음파일 넘기는 부분
// 사용자가 마이크로 녹음 → Blob으로 저장
// 녹음된 Blob을 FormData로 서버에 POST를 통해 분석 요청
// 서버에서 받은 결과(result)를 결과 페이지로 전달
  const handleAnalysis = async () => {
    if (!recordedAudioBlob) {
      alert("녹음된 오디오 파일이 없습니다.");
      return;
    }
    const formData = new FormData();
    formData.append('file', recordedAudioBlob, 'recorded_audio.webm');

    try {
      const response = await fetch('http://192.168.0.195:8000/api/speech/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('서버 오류');
      const result = await response.json();
      navigate('/resultFeedback', { state: { result } });
    } catch (err) {
      alert('분석 요청에 실패했습니다.');
    }
  };

  const handleReset = (keepPermission = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { 
        mediaRecorderRef.current.stop(); 
      } catch (e) {
        // 에러 무시
      }
    }
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setRecordedAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setRecordingState(RECORDING_STATE.READY);
    setPlayingState(PLAYING_STATE.STOPPED);

    if (!keepPermission) {
      setPermissionStatus('idle');
    }
    audioChunksRef.current = [];
  };


  const renderMainContent = () => {
    let timeDisplayTextElement;
    const isValidDuration = typeof totalDuration === 'number' && !isNaN(totalDuration) && totalDuration > 0 && totalDuration !== Infinity;

    if (recordingState === RECORDING_STATE.RECORDING) {
      timeDisplayTextElement = <span className="text-black">{formatTime(recordingTime)}</span>;
    } else if (recordingState === RECORDING_STATE.FINISHED && audioUrl) {
      if (isValidDuration) {
        if (playingState === PLAYING_STATE.PLAYING || playingState === PLAYING_STATE.PAUSED) {
          timeDisplayTextElement = (<><span className="text-white">{formatTime(currentTime)}</span><span className="text-gray-300"> / {formatTime(totalDuration)}</span></>);
        } else {
          timeDisplayTextElement = <span className="text-white">{formatTime(totalDuration)}</span>;
        }
      } else {
        timeDisplayTextElement = <span className="text-white">00:00</span>;
      }
    } else {
        const timeColor = (recordingState === RECORDING_STATE.ERROR && permissionStatus === 'denied') || recordingState === RECORDING_STATE.ERROR ? 'text-red-500' : 'text-blue-600';
        timeDisplayTextElement = <span className={timeColor}>{formatTime(0)}</span>;
    }

    switch (recordingState) {
      case RECORDING_STATE.READY:
      case RECORDING_STATE.REQUESTING_PERMISSION:
        const readyMicColor = permissionStatus === 'denied' ? 'text-red-400' : 'text-black';
        const readyTimeColor = permissionStatus === 'denied' ? 'text-red-500' : 'text-blue-600';

        const readyMicDisplay = (
            <div className="flex flex-col items-center justify-center h-auto mb-8">
              <MicrophoneIcon className={`w-20 h-20 md:w-24 md:h-24 ${readyMicColor} mb-4`} />
              <p className={`text-2xl md:text-3xl font-mono tabular-nums ${readyTimeColor}`}>
                  {permissionStatus === 'denied' ? formatTime(0) : timeDisplayTextElement}
              </p>
            </div>
        );
        if (permissionStatus === 'denied') {
          return (
            <>
              {readyMicDisplay}
              <p className="text-red-500 text-center mb-4 px-4">마이크 접근 권한이 거부되었습니다.<br/>브라우저 설정을 확인 후 다시 시도해주세요.</p>
              <button onClick={handleMicrophonePermission} className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600" aria-label="권한 재요청">
                <ArrowPathIcon className="w-8 h-8 text-white" />
              </button>
            </>
          );
        }
        return (
          <>
            {readyMicDisplay}
            <button onClick={handleMicrophonePermission} disabled={recordingState === RECORDING_STATE.REQUESTING_PERMISSION} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 disabled:opacity-50 group" aria-label="녹음 시작">
              <div className="w-8 h-8 bg-white rounded-full group-hover:bg-gray-100"></div>
            </button>
            {recordingState === RECORDING_STATE.REQUESTING_PERMISSION && <p className="mt-3 text-sm text-gray-600">마이크 권한을 요청 중입니다...</p>}
          </>
        );

      case RECORDING_STATE.RECORDING:
        return (
          <>
            <div className="flex flex-col items-center justify-center h-auto mb-8">
              <MicrophoneIcon className="w-20 h-20 md:w-24 md:h-24 text-black mb-4 animate-pulse" />
              <p className="text-2xl md:text-3xl font-mono tabular-nums text-black">
                {timeDisplayTextElement}
              </p>
            </div>
            <button
              onClick={handleStopRecording}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
              aria-label="녹음 중지"
            >
              <StopSquareIcon className="w-8 h-8 text-white" />
            </button>
          </>
        );

      case RECORDING_STATE.FINISHED:
        const isPlayable = !!audioUrl && isValidDuration;
        return (
          <>
            <div className="flex flex-col items-center justify-center w-full pt-2 pb-1 md:pt-3 md:pb-2">
              <MicrophoneIcon className="w-12 h-12 md:w-14 md:h-14 text-white mb-2 md:mb-3" />
              <p className={`text-4xl md:text-5xl font-mono tabular-nums mb-5 md:mb-6 tracking-wider`}>
                {timeDisplayTextElement}
              </p>
              <div className="flex items-center justify-center space-x-5 md:space-x-6 mb-6 md:mb-8">
                <button
                  onClick={handlePlayPauseAudio}
                  className={`w-16 h-16 md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center shadow-xl
                                ${isPlayable ? (playingState === PLAYING_STATE.PLAYING ? 'bg-white hover:bg-gray-200' : 'bg-white hover:bg-gray-200') : 'bg-gray-400 cursor-not-allowed'}
                                transition-all duration-150 ease-in-out`}
                  aria-label={playingState === PLAYING_STATE.PLAYING ? "일시정지" : "재생"}
                  disabled={!isPlayable}
                >
                  {playingState === PLAYING_STATE.PLAYING ? (
                    <PauseIcon className="w-8 h-8 md:w-9 md:h-9 text-blue-600" />
                  ) : (
                    <PlayIcon className={`w-8 h-8 md:w-9 md:h-9 ${!isPlayable ? 'text-gray-100' : 'text-blue-600'}`} />
                  )}
                </button>
                <button
                  onClick={handleStopAudioForPlayback}
                  className={`w-16 h-16 md:w-[70px] md:h-[70px] rounded-full flex items-center justify-center shadow-xl
                                ${(isPlayable && playingState !== PLAYING_STATE.STOPPED) ? 'bg-white hover:bg-gray-200' : 'bg-gray-400 cursor-not-allowed'}
                                transition-all duration-150 ease-in-out`}
                  aria-label="정지"
                  disabled={!isPlayable || playingState === PLAYING_STATE.STOPPED}
                >
                  <StopSquareIcon className={`w-8 h-8 md:w-9 md:h-9 ${(!isPlayable || playingState === PLAYING_STATE.STOPPED) ? 'text-gray-100' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>
            {audioUrl && <audio ref={audioRef} className="hidden" preload="metadata" />}
            <div className="w-full space-y-3 mt-auto pb-6 px-6">
                <button
                  onClick={() => handleReset(true)}
                  className="w-full py-3.5 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 text-base font-semibold flex items-center justify-center transition-colors duration-150"
                >
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
                    다시 녹음하기
                </button>
                <AnalysisBtn
                  onClick={handleAnalysis}
                  disabled={!recordedAudioBlob || !isPlayable}
                >
                  분석 시작
                </AnalysisBtn>
            </div>
          </>
        );
      case RECORDING_STATE.ERROR:
        return (
          <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
            <MicrophoneIcon className="w-20 h-20 md:w-24 md:h-24 text-red-400 mb-4" />
            <p className="text-xl font-semibold text-red-500 mb-3">오류 발생!</p>
            <p className="text-gray-700 mb-6">
              {permissionStatus === 'denied' ? "마이크 사용 권한이 필요합니다. 브라우저 설정을 확인해주세요." : "녹음 또는 처리 중 문제가 발생했습니다."}
              <br/>다시 시도해주세요.
            </p>
            <button onClick={() => handleReset(permissionStatus === 'denied')} className="px-8 py-2.5 bg-gray-200 text-gray-800 border border-gray-400 rounded-lg hover:bg-gray-300 text-base font-semibold transition-colors">
              다시 시도
            </button>
          </div>
        );
      default:
        return <p className="text-center text-gray-100 flex-1 justify-center items-center flex">알 수 없는 상태입니다.</p>;
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
          <button onClick={() => navigate(-1)} className="bg-transparent p-0 leading-none" style={{ width: '2.25rem', height: '2.25rem' }}>
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
          <span className="text-xl font-semibold text-white text-center flex-1">
            녹음해서 피드백 받기
          </span>
          <div style={{ width: '2.25rem' }} />
        </div>
        <img src={owlImg} alt="부엉이" className="w-32 mx-auto mt-12" />
        <div
          className="rounded-3xl rounded-b-none shadow-md w-full px-6 py-6 mt-0 flex flex-col items-center min-h-screen"
          style={{
            background: "linear-gradient(to bottom, #e0eaff 0%, #fff 60%)"
          }}
        >   {/* 녹음 상태/마이크/시간/버튼 등 */}
          <div className="w-full flex flex-col items-center mb-4 flex-1 justify-center">
            {renderMainContent()}
          </div>
          {/* 안내 문구 */}
          <ul className="text-xs text-gray-700 w-full list-disc pl-4 mt-0 mb-[480px]">
            <li>음성이 너무 작거나 주변 소음이 심하면 정확도가 떨어질 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecordFeedback;