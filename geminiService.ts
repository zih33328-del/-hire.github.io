
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getGeminiResponse = async (prompt: string, history: { role: string; parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure it's configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Custom instruction to make Gemini act as a personal assistant for the portfolio owner
  const systemInstruction = `
    You are the personal AI assistant for "Aurora", a world-class senior developer and designer. 
    Your goal is to answer questions about Aurora's portfolio, skills, and projects.
    Aurora's key skills: React, TypeScript, Tailwind CSS, AI Integration, UI/UX Design.
    Tone: Professional, friendly, and slightly witty.
    If asked about things not related to Aurora, try to steer back to her professional expertise but be polite.
    Aurora loves coffee, clean code, and minimal design.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong with my circuits. Please try again later!";
  }
};
