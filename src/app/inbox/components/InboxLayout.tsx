'use client';

import { useState } from 'react';
import ThreadList from './ThreadList';
import MessageFeed from './MessageFeed';
import CustomerPanel from './CustomerPanel';
import { type ThreadWithDetails } from '../page'; // Import the shared type

interface InboxLayoutProps {
    initialThreads: ThreadWithDetails[];
}

export default function InboxLayout({ initialThreads }: InboxLayoutProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreads[0]?.id || null);

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  // TODO: Implement real-time updates via WebSockets or polling (e.g., useSWR, react-query)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full max-h-full overflow-hidden">
      <div className="md:col-span-3 h-full max-h-full">
        <ThreadList 
          threads={threads} 
          selectedThreadId={selectedThreadId} 
          onSelectThread={setSelectedThreadId} 
        />
      </div>
      <div className="md:col-span-6 h-full max-h-full flex flex-col">
        {selectedThread ? (
          // Fix: Wrap MessageFeed in a keyed div to resolve the TypeScript error
          // on the 'key' prop. This preserves the component re-mounting behavior
          // when the selected thread changes, while keeping the fix localized.
          <div key={selectedThread.id} className="h-full">
            <MessageFeed thread={selectedThread} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800/20 rounded-2xl">
            <p className="text-gray-400">Select a conversation to start</p>
          </div>
        )}
      </div>
      <div className="md:col-span-3 h-full max-h-full">
        {selectedThread ? (
          <CustomerPanel contact={selectedThread.contact} />
        ) : (
            <div className="bg-slate-800/20 rounded-2xl h-full" />
        )}
      </div>
    </div>
  );
}