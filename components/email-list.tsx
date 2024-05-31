"use client"

import { useEffect, useState } from "react";
import { Session } from "next-auth";

export default function EmailList({ session }: { session: Session | null }) {
    const [emails, setEmails] = useState([]);
  
    useEffect(() => {
      if (session) {
        fetch(`/api/imap?email=${session.user?.email}&token=${session.accessToken}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setEmails(data.messages)
          })
          .catch((err) => console.error(err));
      }
    }, [session]);
  
    return (
      <div className="flex flex-col bg-gray-100 rounded-md">
        <div className="p-4 font-bold bg-gray-200 rounded-t-md">
          Email Data
        </div>
        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
          {JSON.stringify((emails ?? []), null, 2)}
        </pre>
      </div>
    );
  }
  