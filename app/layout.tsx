import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "As-Sakinah Mart",
  description:
    "Toko online As-Sakinah Mart. Belanja mudah dengan pembayaran Cash on Delivery (COD).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
