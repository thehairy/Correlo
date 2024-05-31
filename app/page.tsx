import EmailList from "@/components/email-list"
import UserButton from "@/components/user-button"
import { auth } from "auth"

export default async function Index() {
  const session = await auth()
  const sessionToShow = {
    user: session?.user,
    expires: session?.expires,
  }

  return (
    <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold">Google Auth for an Email Client</h1>
    <div>
      This is supposed to test the authentification with Google OAuth2 and then receive emails from the logged in User.
    </div>
      <div className="flex flex-col bg-gray-100 rounded-md">
        <div className="p-4 font-bold bg-gray-200 rounded-t-md">
          Current Session
          <div className="float-end">
            <UserButton />
          </div>
        </div>
        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
          {JSON.stringify(sessionToShow, null, 2)}
        </pre>
      </div>
      <EmailList session={session} />
    </div>
  )
}
