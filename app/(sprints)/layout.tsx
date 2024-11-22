import { Header } from '@/components/header';
import { auth } from '@clerk/nextjs/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth.protect();

  return (
    <>
      <Header />

      <main className='container max-w-screen-lg mx-auto py-4'>
        {children}
      </main>
    </>
  );
}
