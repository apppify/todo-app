import { headers } from 'next/headers';

import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';

import { createUser } from '@/lib/db/queries';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;

  switch (eventType) {
    case 'user.created':
      const uid = evt.data.id;
      const primaryEmailId = evt.data.primary_email_address_id;
      if (!primaryEmailId) {
        return new Response('Error: primary email not found', {
          status: 400,
        });
      }

      const email = evt.data.email_addresses.find((it) => it.id === primaryEmailId)!.email_address;

      await createUser({
        id: uid,
        email,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
      });

      break;

    // case "user.deleted":
    //   await handleUserDeleted(evt.data);
    //   break;

    // case "user.updated":
    //   await handleUserUpdated(evt.data);
    //   break;

    default:
      console.log(`Unhandled event type ${eventType}`);
  }

  return new Response('Webhook received', { status: 200 });
}
