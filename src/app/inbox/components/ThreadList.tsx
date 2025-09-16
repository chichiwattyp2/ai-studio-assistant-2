'use client';

import { type ThreadWithDetails } from '../page'; // Import the shared type

interface ThreadListProps {
  threads: ThreadWithDetails[];
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
}

export default function ThreadList({ threads, selectedThreadId, onSelectThread }: ThreadListProps) {
  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold">Inbox</h1>
        {/* Filters would go here */}
      </div>
      <div className="overflow-y-auto">
        {threads.length === 0 && (
          <p className="p-4 text-gray-400">No conversations yet.</p>
        )}
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={`p-4 cursor-pointer border-b border-white/10 hover:bg-white/5 ${
              thread.id === selectedThreadId ? 'bg-blue-500/20' : ''
            }`}
          >
            <p className="font-semibold">{thread.contact.name || 'Unknown Contact'}</p>
            <p className="text-sm text-gray-400 truncate">
                {thread.messages[0]?.body || 'No messages yet'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
