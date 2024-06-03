import EmailList from "@/components/email-list"
import UserButton from "@/components/user-button"
import { auth } from "auth"

export default async function Index() {
  const session = await auth()

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col h-full bg-gray-100 rounded-md">
        <div className="p-4 font-bold bg-gray-400 rounded-t-md">
          Current Session
          <div className="float-end">
            <UserButton />
          </div>
        </div>
        <div className="h-full whitespace-pre-wrap break-all">
          <EmailList session={session} />
        </div>
      </div>
    </div>
  )
}
