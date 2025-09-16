// Fix: Add a triple-slash directive to include Node.js types, resolving the error on process.exit.
/// <reference types="node" />

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const contact1 = await prisma.contact.create({
    data: {
      name: 'Alice Johnson',
      emails: ['alice@example.com'],
      phones: ['+1234567890'],
    },
  });

  const team1 = await prisma.team.create({
    data: {
      name: 'Default Team',
    }
  });

  const whatsappChannel = await prisma.channelAccount.create({
    data: {
      teamId: team1.id,
      type: 'WHATSAPP_BUSINESS',
      name: 'Support WhatsApp',
      details: { phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID },
    }
  });

  const thread1 = await prisma.thread.create({
    data: {
      contactId: contact1.id,
      channelAccountId: whatsappChannel.id,
      externalId: 'wa_conv_1', // Mock external ID
      lastMessageAt: new Date(),
    }
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      direction: 'IN',
      body: 'Hi there, I need help with my order.',
      status: 'READ',
    }
  });
  
  await prisma.message.create({
    data: {
      threadId: thread1.id,
      direction: 'OUT',
      body: 'Hello Alice, how can I help you today?',
      status: 'DELIVERED',
    }
  });

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })