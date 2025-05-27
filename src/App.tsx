import { useEffect, useRef, useState } from "react";
import { translateText } from "./translate";
// For browser compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
type SpeechRecognition = typeof SpeechRecognition;
type SpeechRecognitionEvent = any; // workaround for now

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("es");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = inputLang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          const finalText = result[0].transcript;
          setTranscript((prev) => prev + finalText + " ");

          translateText(finalText, inputLang, outputLang).then((translatedText) => {
          setTranslated((prev) => prev + translatedText + " ");});

        } else {
          interim += result[0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, [inputLang, outputLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setTranslated("");
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
    <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-blue-700">🏥 Healthcare Translator</h1>
        <p className="mt-2 text-lg text-gray-600">Real-time medical transcription and translation</p>
      </header>

      {/* Language Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Input Language</label>
          <select
            className="p-3 mt-2 rounded-lg border bg-gray-100 shadow-md focus:ring-2 focus:ring-blue-500"
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Output Language</label>
          <select
            className="p-3 mt-2 rounded-lg border bg-gray-100 shadow-md focus:ring-2 focus:ring-blue-500"
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>

      {/* Transcripts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="font-semibold text-xl text-blue-600">Original Transcript</h2>
          <p className="min-h-[100px] mt-2 text-gray-900">{transcript || "Waiting for input..."}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="font-semibold text-xl text-blue-600">Translated Transcript</h2>
          <p className="min-h-[100px] mt-2 text-gray-900">{translated || "Translation in progress..."}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 justify-center mt-4">
        <button
          className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition duration-300 ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? "⏹️ Stop Recording" : "🎙️ Start Recording"}
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition duration-300 hover:bg-green-600"
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance(translated);
            utterance.lang = outputLang;
            window.speechSynthesis.speak(utterance);
          }}
        >
          🔊 Speak Translation
        </button>
      </div>
    </div>
  </div>
);

}

export default App;
