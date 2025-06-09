import { cn } from 'libs/ui-components/src/utils';
import './global.css';

import { Providers } from '../Provider'; // Ensure this includes Redux Provider
import store from '../store'; // Your Redux store
import Navbar from '../components/v2/Navbar';
import Footer from '../components/v2/Footer';

export const metadata = {
  title: 'Welcome to Study and Visa',
  description: 'Your gateway to studying abroad and visa assistance.',
  alternates: {
    canonical: 'https://www.studyandvisa.com/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'relative h-full bg-gradient-to-b from-indigo-50 to-white font-sans antialiased'
        )}
      >
        <Providers store={store}>
          {' '}
          {/* Ensure Providers wraps everything */}
          <Navbar /> {/* Navbar is now inside Providers */}
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
