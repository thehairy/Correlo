"use client"

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { MessageEnvelopeObject } from "imapflow";

interface Email {
  date: string;
  envelope: MessageEnvelopeObject;
}

export default function EmailList({ session }: { session: Session | null }) {
  const [emails, setEmails] = useState<Email[]>([/*
    { envelope: { messageId: 1, subject: 'Hello there!', sender: [{ address: 'chewie@kashyyyk.com' }] } },
    { envelope: { messageId: 2, subject: 'Are you still there?', sender: [{ address: 'chewie@kashyyyk.com' }] } },
    { envelope: { messageId: 3, subject: 'Pay up!', sender: [{ address: 'chewie@kashyyyk.com' }] } },
    { envelope: { messageId: 4, subject: 'Greetings!', sender: [{ address: 'chewie@kashyyyk.com' }] } },*/
  ]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    if (session /*&& false*/) {
      fetch(`/api/imap?email=${session.user?.email}&token=${session.accessToken}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setEmails(data.messages);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="flex h-full bg-gray-200">
      <div className="w-1/5 h-full bg-gray-200 border-r-2 border-gray-300">
        <ul className="overflow-y-auto h-full">
          {emails.map((email: Email) => (
            <li
              key={email.envelope.messageId}
              className="p-4 cursor-pointer hover:bg-gray-300"
              onClick={() => handleEmailClick(email)}
            >
              <div className="font-bold">{email.envelope.subject}</div>
              <div className="text-sm text-gray-600">{email.envelope.sender[0].address}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-4/5 p-4 h-full">
        {selectedEmail ? (
          <div>
            <h1 className="text-xl font-bold">{selectedEmail.envelope.subject}</h1>
            <p className="text-sm text-gray-600">{selectedEmail.envelope.sender[0].address}</p>
            <div className="mt-4 whitespace-pre-wrap">
              body
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Select an email to view its content</div>
        )}
      </div>
    </div>
  );
}
