import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TODO App",
  description: "Una aplicación simple para gestionar tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <footer>
          Creado por Facundo Tobio. Todos los derechos reservados ~ 2025 © CopyRight
        </footer>
      </body>
    </html>
  );
}
