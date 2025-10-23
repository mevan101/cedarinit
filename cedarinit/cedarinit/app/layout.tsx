import { ReactNode } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import '../styles/globals.css';

export const metadata = {
  title: 'Cedar Initiative',
  description: 'A modern, fast, secure, and accessible site for Cedar Initiative.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}