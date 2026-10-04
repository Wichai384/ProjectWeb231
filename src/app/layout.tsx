
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import AuthSessionProvider from "@/components/SessionProvider";
import { ProductCatalogProvider } from "@/context/ProductCatalogContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "Maichailaewnaj",
  description: "Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <AuthSessionProvider>
          <ProductCatalogProvider>
            <Navbar />

            {children}
          </ProductCatalogProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
