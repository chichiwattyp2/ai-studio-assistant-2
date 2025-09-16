'use client';

import Composer from './Composer';
import { type ThreadWithDetails } from '../page';

// Fetch the full message list for a thread on the client
// In a real app, this would be paginated
async function getMessagesForThread(threadId: string) {
    // This is a placeholder; you'd use tRPC or a route handler
    // const messages = await trpc.threads.getMessages.useQuery({ threadId });
    // return messages.data;
    return [];
}
  
export default function MessageFeed({ thread }: { thread: ThreadWithDetails }) {
  // const { data: messages, isLoading } = useQuery(['messages', thread.id], () => getMessagesForThread(thread.id));

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold">{thread.contact.name}</h2>
        <p className="text-sm text-gray-400">{thread.subject || 'WhatsApp Conversation'}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* In a real app, you'd fetch all messages here and map them */}
        {thread.messages.map((message) => (
             <div key={message.id} className={`flex ${message.direction === 'OUT' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-lg ${message.direction === 'OUT' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <p>{message.body}</p>
                </div>
            </div>
        ))}
      </div>
      <Composer threadId={thread.id} />
    </div>
  );
}
