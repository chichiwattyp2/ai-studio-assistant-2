'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { callAIAssistant } from '@/lib/ai/actions';

interface ComposerProps {
    threadId: string;
}

export default function Composer({ threadId }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null); // State to hold AI tool call plan

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    toast.success(`Message sent (mock): ${message}`);
    // TODO: Call tRPC mutation to send message
    setMessage('');
  };

  const handleAIDraft = async () => {
    setIsLoading(true);
    setAiPlan(null);
    try {
        const result = await callAIAssistant(`Draft a reply for thread ${threadId}`);
        // This is a simplified flow. A real implementation would parse the tool calls
        // from the Gemini response.
        if (result.toolCalls) {
            toast.success('AI has a plan to execute.');
            setAiPlan(result.toolCalls); // Show the plan to the user
        } else {
             setMessage(result.text || "Sorry, I couldn't generate a draft.");
        }
    } catch (error) {
        toast.error('Failed to get AI draft.');
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const executeAiPlan = () => {
      // TODO: Implement logic to execute the tool calls in `aiPlan`
      toast.success('Executing AI plan (mock).');
      setAiPlan(null);
      setMessage("Here is the draft for the customer's order..."); // Example result
  }

  return (
    <div className="p-4 border-t border-white/10">
      {aiPlan && (
        <div className="mb-2 p-3 bg-slate-700/50 rounded-lg">
            <p className="font-bold text-sm mb-1">AI Execution Plan:</p>
            <pre className="text-xs whitespace-pre-wrap bg-black/30 p-2 rounded">
                {JSON.stringify(aiPlan, null, 2)}
            </pre>
            <div className="flex gap-2 mt-2">
                <button onClick={executeAiPlan} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Execute</button>
                <button onClick={() => setAiPlan(null)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Cancel</button>
            </div>
        </div>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-2 bg-slate-900/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        disabled={isLoading}
      />
      <div className="flex justify-between items-center mt-2">
        <button
            onClick={handleAIDraft}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : '✨ AI Assist'}
        </button>
        <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
