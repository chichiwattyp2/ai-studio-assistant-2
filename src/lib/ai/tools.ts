// Fix: Import and use the `Type` enum for schema definitions to align with modern @google/genai patterns.
import { FunctionDeclarationsTool, Type } from '@google/genai';

// This defines the functions the AI model can call.
// The actual implementation of these functions would live on the server.
export const tools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      {
        name: 'findCustomer',
        description: 'Find a customer by name, email, or phone number.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: 'Name, email, or phone number to search for.' },
          },
          required: ['query'],
        },
      },
      {
        name: 'summarizeThread',
        description: 'Summarize a conversation thread.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            threadId: { type: Type.STRING, description: 'The ID of the thread to summarize.' },
          },
          required: ['threadId'],
        },
      },
      {
        name: 'createOrder',
        description: 'Create a new order for a customer from a list of items.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            contactId: { type: Type.STRING },
            lines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                },
                required: ['name', 'qty', 'unitPrice'],
              },
            },
            currency: { type: Type.STRING, description: 'ISO currency code, e.g., "USD" or "ZAR".' },
          },
          required: ['contactId', 'lines', 'currency'],
        },
      },
      {
        name: 'syncToXero',
        description: 'Sync an order to Xero as a quote or invoice.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            orderId: { type: Type.STRING },
            create: { type: Type.STRING, enum: ['QUOTE', 'INVOICE'] },
          },
          required: ['orderId', 'create'],
        },
      },
    ],
  },
];
