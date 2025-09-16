import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Handle webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('Webhook verification failed');
    return new NextResponse(null, { status: 403 });
  }
}

// Handle incoming messages
export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log('Received WhatsApp webhook:', JSON.stringify(body, null, 2));

  // In a production app, you would add this job to a BullMQ queue
  // to be processed by a worker, instead of processing it here.
  // This makes the webhook response faster and more reliable.
  
  // Example: queue.add('process-whatsapp-message', body);
  
  // Simplified direct processing:
  const messageEntry = body.entry?.[0]?.changes?.[0]?.value;
  if (messageEntry?.messages) {
    const message = messageEntry.messages[0];
    const contactWaId = message.from;
    const text = message.text?.body;
    
    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({
        where: { phones: { has: contactWaId } }
    });
    if (!contact) {
        contact = await prisma.contact.create({
            data: {
                name: messageEntry.contacts?.[0]?.profile?.name || 'New Contact',
                phones: [contactWaId],
            }
        });
    }

    // This is highly simplified. A real implementation needs to find the correct
    // channel account for the business phone number.
    const channelAccount = await prisma.channelAccount.findFirst();
    if (!channelAccount) {
      console.error("No channel account configured.");
      return new NextResponse(null, { status: 200 });
    }

    // 2. Find or create thread
    let thread = await prisma.thread.findFirst({
        where: { contactId: contact.id, channelAccountId: channelAccount.id }
    });
    if (!thread) {
        thread = await prisma.thread.create({
            data: {
                contactId: contact.id,
                channelAccountId: channelAccount.id,
                externalId: contactWaId, // For WhatsApp, the chat is identified by the user's number
            }
        });
    }

    // 3. Create message
    await prisma.message.create({
        data: {
            threadId: thread.id,
            externalId: message.id,
            direction: 'IN',
            body: text || '[Unsupported message type]',
            status: 'READ',
        }
    });

    // 4. Update thread timestamp
    await prisma.thread.update({
        where: { id: thread.id },
        data: { lastMessageAt: new Date() }
    });
  }

  return new NextResponse(null, { status: 200 });
}
