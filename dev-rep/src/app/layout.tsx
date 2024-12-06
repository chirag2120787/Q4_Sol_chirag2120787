import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WalletProvider } from "./components/WalletProvider";
import '@solana/wallet-adapter-react-ui/styles.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Developer Reputation Tracker",
  description: "Track and showcase your development impact across platforms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('RootLayout');
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-900`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
