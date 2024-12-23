import { auth } from '@clerk/nextjs/server';

import { Login } from '@/app/(sprints)/login';

import { Sprints } from '../../components/sprints/sprints';

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    return <Login />;
  }

  return <Sprints />;
}
