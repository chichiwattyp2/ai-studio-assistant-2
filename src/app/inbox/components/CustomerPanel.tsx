'use client';

import type { Contact } from '@prisma/client';

export default function CustomerPanel({ contact }: { contact: Contact }) {
  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl h-full p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Customer Details</h2>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-400">Name</p>
          <p>{contact.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p>{contact.emails[0] || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Phone</p>
          <p>{contact.phones[0] || 'N/A'}</p>
        </div>
        {contact.xeroContactId && (
            <div>
                <p className="text-sm text-gray-400">Xero Balance</p>
                <p>$0.00 (Outstanding)</p> {/* Placeholder */}
            </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Actions</h3>
        <div className="flex flex-col space-y-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full text-left">
                Create Order
            </button>
             <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg w-full text-left">
                Generate Quote
            </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Order History</h3>
        <div className="text-sm text-gray-400">
            No orders yet.
        </div>
      </div>
    </div>
  );
}
