import React, { useState, useEffect, useRef } from 'react';

export const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        // Process voice commands
        if (transcriptText.toLowerCase().includes('hey flux')) {
          processVoiceCommand(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('call marcus') || lowerCommand.includes('ask marcus')) {
      alert('Calling Marcus... (voice command detected)');
    } else if (lowerCommand.includes('review code') || lowerCommand.includes('code review')) {
      alert('Opening code review... (voice command detected)');
    } else if (lowerCommand.includes('create project')) {
      alert('Creating new project... (voice command detected)');
    }
  };

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">🎤 Voice Control</h3>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              voiceEnabled
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {voiceEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-full py-4 rounded-xl font-semibold transition ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
          </button>
        </div>

        {transcript && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transcript:</p>
            <p className="text-gray-900 dark:text-white">{transcript}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voice Commands:</p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• "Hey FLUX, call Marcus"</li>
            <li>• "Hey FLUX, review my code"</li>
            <li>• "Hey FLUX, create new project"</li>
            <li>• "Hey FLUX, show analytics"</li>
          </ul>
        </div>

        <button
          onClick={() => speak('Voice interface ready. Say Hey FLUX to start a command.')}
          className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
        >
          🔊 Test Voice Output
        </button>
      </div>
    </div>
  );
};
