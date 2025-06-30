'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, QrCode, Phone, Send, Users } from 'lucide-react';
import QRCode from 'qrcode';

interface WhatsAppSession {
  isConnected: boolean;
  qrCode?: string;
  sessionId?: string;
  phoneNumber?: string;
}

interface WhatsAppMessage {
  id: string;
  from: string;
  body: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  language: string;
}

export default function WhatsAppIntegration() {
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState<WhatsAppSession>({ isConnected: false });
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Initialize WhatsApp connection
    initializeWhatsApp();
  }, []);

  const initializeWhatsApp = async () => {
    try {
      // Generate QR code for WhatsApp Web connection
      const qrData = `whatsapp://send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrCodeDataUrl);
      
      // Mock connection status - replace with actual WhatsApp Web.js integration
      setTimeout(() => {
        setSession({
          isConnected: true,
          sessionId: 'session_' + Date.now(),
          phoneNumber: '+91XXXXXXXXXX'
        });
      }, 3000);
    } catch (error) {
      console.error('Error initializing WhatsApp:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      // Send message via Twilio WhatsApp API
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedContact,
          body: newMessage,
          language: i18n.language
        }),
      });

      if (response.ok) {
        const messageData: WhatsAppMessage = {
          id: 'msg_' + Date.now(),
          from: 'dbEasy',
          body: newMessage,
          timestamp: new Date(),
          type: 'outgoing',
          language: i18n.language
        };

        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendBulkCreditAlerts = async () => {
    const alertMessage = {
      en: `🏦 dbEasy Credit Alert

📊 Your credit score has been updated!
📈 New Score: Available now
📅 Last Update: ${new Date().toLocaleDateString()}

📱 Check your full report: https://dbeasy.app
💬 Reply "score" to see your current score
🌐 Reply "hindi" for हिंदी support

Questions? Reply "help" for assistance.`,
      
      hi: `🏦 dbEasy क्रेडिट अलर्ट

📊 आपका क्रेडिट स्कोर अपडेट हो गया है!
📈 नया स्कोर: अब उपलब्ध है
📅 अंतिम अपडेट: ${new Date().toLocaleDateString()}

📱 अपनी पूरी रिपोर्ट देखें: https://dbeasy.app
💬 वर्तमान स्कोर देखने के लिए "स्कोर" का जवाब दें
🌐 English सपोर्ट के लिए "english" का जवाब दें

सवाल? सहायता के लिए "मदद" का जवाब दें।`
    };

    // Send to all users based on their language preference
    const users = await fetch('/api/users/active').then(res => res.json());
    
    for (const user of users) {
      const message = alertMessage[user.language] || alertMessage.en;
      await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.phoneNumber,
          body: message,
          language: user.language
        }),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MessageCircle className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('whatsapp.title', 'WhatsApp Integration')}
          </h1>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              {t('whatsapp.connectionStatus', 'Connection Status')}
            </h3>
            
            {session.isConnected ? (
              <div className="flex items-center text-green-600">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                {t('whatsapp.connected', 'Connected')} - {session.phoneNumber}
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center text-yellow-600 mb-3">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                  {t('whatsapp.connecting', 'Connecting...')}
                </div>
                {qrCodeUrl && (
                  <div>
                    <img src={qrCodeUrl} alt="WhatsApp QR Code" className="mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {t('whatsapp.scanQR', 'Scan with WhatsApp to connect')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {t('whatsapp.quickActions', 'Quick Actions')}
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={sendBulkCreditAlerts}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('whatsapp.sendCreditAlerts', 'Send Credit Score Alerts')}
              </button>
              
              <button
                onClick={() => window.open('/whatsapp/broadcast', '_blank')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('whatsapp.broadcastMessage', 'Broadcast Message')}
              </button>
            </div>
          </div>
        </div>

        {/* Message Interface */}
        {session.isConnected && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              {t('whatsapp.messaging', 'Messaging Interface')}
            </h3>
            
            {/* Contact Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('whatsapp.selectContact', 'Select Contact')}
              </label>
              <input
                type="tel"
                placeholder="+91XXXXXXXXXX"
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                  {t('whatsapp.noMessages', 'No messages yet')}
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 p-2 rounded-lg max-w-xs ${
                      message.type === 'outgoing'
                        ? 'bg-green-500 text-white ml-auto'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.body}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Send Message */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder={t('whatsapp.typeMessage', 'Type a message...')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !selectedContact}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Usage Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-blue-700">
              {t('whatsapp.totalMessages', 'Total Messages Sent')}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">856</div>
            <div className="text-sm text-green-700">
              {t('whatsapp.activeUsers', 'Active Users')}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-purple-700">
              {t('whatsapp.deliveryRate', 'Delivery Rate')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
