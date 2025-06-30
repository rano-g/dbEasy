'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, getVoiceCommandsForLanguage } from '@/lib/languages';
import { Mic, MicOff, Volume2, Wifi, WifiOff, HelpCircle } from 'lucide-react';

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Define proper types for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ExtendedSpeechRecognition extends SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
}

interface NetworkStatus {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export default function VoiceAssistant() {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({ online: true });
  const [showCommands, setShowCommands] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const recognitionRef = useRef<ExtendedSpeechRecognition | null>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as ExtendedSpeechRecognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = i18n.language;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript.toLowerCase().trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(`${t('voiceAssistant.speechError')}: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onstart = () => {
          setError(null);
        };

        recognitionRef.current = recognition;
      } else {
        setError(t('voiceAssistant.notSupported'));
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.current = window.speechSynthesis;
      }
    }
  }, [i18n.language, t]);

  // Monitor network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
      });
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    const voiceCommands = getVoiceCommandsForLanguage(i18n.language);
    
    for (const [action, commands] of Object.entries(voiceCommands)) {
      if (commands.some(cmd => command.includes(cmd.toLowerCase()))) {
        executeCommand(action);
        return;
      }
    }

    // If no command matched, provide feedback
    speak(t('voiceAssistant.commandNotRecognized'));
  }, [i18n.language, t]);

  const executeCommand = (action: string) => {
    switch (action) {
      case 'dashboard':
        window.location.href = '/dashboard';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.dashboard') }));
        break;
      case 'dataSources':
        window.location.href = '/data-sources';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.dataSources') }));
        break;
      case 'privacy':
        window.location.href = '/privacy';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.privacy') }));
        break;
      case 'help':
        window.location.href = '/help';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.help') }));
        break;
      case 'logout':
        // Implement logout logic
        speak(t('voiceAssistant.loggingOut'));
        break;
      case 'profile':
        window.location.href = '/profile';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.profile') }));
        break;
      case 'reports':
        window.location.href = '/reports';
        speak(t('voiceAssistant.navigatingTo', { page: t('navigation.reports') }));
        break;
      default:
        speak(t('voiceAssistant.commandNotRecognized'));
    }
  };

  const speak = (text: string) => {
    if (!speechSynthesis.current || !networkStatus.online) return;

    // Cancel any ongoing speech
    speechSynthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language);
    
    if (currentLanguage?.ttsVoice) {
      utterance.lang = currentLanguage.ttsVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError(t('voiceAssistant.notAvailable'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getNetworkStatusColor = () => {
    if (!networkStatus.online) return 'text-red-500';
    if (networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g') return 'text-red-400';
    if (networkStatus.effectiveType === '3g') return 'text-yellow-400';
    return 'text-green-500';
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className={`rounded-full p-3 shadow-lg transition-colors ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {/* Network Status Indicator */}
      <div className="mb-2 flex items-center justify-end">
        <div className="flex items-center space-x-2 rounded-full bg-white px-3 py-1 shadow-lg border">
          {networkStatus.online ? (
            <Wifi className={`h-3 w-3 ${getNetworkStatusColor()}`} />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span className="text-xs text-gray-600">
            {networkStatus.online 
              ? `${t('voiceAssistant.online')} (${networkStatus.effectiveType || 'unknown'})`
              : t('voiceAssistant.offline')
            }
          </span>
        </div>
      </div>

      {/* Voice Assistant Panel */}
      <div className="rounded-lg bg-white p-4 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <Mic className="h-4 w-4 mr-2" />
            {t('voiceAssistant.title')}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCommands(!showCommands)}
              className="text-gray-500 hover:text-gray-700"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              ×
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={toggleListening}
            disabled={!networkStatus.online}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white hover:bg-red-600'
                : networkStatus.online
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isListening ? (
              <>
                <div className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse" />
                {t('voiceAssistant.listening')}
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                {t('voiceAssistant.startListening')}
              </>
            )}
          </button>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mb-3 rounded-lg bg-gray-50 p-2">
            <p className="text-xs text-gray-600 mb-1">{t('voiceAssistant.transcript')}:</p>
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-3 rounded-lg bg-red-50 p-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="mb-3 flex items-center space-x-2">
            <Volume2 className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-gray-600">{t('voiceAssistant.speaking')}</span>
          </div>
        )}

        {/* Commands Help */}
        {showCommands && (
          <div className="mt-3 border-t pt-3">
            <p className="text-xs font-medium text-gray-700 mb-2">
              {t('voiceAssistant.availableCommands')}:
            </p>
            <div className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
              {Object.entries(getVoiceCommandsForLanguage(i18n.language)).map(([action, commands]) => (
                <div key={action} className="flex flex-col">
                  <span className="font-medium text-gray-700">{t(`navigation.${action}`)}</span>
                  <span className="text-gray-500 ml-2">{commands.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Mode Notice */}
        {!networkStatus.online && (
          <div className="mt-3 rounded-lg bg-yellow-50 p-2">
            <p className="text-xs text-yellow-800">
              {t('voiceAssistant.offlineMode')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}