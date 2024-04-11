import { cn } from 'libs/ui-components/src/utils';
import './global.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Welcome to Study and Visa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn('relative h-full font-sans')}>
        <main className="relative flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex-2 mt-5">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
