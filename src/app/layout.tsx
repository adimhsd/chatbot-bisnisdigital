import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BisDig Buddy - AI Assistant UNIKU',
  description:
    'AI Assistant untuk Prodi Bisnis Digital UNIKU - Tanya jawab seputar pendaftaran, kurikulum, dan SOP akademik',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BisDig Buddy',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="description" content={metadata.description as string} />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
