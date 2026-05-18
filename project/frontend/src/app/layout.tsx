import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Mastery',
  description: 'Algorithm and System Design Hub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* THIS IS THE MAGIC LINE THAT FIXES ALL YOUR ICONS */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}