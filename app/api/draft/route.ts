import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

// NOTE: This file demonstrates the backend implementation for Next.js.
// The current frontend Demo uses services/geminiService.ts to simulate this call client-side.

export async function POST(req: NextRequest) {
  try {
    const { dna, modifiers } = await req.json();
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const prompt = `
      You are a UI Engine capable of generating React/Tailwind component structures.
      
      Context:
      I have a Design DNA with the following traits:
      - Style: ${dna.styleTags.join(', ')}
      - Colors: ${dna.colors.palette.join(', ')} (${dna.colors.mood})
      - Layout: ${dna.layout.structure}
      
      Modifiers: ${JSON.stringify(modifiers)}

      Task:
      1. Create a "Visual Draft" of a sample UI section.
      2. Return a JSON tree with types: 'container', 'text', 'header', 'button', 'image', 'input', 'card'.
      3. Include 'styles' (TailwindCSS classes) and 'content'.

      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            finalPrompt: { type: Type.STRING },
            draft: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                styles: { type: Type.STRING },
                content: { type: Type.STRING },
                children: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        styles: { type: Type.STRING },
                        content: { type: Type.STRING },
                        children: {
                           type: Type.ARRAY,
                           items: {
                              type: Type.OBJECT,
                              properties: {
                                type: { type: Type.STRING },
                                styles: { type: Type.STRING },
                                content: { type: Type.STRING }
                              }
                           }
                        }
                      }
                    } 
                }
              },
              required: ['type', 'styles']
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}