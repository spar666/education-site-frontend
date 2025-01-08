import { Providers } from '../Provider';
import './global.css';
import './styles.css';
// import './antDesignStyles.less';

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin Panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
