import "./globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";

import { SessionProvider } from "./_components/context/useCurrentSession";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  metadataBase: new URL("https://creatorbingo.vercel.app/"),
  title: "Creator Bingo",
  description: "Creator bingo fan-made webpage",
  openGraph: {
    title: "Creator Bingo",
    description: "Creator bingo fan-made webpage",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable}`}
    >
      <body className="overflow-y-auto bg-black">
        <TRPCReactProvider headers={headers()}>
          <SessionProvider>
            <Toaster
              position="bottom-right"
              gutter={8}
              toastOptions={{
                style: {
                  color: "white",
                  padding: "0.3rem 0.5rem",
                  background: "black",
                  border: "2px solid rgb(229 231 235 / 0.1)",
                },
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(rgba(229,231,235,0.1)_1px,transparent_1px)] [background-size:16px_16px] z-[-1]" />

            <Sidebar />

            <div className="lg:pl-72">
              <div className="max-w-5xl max-h-screen px-2 pt-20 mx-auto space-y-8 overflow-hidden lg:px-8 lg:py-8">
                <div className="p-px rounded-lg shadow-lg bg-vc-border-gradient shadow-black/20">
                  <div className="rounded-lg bg-black p-3.5 lg:p-6 border border-gray-200/10">
                    <div className="space-y-10">{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
