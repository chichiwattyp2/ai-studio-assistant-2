import { redirect } from 'next/navigation'

export default function HomePage() {
  // In a real app, you might have a landing page here.
  // For now, we redirect straight to the inbox.
  redirect('/inbox')
}
