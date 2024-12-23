import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  subsets: ["latin"], // You can add more subsets if needed
  weight: ["400", "500", "700" , "800"], // Specify the weights you want
});

export const metadata: Metadata = {
  title: "szare",
  description: "roboust file sharing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
      <Toaster />
      </body>
    </html>
  );
}
