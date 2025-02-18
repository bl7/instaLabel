import { Footer, Header } from '@/components/navigation';

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=' h-screen w-screen overflow-x-hidden  scroll-smooth'>
      <Header />
      {children}
      <Footer />
    </main>
  );
}
