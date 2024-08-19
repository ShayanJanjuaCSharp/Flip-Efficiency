import { NextResponse } from 'next/server'; // Correct import
const { GoogleGenerativeAI } = require('@google/generative-ai');
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
  ];

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  safetySettings
});

export async function POST(req) {
  try {
    const body = await req.text(); 
    const prompt = `Given the phrase "${body}", give me two colour hex codes separated by commas, the first should be the text color and the second should be the background color.`;

    const result = await model.generateContent(prompt);

    
    const colors = result.response.text().trim().split(',');

    if (colors.length === 2) {
      const [textcolor, bgcolor] = colors;

      
      return NextResponse.json({
        textcolor: textcolor.trim(),
        bgcolor: bgcolor.trim(),
        message: `Colors generated successfully.`,
      });
    } else {
      return NextResponse.json({
        message: `Unexpected response format: ${result.response}`,
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      message: `An error occurred: ${error.message}`,
    }, { status: 500 });
  }
}