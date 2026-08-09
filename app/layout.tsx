import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  metadataBase: new URL('https://fitacle.com'),
  title: {
    default: 'Fitacle | Find a Workout Partner & AI Fitness Platform',
    template: '%s | Fitacle',
  },
  description:
    'Find a workout partner, gym buddy, or accountability partner near you. Fitacle matches you with training partners by goals, activity, schedule, and location — powered by AI fitness intelligence.',
  keywords: [
    'find a workout partner',
    'find a gym partner',
    'workout partner',
    'gym buddy',
    'fitness partner',
    'training partner',
    'accountability partner',
    'find a fitness partner near me',
    'workout buddy app',
    'AI fitness',
    'body analyzer',
    'nutrition',
    'transformation',
  ],
  authors: [{ name: 'Fitacle' }],
  creator: 'Fitacle',
  applicationName: 'Fitacle',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Find a Workout Partner | Fitacle AI Fitness Platform',
    description:
      'Never train alone. Find a workout partner, gym buddy, or accountability partner matched by goals, activity, schedule, and location on Fitacle.',
    url: 'https://fitacle.com',
    siteName: 'Fitacle',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find a Workout Partner | Fitacle',
    description:
      'Never train alone. Find a workout partner or gym buddy matched by goals, schedule, and location on Fitacle.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#fafafa',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
