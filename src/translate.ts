import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function translateText(inputText: string,
  sourceLang: string,
  targetLang: string): Promise<string | null> {
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Translate this medical sentence from ${sourceLang} to ${targetLang}. ONLY return the translated sentence with correct medical terms translations — no explanations, no alternatives.\n\nSentence: "${inputText}"`
              }
            ]
          }
        ]
      }
    );

    const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Translated:", output);
    return output;
  } catch (error) {
    console.error("Gemini Translation Failed:", error);
    return null;
  }
}
