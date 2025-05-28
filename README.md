# Healthcare Translation Web App with Generative AI

## Overview
A real-time multilingual translation app for healthcare settings, enabling communication between patients and providers through speech-to-text, translation, and audio playback.

## Features
- 🎤 Voice-to-text transcription (Web Speech API)
- 🌐 Real-time AI translation (OpenAI API)
- 🔊 Audio playback of translated text
- 📱 Mobile-first, responsive UI
- 🌍 Language selector for input/output

## Tech Stack
- React + TypeScript
- Web Speech API (for speech recognition)
- OpenAI API (for translation)
- Vercel (for deployment)

## Security
- No data storage
- Transient in-browser processing
- OpenAI usage with secure API key via environment variables

## How to Run Locally
```bash
git clone https://github.com/YOUR_USERNAME/Healthcare-Translator.git
cd Healthcare-Translator
npm install
npm run dev
