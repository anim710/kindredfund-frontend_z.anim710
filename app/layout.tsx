import { Fraunces, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import { AuthProvider } from "@/modules/auth/AuthProvider";
import { Navbar, Footer } from "@/shared/components/Navbar";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "KindredFund",
    template: "%s · KindredFund",
  },
  description: "Community crowdfunding powered by credits",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
