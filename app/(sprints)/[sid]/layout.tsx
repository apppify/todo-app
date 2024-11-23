import { auth } from '@clerk/nextjs/server';
import { TodoProvider } from '../../../providers/todo.provider';

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ sid: string }> }) {
  const { userId } = await auth.protect();

  return (
    <TodoProvider userId={userId} params={params}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </TodoProvider>
  );
}



