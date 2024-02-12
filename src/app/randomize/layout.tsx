import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Randomize | CyberPunk 2077 Hacking Solver',
  description:
    `Cyberpunk 2077 Breach Protocol hacking minigame solver. Can't come up with a solution to grab all of the unlockables? We've got you covered.`,
  generator: 'Next.js',
  category: 'Game',
  applicationName: 'CyberPunk 2077 Hacking Solver',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Game',
    'CyberPunk 2077 Hacking Solver',
    'Breach Protocol',
  ],
  colorScheme: 'normal',
  metadataBase: new URL('https://cyberpunk2077.fairuzald.com/randomize'),
  openGraph: {
    title: 'CyberPunk 2077 Hacking Solver',
    description:
      `Cyberpunk 2077 Breach Protocol hacking minigame solver. Can't come up with a solution to grab all of the unlockables? We've got you covered.`,
    url: 'https://cyberpunk2077.fairuzald.com/randomize',
    siteName: 'CyberPunk 2077 Hacking Solver',
    images: [
      {
        url: '/vercel.svg',
        width: 1200,
        height: 630,
        alt: 'CyberPunk 2077 Hacking Solver Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberPunk 2077 Hacking Solver',
    description:
      `Cyberpunk 2077 Breach Protocol hacking minigame solver. Can't come up with a solution to grab all of the unlockables? We've got you covered.`,
    images: [
      {
        url: '/vercel.svg',
        width: 1200,
        height: 630,
        alt: 'CyberPunk 2077 Hacking Solver Logo',
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>

      {children}
    </div>

  )
}
