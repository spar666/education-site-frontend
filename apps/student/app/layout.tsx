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
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WMKVVWLQ');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="relative h-full font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WMKVVWLQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <Providers store={store}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
