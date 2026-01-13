"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always refetch fresh data
      gcTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: true, // Always refetch on mount
    },
  },
});

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <title>EtherSky Insurance - Decentralized Flight Protection</title>
        <meta
          name="description"
          content="Instant, blockchain-powered flight delay insurance. Smart contract payouts, zero hassle, complete transparency."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Header />
            <div className="pt-16">{children}</div>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
