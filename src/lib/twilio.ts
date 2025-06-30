import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

export const twilioClient = twilio(accountSid, authToken);

export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
  language?: string;
}

export interface CreditReportRequest {
  phoneNumber: string;
  name: string;
  language: string;
  requestType: 'full_report' | 'score_only' | 'data_verification';
}

// Send WhatsApp message via Twilio
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<any> {
  try {
    const response = await twilioClient.messages.create({
      body: message.body,
      from: whatsappNumber,
      to: `whatsapp:${message.to}`,
      ...(message.mediaUrl && { mediaUrl: [message.mediaUrl] })
    });
    return response;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

// Handle incoming WhatsApp messages
export async function handleIncomingWhatsAppMessage(
  from: string,
  body: string,
  language: string = 'en'
): Promise<string> {
  const phoneNumber = from.replace('whatsapp:', '');
  
  // Parse user intent from message
  const intent = parseUserIntent(body.toLowerCase(), language);
  
  switch (intent.type) {
    case 'credit_score_request':
      return await handleCreditScoreRequest(phoneNumber, language);
    
    case 'data_source_connect':
      return await handleDataSourceConnection(phoneNumber, intent.dataSource, language);
    
    case 'report_request':
      return await handleReportRequest(phoneNumber, language);
    
    case 'help':
      return getHelpMessage(language);
    
    case 'language_change':
      return await handleLanguageChange(phoneNumber, intent.language);
    
    default:
      return getWelcomeMessage(language);
  }
}

// Parse user intent from message
function parseUserIntent(message: string, language: string): any {
  // English commands
  if (language === 'en') {
    if (message.includes('credit score') || message.includes('score')) {
      return { type: 'credit_score_request' };
    }
    if (message.includes('connect bank') || message.includes('add bank')) {
      return { type: 'data_source_connect', dataSource: 'bank' };
    }
    if (message.includes('full report') || message.includes('report')) {
      return { type: 'report_request' };
    }
    if (message.includes('help') || message.includes('support')) {
      return { type: 'help' };
    }
  }
  
  // Hindi commands
  if (language === 'hi') {
    if (message.includes('क्रेडिट स्कोर') || message.includes('स्कोर')) {
      return { type: 'credit_score_request' };
    }
    if (message.includes('बैंक जोड़ें') || message.includes('बैंक कनेक्ट')) {
      return { type: 'data_source_connect', dataSource: 'bank' };
    }
    if (message.includes('पूरी रिपोर्ट') || message.includes('रिपोर्ट')) {
      return { type: 'report_request' };
    }
    if (message.includes('मदद') || message.includes('सहायता')) {
      return { type: 'help' };
    }
  }
  
  // Bengali commands
  if (language === 'bn') {
    if (message.includes('ক্রেডিট স্কোর') || message.includes('স্কোর')) {
      return { type: 'credit_score_request' };
    }
    if (message.includes('ব্যাংক যোগ') || message.includes('ব্যাংক সংযোগ')) {
      return { type: 'data_source_connect', dataSource: 'bank' };
    }
    if (message.includes('সম্পূর্ণ রিপোর্ট') || message.includes('রিপোর্ট')) {
      return { type: 'report_request' };
    }
    if (message.includes('সাহায্য')) {
      return { type: 'help' };
    }
  }
  
  return { type: 'unknown' };
}

// Message templates for different languages
export const messageTemplates = {
  en: {
    welcome: `🏦 Welcome to dbEasy Credit Reporting!

I can help you with:
📊 Check your credit score
🔗 Connect bank accounts
📋 Get full credit report
❓ Get help and support

Just type what you need!`,
    
    creditScore: `📊 Your Credit Score: {{score}}
📅 Last Updated: {{date}}
📈 Score Range: 300-850

To improve your score:
✅ Pay bills on time
✅ Keep credit utilization low
✅ Add more data sources

Type "full report" for detailed analysis.`,
    
    dataSourceHelp: `🔗 Connect Your Data Sources:

1. Bank Accounts - Link your bank for transaction history
2. UPI Payments - Connect Google Pay, PhonePe, Paytm
3. Utility Bills - Add electricity, water, gas bills
4. Mobile Recharge - Track mobile payment history

Reply with "connect bank" to start!`,
    
    help: `❓ dbEasy Help & Support

Available Commands:
📊 "credit score" - Check your score
📋 "report" - Get full credit report
🔗 "connect bank" - Add data sources
🌐 "help" - Show this menu
🗣️ "hindi" - Switch to Hindi

Visit: https://dbeasy.app for more features!`
  },
  
  hi: {
    welcome: `🏦 dbEasy क्रेडिट रिपोर्टिंग में आपका स्वागत है!

मैं आपकी मदद कर सकता हूं:
📊 अपना क्रेडिट स्कोर चेक करें
🔗 बैंक खाते जोड़ें
📋 पूरी क्रेडिट रिपोर्ट पाएं
❓ मदद और सहायता पाएं

बस लिखें कि आपको क्या चाहिए!`,
    
    creditScore: `📊 आपका क्रेडिट स्कोर: {{score}}
📅 अंतिम अपडेट: {{date}}
📈 स्कोर रेंज: 300-850

अपना स्कोर बेहतर बनाने के लिए:
✅ समय पर बिल का भुगतान करें
✅ क्रेडिट उपयोग कम रखें
✅ अधिक डेटा स्रोत जोड़ें

विस्तृत विश्लेषण के लिए "पूरी रिपोर्ट" टाइप करें।`,
    
    dataSourceHelp: `🔗 अपने डेटा स्रोत जोड़ें:

1. बैंक खाते - लेनदेन इतिहास के लिए बैंक जोड़ें
2. UPI भुगतान - Google Pay, PhonePe, Paytm जोड़ें
3. उपयोगिता बिल - बिजली, पानी, गैस बिल जोड़ें
4. मोबाइल रिचार्ज - मोबाइल भुगतान इतिहास ट्रैक करें

शुरू करने के लिए "बैंक जोड़ें" का जवाब दें!`,
    
    help: `❓ dbEasy मदद और सहायता

उपलब्ध कमांड:
📊 "क्रेडिट स्कोर" - अपना स्कोर चेक करें
📋 "रिपोर्ट" - पूरी क्रेडिट रिपोर्ट पाएं
🔗 "बैंक जोड़ें" - डेटा स्रोत जोड़ें
🌐 "मदद" - यह मेनू दिखाएं
🗣️ "english" - अंग्रेजी में स्विच करें

अधिक सुविधाओं के लिए: https://dbeasy.app पर जाएं!`
  },
  
  bn: {
    welcome: `🏦 dbEasy ক্রেডিট রিপোর্টিং-এ আপনাকে স্বাগতম!

আমি আপনাকে সাহায্য করতে পারি:
📊 আপনার ক্রেডিট স্কোর চেক করুন
🔗 ব্যাংক অ্যাকাউন্ট যোগ করুন
📋 সম্পূর্ণ ক্রেডিট রিপোর্ট পান
❓ সাহায্য এবং সহায়তা পান

শুধু লিখুন আপনার কী প্রয়োজন!`,
    
    creditScore: `📊 আপনার ক্রেডিট স্কোর: {{score}}
📅 সর্বশেষ আপডেট: {{date}}
📈 স্কোর রেঞ্জ: 300-850

আপনার স্কোর উন্নত করতে:
✅ সময়মতো বিল পরিশোধ করুন
✅ ক্রেডিট ব্যবহার কম রাখুন
✅ আরও ডেটা সোর্স যোগ করুন

বিস্তারিত বিশ্লেষণের জন্য "সম্পূর্ণ রিপোর্ট" টাইপ করুন।`,
    
    help: `❓ dbEasy সাহায্য ও সহায়তা

উপলব্ধ কমান্ড:
📊 "ক্রেডিট স্কোর" - আপনার স্কোর চেক করুন
📋 "রিপোর্ট" - সম্পূর্ণ ক্রেডিট রিপোর্ট পান
🔗 "ব্যাংক যোগ করুন" - ডেটা সোর্স যোগ করুন
🌐 "সাহায্য" - এই মেনু দেখান

আরও বৈশিষ্ট্যের জন্য: https://dbeasy.app ভিজিট করুন!`
  }
};

// Helper functions
async function handleCreditScoreRequest(phoneNumber: string, language: string): Promise<string> {
  // Fetch user's credit score from your database
  const score = await getUserCreditScore(phoneNumber);
  const template = messageTemplates[language]?.creditScore || messageTemplates.en.creditScore;
  
  return template
    .replace('{{score}}', score.toString())
    .replace('{{date}}', new Date().toLocaleDateString());
}

async function getUserCreditScore(phoneNumber: string): Promise<number> {
  // Mock implementation - replace with actual database query
  return Math.floor(Math.random() * (850 - 300) + 300);
}

function getWelcomeMessage(language: string): string {
  return messageTemplates[language]?.welcome || messageTemplates.en.welcome;
}

function getHelpMessage(language: string): string {
  return messageTemplates[language]?.help || messageTemplates.en.help;
}

async function handleDataSourceConnection(phoneNumber: string, dataSource: string, language: string): Promise<string> {
  return messageTemplates[language]?.dataSourceHelp || messageTemplates.en.dataSourceHelp;
}

async function handleReportRequest(phoneNumber: string, language: string): Promise<string> {
  // Generate secure link for full report
  const reportLink = `https://dbeasy.app/report/${phoneNumber}?token=${generateSecureToken()}`;
  
  const messages = {
    en: `📋 Your Credit Report is Ready!

🔒 Secure Link: ${reportLink}
⏰ Valid for: 24 hours
📱 Access from: Any device

Your report includes:
✅ Detailed credit score analysis
✅ Payment history
✅ Credit utilization
✅ Recommendations for improvement

Link expires in 24 hours for security.`,
    
    hi: `📋 आपकी क्रेडिट रिपोर्ट तैयार है!

🔒 सुरक्षित लिंक: ${reportLink}
⏰ वैध: 24 घंटे के लिए
📱 एक्सेस: किसी भी डिवाइस से

आपकी रिपोर्ट में शामिल है:
✅ विस्तृत क्रेडिट स्कोर विश्लेषण
✅ भुगतान इतिहास
✅ क्रेडिट उपयोग
✅ सुधार की सिफारिशें

सुरक्षा के लिए लिंक 24 घंटे में समाप्त हो जाता है।`,
    
    bn: `📋 আপনার ক্রেডিট রিপোর্ট প্রস্তুত!

🔒 নিরাপদ লিংক: ${reportLink}
⏰ বৈধ: 24 ঘণ্টার জন্য
📱 অ্যাক্সেস: যেকোনো ডিভাইস থেকে

আপনার রিপোর্টে রয়েছে:
✅ বিস্তারিত ক্রেডিট স্কোর বিশ্লেষণ
✅ পেমেন্ট ইতিহাস
✅ ক্রেডিট ব্যবহার
✅ উন্নতির সুপারিশ

নিরাপত্তার জন্য লিংক 24 ঘণ্টায় মেয়াদ শেষ।`
  };
  
  return messages[language] || messages.en;
}

async function handleLanguageChange(phoneNumber: string, language: string): Promise<string> {
  // Save user's language preference
  await saveUserLanguagePreference(phoneNumber, language);
  
  const confirmations = {
    en: "✅ Language changed to English. How can I help you today?",
    hi: "✅ भाषा हिंदी में बदल दी गई है। आज मैं आपकी कैसे मदद कर सकता हूं?",
    bn: "✅ ভাষা বাংলায় পরিবর্তন করা হয়েছে। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
  };
  
  return confirmations[language] || confirmations.en;
}

function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function saveUserLanguagePreference(phoneNumber: string, language: string): Promise<void> {
  // Mock implementation - replace with actual database update
  console.log(`Saved language preference: ${phoneNumber} -> ${language}`);
}
