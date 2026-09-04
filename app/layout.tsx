import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PWAProvider } from '@/components/pwa/pwa-context'
import { SITE_URL, SITE_NAME, FITNESS_PARTNER_KEYWORDS } from '@/lib/site'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fitacle | Find a Fitness Partner & AI Fitness Platform',
    template: '%s | Fitacle',
  },
  description:
    'Fitacle helps you find a fitness partner near you — a gym buddy, workout partner, running or walking companion — plus AI fitness plans. Become the version you respect.',
  keywords: ['fitness', 'AI fitness', 'body analyzer', 'gym partner', 'workout', 'nutrition', 'transformation', ...FITNESS_PARTNER_KEYWORDS],
  authors: [{ name: 'FITACLE' }],
  applicationName: 'Fitacle',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: 'Fitacle',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Fitacle | Find a Fitness Partner & AI Fitness Platform',
    description:
      'Find a fitness partner near you — gym buddy, workout partner, running or walking companion — plus AI fitness plans. Never train alone.',
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/images/fitacle-logo.png',
        width: 1170,
        height: 912,
        alt: 'Fitacle logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitacle | Find a Fitness Partner & AI Fitness Platform',
    description:
      'Find a fitness partner near you — gym buddy, workout partner, running or walking companion. Never train alone.',
    images: ['/images/fitacle-logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <PWAProvider>{children}</PWAProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
