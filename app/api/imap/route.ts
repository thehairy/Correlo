import { ImapFlow } from 'imapflow';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest): Promise<NextResponse> {
  const url = new URL(req.url ?? '');
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email || !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: email as string,
      accessToken: token as string,
    },
    emitLogs: false,
    logRaw: false,
    logger: false
  });

  try {
    let messages = [];
    await client.connect();
  
    let lock = await client.getMailboxLock('INBOX');
    for await (let message of client.fetch('1:*', { envelope: true })) {
        messages.push({ date: message.internalDate, envelope: message.envelope });
    }
    lock.release();
    await client.logout();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
