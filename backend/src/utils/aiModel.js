import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'
dotenv.config() ;


const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);

export const analyzeNoteWithGemini = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this note and provide key insights, this is a note in a notes application and user wants to analyze this note maybe they have written what they are looking for in the note itself else you can yourself analyze the note and provide an appropriate response in about 200-400 words, here is the note:\n\n${text}`;
    const result = await model.generateContent(prompt);
    

    return result.response.candidates[0].content.parts[0].text
  } catch (err) {
    console.error(err) ;

    throw new Error('Failed to analyze note ');
  }
};
