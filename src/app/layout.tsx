import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Contoh jika menggunakan font Inter
import "./globals.css";
import Navbar from "@/components/Navbar"; // Pastikan import Navbar ini ada

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokdakan Cibunar Lestari",
  description: "Pusat budidaya lele unggulan di Cibunar-Cibatu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} pt-20`}> 
        {/* pt-20 memberikan jarak atas agar konten tidak tertutup Navbar yang melayang */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}