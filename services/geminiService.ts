
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface EditImageParams {
  imageData: ImageData;
  prompt: string;
  config: {
    responseModalities: Modality[];
  }
}

export const editImageWithGemini = async ({
  imageData,
  prompt,
  config,
}: EditImageParams): Promise<ImageData> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData.base64,
              mimeType: imageData.mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: config,
    });
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const newMimeType = part.inlineData.mimeType;
                const newBase64 = part.inlineData.data;
                const newDataUrl = `data:${newMimeType};base64,${newBase64}`;
                return {
                    dataUrl: newDataUrl,
                    mimeType: newMimeType,
                    base64: newBase64,
                };
            }
        }
    }

    throw new Error('No image data found in the API response.');

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while editing the image.');
  }
};
