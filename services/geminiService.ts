import { GoogleGenAI, Type } from "@google/genai";
import { DesignDNA, DraftResponse } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY
});

// We use the user-specified model for vision tasks, but Flash is often more stable for pure JSON generation.
// We'll use the config model for analysis and a fallback or same model for drafting.
const VISION_MODEL_ID = "gemini-3-pro-image-preview";
const LOGIC_MODEL_ID = "gemini-2.5-flash";

export const analyzeDesignDNA = async (
  base64Data: string,
  mimeType: string
): Promise<Omit<DesignDNA, 'id' | 'timestamp' | 'imageUrl'>> => {
  try {
    const prompt = `
      You are a Lead Design System Architect. Analyze the attached UI/Design image to extract its "Design DNA".
      
      I need a structured technical breakdown of the visual language.
      
      Return a JSON object with:
      1. styleTags: 5-7 specific keywords (e.g. 'glassmorphism', 'bento-grid', 'neo-brutalism').
      2. colors: Extract the dominant color (hex), a suggested palette of 5 colors (hex), and the general mood (e.g., 'trustworthy blue', 'energetic orange').
      3. layout: Describe the grid system, visual hierarchy, spacing tightness, and overall structure.
      4. components: Describe the shape language (rounded vs sharp), button styles, and component depth.
      5. typography: Describe the font categories (sans/serif/mono), weights used, and typographic layout.
      6. basePrompt: A highly detailed, professional image generation prompt (Midjourney/Flux style) to recreate this exact aesthetic.
    `;

    const response = await ai.models.generateContent({
      model: VISION_MODEL_ID,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: mimeType } },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            colors: {
              type: Type.OBJECT,
              properties: {
                palette: { type: Type.ARRAY, items: { type: Type.STRING } },
                dominant: { type: Type.STRING },
                mood: { type: Type.STRING },
              },
              required: ["palette", "dominant", "mood"],
            },
            layout: {
              type: Type.OBJECT,
              properties: {
                grid: { type: Type.STRING },
                hierarchy: { type: Type.STRING },
                structure: { type: Type.STRING },
                spacing: { type: Type.STRING },
              },
              required: ["grid", "hierarchy", "structure", "spacing"],
            },
            components: {
              type: Type.OBJECT,
              properties: {
                shapes: { type: Type.STRING },
                interactivity: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["shapes", "interactivity", "description"],
            },
            typography: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING },
                weight: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["style", "weight", "description"],
            },
            basePrompt: { type: Type.STRING },
          },
          required: ["styleTags", "colors", "layout", "components", "typography", "basePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const generateDesignDraft = async (
  dna: DesignDNA,
  modifiers: any
): Promise<DraftResponse> => {
  try {
    const prompt = `
      You are a UI Engine capable of generating React/Tailwind component structures.
      
      Context:
      I have a Design DNA with the following traits:
      - Style: ${dna.styleTags.join(', ')}
      - Colors: ${dna.colors.palette.join(', ')} (${dna.colors.mood})
      - Layout: ${dna.layout.structure}
      - Components: ${dna.components.shapes}
      
      User Modifiers:
      - Complexity: ${modifiers.complexity}/100
      - Warmth: ${modifiers.warmth}/100
      - Roundness/Softness: ${modifiers.blur}/100
      - Mood: ${modifiers.mood}

      Task:
      1. Create a "Visual Draft" of a sample UI section (like a Hero section, a Dashboard card, or a Feature grid) that embodies this DNA and the modifiers.
      2. The draft must be a JSON tree of components. 
         - Supported types: 'container', 'text', 'header', 'button', 'image', 'input', 'card'.
         - 'styles': A string of TailwindCSS classes. Ensure valid, high-contrast colors using the palette provided. Use arbitrary values if needed (e.g. bg-[#123456]).
         - 'content': Text content for text/header/button types.
         - 'children': Nested components.
      3. Also generate the 'finalPrompt' used for image generation models.

      Return JSON format exactly matching the schema.
    `;

    // We define a recursive schema with fixed depth to avoid "empty object" errors in the API validation
    const componentSchema = {
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
              // Limited recursion depth
            }
          }
        }
      }
    };

    const response = await ai.models.generateContent({
      model: LOGIC_MODEL_ID, // Using Flash for reliable JSON generation
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
                type: { type: Type.STRING, enum: ['container', 'text', 'header', 'button', 'image', 'input', 'card'] },
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
                     }
                  }
                }
              },
              required: ['type', 'styles']
            }
          },
          required: ['finalPrompt', 'draft']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Draft Generation Failed:", error);
    throw error;
  }
};