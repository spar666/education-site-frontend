import { cn } from 'libs/ui-components/src/utils';
import './global.css';

import { Providers } from '../Provider'; // Ensure this includes Redux Provider
import store from '../store'; // Your Redux store
import Navbar from '../components/v2/Navbar';
import Footer from '../components/v2/Footer';

export const metadata = {
  title: {
    default: 'Study Abroad & Visa Assistance | Study and Visa',
    template: '%s | Study and Visa', // For dynamic titles
  },
  description:
    'Expert guidance for studying abroad and visa processing. Get free counseling for universities worldwide and visa application support.',
  alternates: {
    canonical: 'https://www.studyandvisa.com/',
  },
  icons: {
    icon: '/favicon.ico', 
    apple: '/apple-touch-icon.png', 
  },
  openGraph: {
    title: 'Study Abroad & Visa Assistance | Study and Visa',
    description: 'Expert guidance for studying abroad and visa processing.',
    url: 'https://www.studyandvisa.com/',
    siteName: 'Study and Visa',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
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
