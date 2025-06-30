# dbEasy - Alternative Credit Reporting System

![dbEasy Logo](https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=dbEasy)

## Overview

dbEasy is an innovative Alternative Credit Reporting System designed specifically for the Indian market. It features comprehensive support for Indian vernacular languages and voice communication capabilities optimized for low network coverage areas.

## 🌟 Key Features

### 🗣️ Vernacular Language Support
- **12+ Indian Languages**: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and English
- **Native Script Support**: Proper rendering of Devanagari, Bengali, Tamil, Telugu, and other Indian scripts
- **Voice Commands**: Native language voice commands for navigation and actions
- **Cultural Adaptation**: UI/UX adapted for Indian users

### 🎤 Voice Communication Features
- **Speech Recognition**: Multi-language speech recognition using Web Speech API
- **Text-to-Speech**: Natural voice synthesis in Indian languages
- **Voice Navigation**: Complete hands-free navigation
- **Low Bandwidth Optimization**: Graceful degradation for poor network conditions
- **Offline Capability**: Core voice features work offline

### 📊 Credit Reporting Features
- **Alternative Data Sources**: Bank accounts, digital payments, utility bills, mobile recharge history
- **Real-time Credit Scoring**: Dynamic credit score calculation
- **Data Privacy**: GDPR and Indian data protection compliance
- **Secure Integration**: Bank-grade security for financial data

### 🌐 Network Optimization
- **Low Bandwidth Mode**: Optimized for 2G/3G networks
- **Offline First**: Progressive Web App with offline capabilities
- **Smart Caching**: Intelligent data caching for rural connectivity
- **Network Status Awareness**: Adapts functionality based on connection quality

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with Indian language font support
- **Internationalization**: i18next with 12+ Indian languages
- **Voice**: Web Speech API with fallback support
- **PWA**: Service Workers for offline functionality
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel/Netlify optimized

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/rano-g/dbEasy.git
cd dbEasy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Usage

### Language Selection
1. Use the language switcher in the top-right corner
2. Select from 12+ supported Indian languages
3. The interface will immediately adapt to your chosen language
4. Language preference is saved locally

### Voice Assistant
1. Click the microphone button in the bottom-right corner
2. Say commands in your preferred language:
   - "डैशबोर्ड" (Hindi) or "Dashboard" (English)
   - "डेटा स्रोत" (Hindi) or "Data Sources" (English)
   - "मदद" (Hindi) or "Help" (English)
3. The system will navigate and provide voice feedback

### Network Adaptation
- The app automatically detects network quality
- Features gracefully degrade on slow connections
- Core functionality remains available offline

## 🏗️ Project Structure

```
dbEasy/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout with i18n
│   │   ├── page.tsx         # Home page
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── data-sources/    # Data source management
│   │   ├── privacy/         # Privacy settings
│   │   └── help/           # Help and support
│   ├── components/          # Reusable components
│   │   ├── VoiceAssistant.tsx    # Voice functionality
│   │   ├── LanguageSwitcher.tsx  # Language selection
│   │   ├── Navigation.tsx        # Main navigation
│   │   └── NetworkStatus.tsx     # Network monitoring
│   ├── lib/                # Utility libraries
│   │   ├── languages.ts     # Language configuration
│   │   ├── i18n.ts         # Internationalization setup
│   │   └── utils.ts        # Common utilities
│   ├── locales/            # Translation files
│   │   ├── en/common.json  # English translations
│   │   ├── hi/common.json  # Hindi translations
│   │   ├── bn/common.json  # Bengali translations
│   │   └── [others]/       # Other Indian languages
│   └── styles/
│       └── globals.css     # Global styles
├── .github/
│   └── workflows/          # GitHub Actions
├── public/                 # Static assets
├── tests/                  # Test files
└── docs/                   # Documentation
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Deployment

The application is automatically deployed using GitHub Actions:

1. **Development**: Auto-deploy on push to `develop` branch
2. **Staging**: Auto-deploy on push to `staging` branch
3. **Production**: Auto-deploy on push to `main` branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod
```

## 🌍 Supported Languages

| Language | Code | Script | Voice Support |
|----------|------|--------|--------------|
| English | en | Latin | ✅ |
| Hindi | hi | Devanagari | ✅ |
| Bengali | bn | Bengali | ✅ |
| Tamil | ta | Tamil | ✅ |
| Telugu | te | Telugu | ✅ |
| Marathi | mr | Devanagari | ✅ |
| Gujarati | gu | Gujarati | ✅ |
| Kannada | kn | Kannada | ✅ |
| Malayalam | ml | Malayalam | ✅ |
| Punjabi | pa | Gurmukhi | ✅ |
| Odia | or | Oriya | ✅ |
| Assamese | as | Bengali | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure accessibility compliance
- Test with multiple Indian languages
- Verify voice features across browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Fonts for Indian language font support
- Web Speech API community
- i18next team for internationalization framework
- Indian fintech community for alternative credit insights

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rano-g/dbEasy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rano-g/dbEasy/discussions)
- **Email**: [Create an issue for support](https://github.com/rano-g/dbEasy/issues/new)

---

**Built with ❤️ for financial inclusion in India**

*Empowering credit access through technology and linguistic diversity*