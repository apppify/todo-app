import { Header } from '@/components/header';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="container max-w-screen-lg mx-auto py-4">{children}</main>
    </>
  );
}
