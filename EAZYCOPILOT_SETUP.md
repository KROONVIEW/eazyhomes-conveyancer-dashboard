# EazyCopilot Setup Guide

EazyCopilot is now integrated into your EazyHomes dashboard! Follow these steps to get it working:

## 🚀 Quick Setup

### 1. Get Your API Key
Choose one of these options:

**Option A: OpenRouter (Recommended)**
- Visit [OpenRouter.ai](https://openrouter.ai/)
- Sign up and get your API key
- OpenRouter provides access to DeepSeek and many other AI models

**Option B: DeepSeek Direct**
- Visit [DeepSeek Platform](https://platform.deepseek.com/)
- Sign up and get your API key

### 2. Configure Environment Variables
Create a `.env` file in your project root and add ONE of these:

```bash
# Option A: OpenRouter
REACT_APP_OPENROUTER_API_KEY=your-openrouter-key-here

# Option B: DeepSeek Direct
REACT_APP_DEEPSEEK_API_KEY=your-deepseek-key-here
```

### 3. Restart Your Development Server
```bash
npm start
```

## 🧠 Features

- **Smart Legal Assistant**: Specialized in South African property law
- **Conversational Interface**: Natural back-and-forth conversations
- **Context Awareness**: Remembers conversation history
- **Professional Styling**: Matches your EazyHomes design
- **Gradient Brains Tab**: Distinctive styling to draw attention

## 🎯 Usage

1. Look for the **"Brains"** tab in your sidebar (it has a special gradient!)
2. Click on it to open EazyCopilot
3. Start asking questions about:
   - Property transfer processes
   - Lease agreements
   - Conveyancing procedures
   - South African property law
   - General legal guidance

## 🔧 Technical Details

- **AI Model**: DeepSeek Chat (via OpenRouter or direct)
- **Framework**: React with modern hooks
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Heroicons with SparklesIcon for branding

## 🚨 Important Notes

- Always provides general guidance, not specific legal advice
- Includes appropriate disclaimers
- Handles API errors gracefully
- Shows loading states during AI responses

## 🎨 Design Features

- Typing animation with bouncing dots
- Gradient header and distinctive Brains tab
- Modern chat interface similar to Notion AI
- Responsive design
- Auto-scroll to latest messages

## 📝 Demo Mode

If you don't have an API key yet, EazyCopilot will still load and show you the interface with helpful error messages explaining what's needed.

---

**Need help?** The EazyCopilot interface will guide you through any configuration issues! 