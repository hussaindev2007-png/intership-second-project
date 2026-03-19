import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, Minimize, MonitorUp, AlertCircle } from 'lucide-react';

export const VideoRoom: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } catch (err) {
        console.warn("Camera nahi mila, mock mode active:", err);
        setHasCamera(false); // Agar camera nahi hai toh state update hogi
      }
    }
    setupCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
    setIsVideoOff(!isVideoOff);
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div 
      ref={videoContainerRef}
      className={`flex flex-col ${isFullScreen ? 'h-screen w-screen bg-black' : 'h-[calc(100vh-150px)] bg-gray-900'} rounded-2xl overflow-hidden shadow-2xl border border-gray-800 transition-all duration-300`}
    >
      {/* Video Grid */}
      <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${isFullScreen ? 'bg-black' : 'bg-black/20'}`}>
        
        {/* Local Stream View */}
        <div className="relative bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden shadow-inner group">
          
          {/* Mock UI agar camera nahi hai ya off hai */}
          {(!hasCamera || isVideoOff) ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold transition-all duration-500 ${!isMuted ? 'bg-primary-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-gray-700'}`}>
                H
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-300 font-medium">Hasan Ali (You)</p>
                {!hasCamera && (
                  <span className="flex items-center gap-1 text-xs text-yellow-500 mt-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    <AlertCircle size={12} /> No Camera Detected (Mock Active)
                  </span>
                )}
              </div>
              
              {/* Mic Activity Visualizer (Mock) */}
              {!isMuted && (
                <div className="flex gap-1 h-4 items-end">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-xl" />
          )}

          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            Entrepreneur
          </div>
        </div>

        {/* Remote Stream Mock */}
        <div className="relative bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden shadow-inner">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-gray-500 border border-gray-600">
              I
            </div>
            <p className="text-gray-500 font-medium animate-pulse">Waiting for Investor...</p>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold border border-white/10">
            Investor
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className={`h-24 ${isFullScreen ? 'bg-black/80' : 'bg-gray-950/80'} backdrop-blur-xl flex items-center justify-center space-x-6 px-8 border-t border-white/5`}>
        <button 
          onClick={toggleAudio}
          className={`p-4 rounded-2xl transition-all transform active:scale-95 ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-white/5'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button 
          onClick={toggleVideo}
          className={`p-4 rounded-2xl transition-all transform active:scale-95 ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-white/5'}`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button className="p-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all transform hover:scale-110 active:scale-90 shadow-lg shadow-red-600/30">
          <PhoneOff size={24} />
        </button>

        <div className="w-px h-10 bg-white/10 mx-2" />

        <button onClick={toggleFullScreen} className="p-4 rounded-2xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-white/5">
          {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  );
};