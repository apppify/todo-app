import { auth } from '@clerk/nextjs/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth.protect();

  return (

    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {children}
    </div>

  );
}



