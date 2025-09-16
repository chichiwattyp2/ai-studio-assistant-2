// This is a Server Component, it fetches initial data on the server.
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import InboxLayout from "./components/InboxLayout"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

// Define a reusable type for the thread payload
export type ThreadWithDetails = Prisma.ThreadGetPayload<{
  include: { 
    contact: true; 
    messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
    }; 
  };
}>;


async function getInboxData(): Promise<{ threads: ThreadWithDetails[] }> {
  try {
    // In a real app, you would fetch threads for the logged-in user's team
    const threads = await prisma.thread.findMany({
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      }
    });
    return { threads };
  } catch (error) {
    console.error("🔴 Failed to fetch inbox data. Is the database connected and migrated?", error);
    // Return empty array on error to prevent the page from crashing.
    // This allows the UI to render its empty state.
    return { threads: [] };
  }
}

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // You can also use NextAuth middleware for this
    redirect('/api/auth/signin');
  }

  const { threads } = await getInboxData();

  return (
    <main className="h-screen w-full p-4 overflow-hidden">
        <InboxLayout initialThreads={threads} />
    </main>
  );
}
