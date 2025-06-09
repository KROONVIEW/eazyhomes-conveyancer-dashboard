import React, { useState, useEffect } from 'react';
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff, FiX, FiUsers, FiClock } from 'react-icons/fi';
import audioManager from '../../utils/audioUtils';

const CallModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  callType = 'voice', // 'voice' or 'video'
  onCallStart,
  onCallEnd 
}) => {
  const [callState, setCallState] = useState('initiating'); // 'initiating', 'connecting', 'connected', 'ended'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // Simulate call connection process with iOS ringing sound
  useEffect(() => {
    if (isOpen && callState === 'initiating') {
      // Start iOS ringing sound immediately when call is initiated
      console.log('📞 Call initiated - starting iOS ringing sound');
      audioManager.startIOSRinging();
      
      const timer = setTimeout(() => {
        setCallState('connecting');
        setConnectionStatus('Ringing...');
        
        // Simulate connection after 3 seconds
        const connectTimer = setTimeout(() => {
          // Stop ringing and play connection sound
          audioManager.stopRinging();
          audioManager.playCallConnectedSound();
          
          setCallState('connected');
          setConnectionStatus('Connected');
          onCallStart?.(contact, callType);
        }, 3000);

        return () => clearTimeout(connectTimer);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, callState, contact, callType, onCallStart]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Reset state when modal closes and stop any audio
  useEffect(() => {
    if (!isOpen) {
      // Stop any ringing sound when modal closes
      audioManager.stopRinging();
      
      setCallState('initiating');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);
      setConnectionStatus('Connecting...');
    }
  }, [isOpen]);

  const handleEndCall = () => {
    // Stop ringing and play call ended sound
    audioManager.stopRinging();
    audioManager.playCallEndedSound();
    
    setCallState('ended');
    onCallEnd?.(contact, callType, callDuration);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !contact) {return null;}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-['Poppins']">
      <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 ${callType === 'video' ? 'bg-blue-600' : 'bg-green-600'} text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            {callType === 'video' ? (
              <FiVideo className="w-6 h-6" />
            ) : (
              <FiPhone className="w-6 h-6" />
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </h3>
              <p className="text-sm opacity-90">{connectionStatus}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-6 text-center">
          <div className="relative mb-4">
            <img 
              src={contact.avatarUrl} 
              alt={contact.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100"
            />
            {contact.online && (
              <div className="absolute bottom-2 right-1/2 transform translate-x-8 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <h4 className="text-xl font-semibold text-gray-900 mb-1">{contact.name}</h4>
          
          {callState === 'connected' && (
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
              <FiClock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
            </div>
          )}

          {/* Call State Messages */}
          <div className="mb-6">
            {callState === 'initiating' && (
              <p className="text-gray-600">Initiating call...</p>
            )}
            {callState === 'connecting' && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
                <span className="ml-2 text-gray-600">Connecting...</span>
              </div>
            )}
            {callState === 'connected' && (
              <p className="text-green-600 font-medium">Call in progress</p>
            )}
            {callState === 'ended' && (
              <p className="text-gray-600">Call ended</p>
            )}
          </div>
        </div>

        {/* Call Controls */}
        {callState === 'connected' && (
          <div className="px-6 pb-6">
            <div className="flex justify-center space-x-4">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
              </button>

              {/* Video Toggle (only for video calls) */}
              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOff 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isVideoOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
                </button>
              )}

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="End call"
              >
                <FiPhone className="w-5 h-5 transform rotate-135" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons for non-connected states */}
        {(callState === 'initiating' || callState === 'connecting') && (
          <div className="px-6 pb-6">
            <div className="flex space-x-3">
              <button
                onClick={handleEndCall}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal; 