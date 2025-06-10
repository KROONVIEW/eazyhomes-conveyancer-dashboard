// Audio utilities for call functionality
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.ringtoneOscillator = null;
    this.ringtoneGain = null;
    this.isRinging = false;
    this.ringtoneInterval = null;
  }

  // Initialize audio context
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Generate modern smooth "dring dring" ringback tone using Web Audio API
  createIOSRingtone() {
    const audioContext = this.initAudioContext();
    
    // Create oscillator for smooth modern dring dring pattern
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Modern smooth "dring dring" frequencies - standard smooth opening pattern
    // Two-tone pattern that creates the classic "dring dring" sound
    const dringPattern = [
      { freq: 1000, duration: 200 }, // First "dring" - higher tone
      { freq: 800, duration: 200 },  // Second part of first "dring" - lower tone
      { freq: 0, duration: 100 },    // Brief pause
      { freq: 1000, duration: 200 }, // Second "dring" - higher tone
      { freq: 800, duration: 200 },  // Second part of second "dring" - lower tone
      { freq: 0, duration: 800 }     // Longer pause before repeat
    ];
    
    let currentPatternIndex = 0;
    const patternStartTime = audioContext.currentTime;
    
    // Use sine wave for smooth, pleasant sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(dringPattern[0].freq, audioContext.currentTime);
    
    // Set up gain with smooth fade-in
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.05);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Store references for cleanup
    this.ringtoneOscillator = oscillator;
    this.ringtoneGain = gainNode;
    
    // Start oscillator
    oscillator.start();
    
    // Create the smooth "dring dring" pattern
    const playDringPattern = () => {
      if (!this.isRinging) {return;}
      
      const currentStep = dringPattern[currentPatternIndex];
      const currentTime = audioContext.currentTime;
      
      if (currentStep.freq === 0) {
        // Silence period - fade out
        gainNode.gain.setTargetAtTime(0, currentTime, 0.02);
      } else {
        // Active tone - fade in and set frequency
        oscillator.frequency.setTargetAtTime(currentStep.freq, currentTime, 0.02);
        gainNode.gain.setTargetAtTime(0.25, currentTime, 0.02);
      }
      
      // Move to next step in pattern
      currentPatternIndex = (currentPatternIndex + 1) % dringPattern.length;
      
      // Schedule next step
      setTimeout(playDringPattern, currentStep.duration);
    };
    
    // Start the pattern
    playDringPattern();
    
    return { oscillator, gainNode };
  }

  // Start modern smooth "dring dring" ringing sound (standard smooth opening)
  startIOSRinging() {
    if (this.isRinging) {
      this.stopRinging(); // Stop any existing ringing
    }this.isRinging = true;
    
    try {
      this.createIOSRingtone();
    } catch (error) { // Error logging removed for production
// Fallback to system beep or notification sound
      this.playFallbackRingtone();
    }
  }

  // Stop ringing sound
  stopRinging() {this.isRinging = false;
    
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
    
    // Stop oscillator and fade out gain
    if (this.ringtoneOscillator) {
      try {
        // Fade out gain for smooth stop
        if (this.ringtoneGain) {
          this.ringtoneGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        }
        
        // Stop oscillator
        this.ringtoneOscillator.stop(this.audioContext.currentTime + 0.1);
      } catch (error) {
        // Oscillator already stopped or invalid state - silently handle
      }
      
      // Clean up references
      this.ringtoneOscillator = null;
      this.ringtoneGain = null;
    }
  }

  // Fallback ringtone using HTML5 Audio (if Web Audio API fails)
  playFallbackRingtone() {// Create a simple beep pattern as fallback
    const beepPattern = () => {
      if (!this.isRinging) {return;}
      
      // Create short beep
      const audioContext = this.initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    };
    
    // Play beep pattern
    beepPattern();
    this.ringtoneInterval = setInterval(beepPattern, 1000); // Every second
  }

  // Play call connection sound
  playCallConnectedSound() {try {
      const audioContext = this.initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) { // Error logging removed for production
}
  }

  // Play call ended sound
  playCallEndedSound() {try {
      const audioContext = this.initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.3);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) { // Error logging removed for production
}
  }

  // Check if audio is supported
  isAudioSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager; 