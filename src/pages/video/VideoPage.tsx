import React from 'react';
import { VideoRoom } from '../../components/video/VideoRoom';

const VideoPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Virtual Meeting Room</h1>
            <p className="text-gray-500 mt-1">Secure video call between Entrepreneur and Investor</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">Meeting in progress</span>
          </div>
        </div>
        
        <VideoRoom />
      </div>
    </div>
  );
};

export default VideoPage;