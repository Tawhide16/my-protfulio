import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://tawhidhasan.com'),
  title: 'Tawhid Hasan Bejoy | Web Developer & Shopify Expert',
  description: 'Portfolio of Tawhid Hasan Bejoy - Web Developer specializing in Full Stack MERN development, modern React/Next.js web applications, and custom Shopify themes.',
  keywords: [
    'Tawhid Hasan Bejoy',
    'Full Stack Developer',
    'Web Developer',
    'React Developer',
    'Next.js Developer',
    'Shopify Expert',
    'MERN Stack Developer',
    'Softvence',
    'Frontend Engineer'
  ],
  authors: [{ name: 'Tawhid Hasan Bejoy', url: 'https://github.com/Tawhide16' }],
  creator: 'Tawhid Hasan Bejoy',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Tawhid Hasan Bejoy | Web Developer & Shopify Expert',
    description: 'Explore full-stack MERN projects, modern React & Next.js applications, and custom Shopify e-commerce solutions built by Tawhid Hasan Bejoy.',
    url: 'https://tawhidhasan.com',
    siteName: 'Tawhid Hasan Bejoy Portfolio',
    images: [
      {
        url: '/NEXT-CLASS.png',
        width: 1200,
        height: 630,
        alt: 'Tawhid Hasan Bejoy Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawhid Hasan Bejoy | Web Developer & Shopify Expert',
    description: 'Portfolio of Tawhid Hasan Bejoy - Web Developer & Shopify Expert.',
    images: ['/NEXT-CLASS.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans scroll-smooth`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#08080f] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
