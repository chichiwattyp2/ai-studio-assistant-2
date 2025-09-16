'use server';

// Fix: Update imports and usage of @google/genai to align with current API guidelines.
import { GoogleGenAI } from '@google/genai';
import { tools } from './tools';

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error('Missing API_KEY environment variable');
}

// Fix: Initialize the client with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Refactor to use the modern `ai.models.generateContent` method instead of deprecated chat/model methods.
export async function callAIAssistant(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            tools: tools,
        });

        // Extract tool calls from the response parts, as the `functionCalls()` helper is deprecated.
        const toolCalls = response.candidates?.[0]?.content?.parts
            .filter(part => !!part.functionCall)
            .map(part => part.functionCall);

        if (toolCalls && toolCalls.length > 0) {
            // In a real app, you would execute these tools and send the results back to the model.
            // For now, we return the plan to the UI.
            return { toolCalls };
        } else {
            // Fix: Access the response text via the `.text` property instead of the `.text()` method.
            return { text: response.text };
        }

    } catch (error) {
        console.error("Error calling AI assistant:", error);
        return { error: 'Failed to communicate with the AI model.' };
    }
}
