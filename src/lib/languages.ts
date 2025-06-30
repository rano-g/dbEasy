// Language configuration for Indian vernacular languages
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  voiceCommands: {
    [key: string]: string[];
  };
  ttsVoice?: string;
  fontFamily?: string;
}

export const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    rtl: false,
    voiceCommands: {
      dashboard: ['dashboard', 'home', 'main'],
      dataSources: ['data sources', 'data', 'sources'],
      privacy: ['privacy', 'settings'],
      help: ['help', 'support'],
      logout: ['logout', 'sign out'],
      profile: ['profile', 'account'],
      reports: ['reports', 'credit report']
    },
    ttsVoice: 'en-US',
    fontFamily: 'Inter, sans-serif'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    rtl: false,
    voiceCommands: {
      dashboard: ['डैशबोर्ड', 'मुख्य', 'होम'],
      dataSources: ['डेटा स्रोत', 'जानकारी'],
      privacy: ['गोपनीयता', 'सेटिंग्स'],
      help: ['मदद', 'सहायता'],
      logout: ['लॉगआउट', 'बाहर निकलें'],
      profile: ['प्रोफाइल', 'खाता'],
      reports: ['रिपोर्ट', 'क्रेडिट रिपोर्ट']
    },
    ttsVoice: 'hi-IN',
    fontFamily: 'Noto Sans Devanagari, sans-serif'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    rtl: false,
    voiceCommands: {
      dashboard: ['ড্যাশবোর্ড', 'মূল'],
      dataSources: ['তথ্য উৎস', 'ডেটা'],
      privacy: ['গোপনীয়তা'],
      help: ['সাহায্য'],
      logout: ['লগআউট'],
      profile: ['প্রোফাইল'],
      reports: ['রিপোর্ট']
    },
    ttsVoice: 'bn-IN',
    fontFamily: 'Noto Sans Bengali, sans-serif'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    rtl: false,
    voiceCommands: {
      dashboard: ['டாஷ்போர்டு', 'முதன்மை'],
      dataSources: ['தரவு மூலங்கள்'],
      privacy: ['தனியுரிமை'],
      help: ['உதவி'],
      logout: ['வெளியேறு'],
      profile: ['சுயவிவரம்'],
      reports: ['அறிக்கைகள்']
    },
    ttsVoice: 'ta-IN',
    fontFamily: 'Noto Sans Tamil, sans-serif'
  },
  // Add more languages...
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    rtl: false,
    voiceCommands: {
      dashboard: ['డాష్‌బోర్డ్', 'ముఖ్య'],
      dataSources: ['డేటా మూలాలు'],
      privacy: ['గోప్యత'],
      help: ['సహాయం'],
      logout: ['లాగ్ అవుట్'],
      profile: ['ప్రొఫైల్'],
      reports: ['నివేదికలు']
    },
    ttsVoice: 'te-IN',
    fontFamily: 'Noto Sans Telugu, sans-serif'
  }
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return supportedLanguages.find(lang => lang.code === code);
};

export const getVoiceCommandsForLanguage = (languageCode: string): { [key: string]: string[] } => {
  const language = getLanguageByCode(languageCode);
  return language?.voiceCommands || {};
};

export const defaultLanguage = supportedLanguages[0]; // English