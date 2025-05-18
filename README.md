# Cerebrum.ai Web Frontend

## Overview
Cerebrum.ai is a next-generation, multimodal AI system that collects and analyzes patient inputs—including text, images, and behavioral data—to deliver personalized triage recommendations.

## Features

### Preloader
- Beautiful animated preloader with brain animation and pulsating effects
- Shows while loading any screen
- Custom CSS animations in global stylesheet

### Chatbot
- Floating circular brain logo button appears on all pages
- Opens a full-featured chatbot interface with typing indicators
- Powered by Gemini API for intelligent responses
- Introduces the website and answers user questions
- Styled with Cerebrum.ai brand colors

## Environment Setup

1. Clone the repository
2. Create a `.env` file in the root of the project (copy from `.env.example`)
3. Add your Gemini API key as `VITE_GEMINI_API_KEY=your_key_here`
4. Install dependencies: `npm install` or `bun install`
5. Start development server: `npm run dev` or `bun run dev`

## Building for Production

```bash
npm run build
# or
bun run build
```

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
