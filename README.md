# Unified Inbox AI Assistant

This is a web-based unified inbox that streams and manages customer conversations and orders across WhatsApp Business and Email, with Xero accounting integration and built-in AI assistance.

## 1. Architecture

### Rationale

This architecture is designed for scalability, real-time communication, and reliability, optimized for a modern web application.

*   **Next.js 14 (App Router):** Provides a robust framework for both frontend and backend, enabling server-side rendering, API routes, and a great developer experience.
*   **tRPC:** Ensures end-to-end type safety between the client and server, catching bugs at build time and improving developer velocity.
*   **Prisma & PostgreSQL:** A modern, type-safe ORM and a powerful relational database, suitable for complex data models.
*   **BullMQ & Redis:** A reliable queueing system to handle asynchronous tasks like processing webhooks, sending notifications, and syncing data, ensuring the main application remains responsive.
*   **NextAuth.js:** Simplifies authentication, handling complex OAuth2 flows for Google (Gmail) and Xero securely.
*   **Gemini API:** Leveraged for advanced AI capabilities like summarization, reply drafting, and tool-calling to automate workflows.
*   **Tailwind CSS:** For rapid, utility-first UI development.

### ASCII Diagram

```
+----------------+      +----------------------+      +--------------------+
|   Web Browser  |----->|  Next.js Frontend    |<---->| Next.js API/tRPC   |
| (React/Next.js)|      | (Vercel/Node.js)     |      | (Serverless/Node.js) |
+----------------+      +----------------------+      +----------+---------+
       ^                      ^        ^                         |
       | Real-time UI Updates |        | API Calls               |
       | (WebSockets/SSE)     |        |                         |
       v                      |        v                         v
+----------------+      +-----+--------+---------+      +--------------------+
|   Real-time    |<-----| BullMQ / Redis         |<-----| Database (Postgres)|
| Service (ws)   |      | (Job Queue & Caching)  |      | (Prisma ORM)       |
+----------------+      +------------------------+      +--------------------+
                                 ^       ^
                                 |       |
+--------------------------------+       +---------------------------------+
|                                        |                                 |
v                                        v                                 v
+-----------------+           +--------------------+           +--------------------+
| External Services |           |   AI Service       |           |   Webhook Sources  |
| - Xero API      |           |   - Gemini API     |           | - WhatsApp Cloud   |
| - Gmail API     |<--------->|   (Tool Calling)   |<--------->| - Gmail Push       |
| - SMTP/IMAP     |           +--------------------+           +--------------------+
+-----------------+
```

## 2. Environment Setup

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Setup PostgreSQL:** Make sure you have a PostgreSQL server running (e.g., via Docker or Supabase).
4.  **Setup Redis:** Make sure you have a Redis server running.
5.  **Copy the environment file:** `cp .env.example .env`
6.  **Fill in the `.env` file** with your credentials. See below for how to get them.
7.  **Run database migrations:** `npx prisma migrate dev`
8.  **(Optional) Seed the database:** `npx prisma db seed`
9.  **Run the development server:** `npm run dev`

## 3. Obtaining Credentials

### WhatsApp Business Cloud API

1.  Go to the [Meta for Developers](https://developers.facebook.com/) portal.
2.  Create a new App of type "Business".
3.  From the app dashboard, set up the "WhatsApp" product.
4.  You will get a temporary access token (`WHATSAPP_TOKEN`), a Phone Number ID (`WHATSAPP_PHONE_NUMBER_ID`), and a test phone number.
5.  Configure the Webhook endpoint in the WhatsApp settings:
    *   **Callback URL:** `https://<your-deployed-url>/api/webhooks/whatsapp`
    *   **Verify Token:** Create a secure, random string and set it as `WHATSAPP_VERIFY_TOKEN` in your `.env`.
6.  Subscribe to the `messages` webhook field.
7.  To verify the webhook with cURL (Meta will do this from their UI, but for testing):
    ```bash
    curl -X GET "https://<your-url>/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=CHALLENGE_STRING&hub.verify_token=YOUR_VERIFY_TOKEN"
    ```

### Google (Gmail) API

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Enable the "Gmail API".
4.  Go to "Credentials", create new "OAuth 2.0 Client IDs".
5.  Select "Web application".
6.  Add an "Authorized redirect URI": `http://localhost:3000/api/auth/callback/google` (and your production URL).
7.  Copy the Client ID (`GOOGLE_CLIENT_ID`) and Client Secret (`GOOGLE_CLIENT_SECRET`).

### Xero API

1.  Go to the [Xero Developer Portal](https://developer.xero.com/).
2.  Create a new "Web app".
3.  Enter your app name and company URL.
4.  Add an OAuth 2.0 redirect URI: `http://localhost:3000/api/auth/callback/xero` (and your production URL).
5.  Copy the Client ID (`XERO_CLIENT_ID`) and Client Secret (`XERO_CLIENT_SECRET`).

### Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click "Get API key" and create a new key.
3.  Add it to your `.env` file as `API_KEY`.

## 4. First Message Walkthrough

1.  Start the app (`npm run dev`).
2.  Navigate to `http://localhost:3000` and sign in with Google.
3.  Go to Settings -> Integrations and connect your Xero account.
4.  Send a message from your personal WhatsApp to the test number provided by Meta.
5.  The message should appear in real-time in your Unified Inbox.
6.  Click on the conversation, and use the AI composer to draft and send a reply.
