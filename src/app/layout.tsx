import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Sidebar } from "./_components/sidebar";
import "./globals.css";

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
      className={`[color-scheme:dark] ${GeistSans.variable}`}
    >
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.1)_1px,transparent_1px)] [background-size:16px_16px] z-[-1]"/>
      <body
        className="bg-black overflow-y-auto pb-36"
      >
        <Sidebar />
        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6 border border-gray-200/10">
                <div className="space-y-10">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

