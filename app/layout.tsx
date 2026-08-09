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
  title: 'FITACLE | Premium AI Fitness Platform',
  description: 'Become the version you respect. Real fitness. Intelligent results. Sustainable transformation. Your premium AI fitness companion for lasting change.',
  keywords: ['fitness', 'AI fitness', 'body analyzer', 'gym partner', 'workout', 'nutrition', 'transformation'],
  authors: [{ name: 'FITACLE' }],
  openGraph: {
    title: 'FITACLE | Premium AI Fitness Platform',
    description: 'Become the version you respect. Your premium AI fitness companion for lasting change.',
    type: 'website',
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
