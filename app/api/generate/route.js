import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcard to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.`

// Gemini model with systemInstruction
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemPrompt,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          front: {
            type: "STRING",
          },
          back: {
            type: "STRING",
        }
        }
      }
    }
  }
});

export async function POST(req) {
  const data = await req.text()

  const result = await model.generateContent(data)
  console.log(result.response.text())

  // Parse the JSON response from the GenAI API
  const flashcards = JSON.parse(result.response.text())

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards)
}